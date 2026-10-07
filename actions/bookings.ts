'use server';

import { collections } from '@/lib/email-va/firebase';
import { upsertContact } from './crm/contacts';
import { createLead } from './crm/leads';
import { logActivity } from './crm/activity';
import { checkAndFireAutomations } from './automations';
import { getSiteSettings } from './settings';
import { BOOKING_TIMEZONE } from '@/lib/constants';
import { resend } from '@/lib/email-va/resend';

export interface Booking {
  id?: string;
  contactId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  notes?: string;
  dateISO: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  createdAt?: string | Date;
}

function todayISOInBrisbane(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function nowTimeInBrisbane(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BOOKING_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

function weekdayId(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  // Numeric Date constructor reads these as a plain calendar date — weekday
  // is a calendar property, not timezone-sensitive, so this is safe even
  // though the server process itself may run in UTC.
  const ids = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return ids[new Date(y, m - 1, d).getDay()];
}

function formatDateTime(dateISO: string, time: string): string {
  const instant = new Date(`${dateISO}T${time}:00+10:00`);
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(instant);
}

/**
 * Lightweight window info for the client to render a date picker without
 * fetching slots for every candidate date individually.
 */
export async function getBookingWindow() {
  try {
    const settings = await getSiteSettings();
    return {
      success: true,
      todayISO: todayISOInBrisbane(),
      daysAhead: settings.bookingDaysAhead,
      enabledDays: settings.bookingEnabledDays,
      blackoutDates: settings.bookingBlackoutDates,
      timezone: BOOKING_TIMEZONE,
    };
  } catch (error: any) {
    console.error('Get booking window error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generates the bookable time slots for a given date, excluding ones already
 * taken. dateISO is a calendar date (YYYY-MM-DD) interpreted in Australia/Brisbane.
 */
export async function getAvailableSlots(dateISO: string) {
  try {
    const settings = await getSiteSettings();
    const todayISO = todayISOInBrisbane();

    if (dateISO < todayISO) return { success: true, slots: [] as string[] };

    const maxDate = new Date(todayISO);
    maxDate.setDate(maxDate.getDate() + settings.bookingDaysAhead);
    const maxISO = maxDate.toISOString().slice(0, 10);
    if (dateISO > maxISO) return { success: true, slots: [] as string[] };

    if (!settings.bookingEnabledDays.includes(weekdayId(dateISO))) {
      return { success: true, slots: [] as string[] };
    }
    if (settings.bookingBlackoutDates.includes(dateISO)) {
      return { success: true, slots: [] as string[] };
    }

    const [startH, startM] = settings.bookingStartTime.split(':').map(Number);
    const [endH, endM] = settings.bookingEndTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const candidates: string[] = [];
    for (let t = startMinutes; t + settings.bookingSlotMinutes <= endMinutes; t += settings.bookingSlotMinutes) {
      candidates.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
    }

    // Exclude slots earlier than now, if booking for today.
    const nowTime = dateISO === todayISO ? nowTimeInBrisbane() : null;

    // Exclude already-booked slots.
    const existingSnapshot = await collections.bookings.where('dateISO', '==', dateISO).get();
    const takenTimes = new Set(
      existingSnapshot.docs
        .map((doc: any) => doc.data())
        .filter((b: any) => b.status !== 'cancelled')
        .map((b: any) => b.startTime)
    );

    const slots = candidates.filter(time => {
      if (nowTime && time <= nowTime) return false;
      if (takenTimes.has(time)) return false;
      return true;
    });

    return { success: true, slots };
  } catch (error: any) {
    console.error('Get available slots error:', error);
    return { success: false, error: error.message, slots: [] as string[] };
  }
}

export async function createBooking(params: {
  dateISO: string;
  startTime: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  notes?: string;
}) {
  try {
    const slotsResult = await getAvailableSlots(params.dateISO);
    if (!slotsResult.success || !slotsResult.slots.includes(params.startTime)) {
      return { success: false, error: 'That time slot is no longer available. Please pick another.' };
    }

    const settings = await getSiteSettings();
    const [startH, startM] = params.startTime.split(':').map(Number);
    const endTotal = startH * 60 + startM + settings.bookingSlotMinutes;
    const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, '0')}:${String(endTotal % 60).padStart(2, '0')}`;

    const contactRes = await upsertContact({
      name: params.name,
      email: params.email,
      company: params.company,
      phone: params.phone,
      type: 'lead',
    });
    if (!contactRes.success || !contactRes.contactId) {
      return { success: false, error: 'Failed to process contact' };
    }
    const contactId = contactRes.contactId;

    await createLead({
      contactId,
      serviceInterest: params.service || 'Discovery Call',
      status: 'New',
    });

    const data: any = {
      contactId,
      name: params.name,
      email: params.email,
      phone: params.phone,
      company: params.company,
      service: params.service,
      notes: params.notes,
      dateISO: params.dateISO,
      startTime: params.startTime,
      endTime,
      timezone: BOOKING_TIMEZONE,
      status: 'scheduled',
      createdAt: new Date(),
    };
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const ref = await collections.bookings.add(data);

    const whenLabel = formatDateTime(params.dateISO, params.startTime);

    await logActivity({
      contactId,
      type: 'discovery_call_booked',
      title: 'Discovery Call Booked',
      description: whenLabel,
      metadata: { bookingId: ref.id },
    });

    await resend.sendEmail({
      to: settings.notifyEmail,
      subject: `New Discovery Call booked: ${params.name}`,
      html: `
        <h2>New Discovery Call Booking</h2>
        <p><strong>When:</strong> ${whenLabel}</p>
        <p><strong>Name:</strong> ${params.name}</p>
        <p><strong>Email:</strong> ${params.email}</p>
        <p><strong>Phone:</strong> ${params.phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${params.company || 'N/A'}</p>
        <p><strong>Service:</strong> ${params.service || 'General'}</p>
        ${params.notes ? `<p><strong>Notes:</strong> ${params.notes.replace(/\n/g, '<br>')}</p>` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/bookings">View in Admin</a></p>
      `,
    });

    await resend.sendEmail({
      to: params.email,
      subject: `Your Discovery Call is booked — ${whenLabel}`,
      html: `
        <p>Hi ${params.name.split(' ')[0]},</p>
        <p>Your discovery call is confirmed for:</p>
        <p style="font-size:18px;font-weight:bold;">${whenLabel}</p>
        <p>We'll be in touch shortly before the call. If you need to reschedule, just reply to this email.</p>
        <p>Best regards,<br>The DigitalCowboy Team</p>
      `,
    });

    await checkAndFireAutomations('discovery_call_booked', {
      contactId,
      contactEmail: params.email,
      contactName: params.name,
    });

    return { success: true, bookingId: ref.id };
  } catch (error: any) {
    console.error('Create booking error:', error);
    return { success: false, error: error.message };
  }
}

export async function getBookings(filters?: { upcoming?: boolean; limit?: number }) {
  try {
    let bookings = (await collections.bookings.orderBy('dateISO', 'desc').get()).docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : undefined,
      };
    });

    if (filters?.upcoming) {
      const todayISO = todayISOInBrisbane();
      bookings = bookings
        .filter((b: any) => b.dateISO >= todayISO && b.status === 'scheduled')
        .sort((a: any, b: any) => (a.dateISO + a.startTime).localeCompare(b.dateISO + b.startTime));
    }

    if (filters?.limit) {
      bookings = bookings.slice(0, filters.limit);
    }

    return { success: true, bookings };
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return { success: false, error: error.message, bookings: [] };
  }
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  try {
    await collections.bookings.doc(id).update({ status, updatedAt: new Date() });
    return { success: true };
  } catch (error: any) {
    console.error('Update booking status error:', error);
    return { success: false, error: error.message };
  }
}
