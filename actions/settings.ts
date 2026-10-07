'use server';

import { collections } from '@/lib/email-va/firebase';

export interface SiteSettings {
  siteName: string;
  supportEmail: string;
  address: string;
  primaryColor: string;
  notifyEmail: string;
  notifyOnNewLead: boolean;
  notifyOnNewEnquiry: boolean;
  // Discovery Call booking availability. Timezone is fixed to Australia/Brisbane
  // (QLD has no daylight saving, so a constant offset is safe without a tz library).
  bookingEnabledDays: string[];
  bookingStartTime: string;
  bookingEndTime: string;
  bookingSlotMinutes: number;
  bookingDaysAhead: number;
  bookingBlackoutDates: string[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'DigitalCowboy',
  supportEmail: 'hello@digitalcowboy.com.au',
  address: 'Perth, Western Australia',
  primaryColor: '#c72635',
  notifyEmail: 'tarekhasan.tkg101@gmail.com',
  notifyOnNewLead: true,
  notifyOnNewEnquiry: true,
  bookingEnabledDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  bookingStartTime: '09:00',
  bookingEndTime: '17:00',
  bookingSlotMinutes: 30,
  bookingDaysAhead: 14,
  bookingBlackoutDates: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const doc = await collections.config.doc('siteSettings').get();
    if (!doc.exists) return DEFAULT_SETTINGS;

    const data = doc.data() || {};
    return { ...DEFAULT_SETTINGS, ...data };
  } catch (error) {
    console.error('Get site settings error:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(params: Partial<SiteSettings>) {
  try {
    await collections.config.doc('siteSettings').set(
      { ...params, updatedAt: new Date() },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    console.error('Save site settings error:', error);
    return { success: false, error: error.message };
  }
}
