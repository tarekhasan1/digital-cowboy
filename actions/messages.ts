'use server';

import { collections } from '@/lib/email-va/firebase';

export interface ContactMessage {
  id?: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  description: string;
  timeline: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt?: string;
}

import { upsertContact } from '@/actions/crm/contacts';
import { createEnquiry } from '@/actions/crm/enquiries';
import { resend } from '@/lib/email-va/resend';

export async function submitContactForm(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) {
  try {
    // 1. Create or Update Contact (Canonical deduplication)
    const contactRes = await upsertContact({
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      type: 'lead',
    });
    
    if (!contactRes.success || !contactRes.contactId) {
      throw new Error('Failed to process contact');
    }

    const contactId = contactRes.contactId;

    // 2. Create Enquiry Record
    await createEnquiry({
      contactId,
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      service: data.service || 'General',
      message: `Budget: ${data.budget}\nTimeline: ${data.timeline}\n\n${data.description}`,
      source: 'Website Form'
    });

    // 3. Send Admin Notification Email
    await resend.sendEmail({
      to: 'admin@digitalcowboy.com',
      subject: `New Website Enquiry from ${data.name}`,
      html: `
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Service:</strong> ${data.service || 'General'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
          ${data.description.replace(/\n/g, '<br>')}
        </blockquote>
        <p><a href="https://digitalcowboy.com/admin/crm">View in CRM</a></p>
      `,
    });

    // 4. Send User Confirmation Email
    await resend.sendEmail({
      to: data.email,
      subject: `Thanks for reaching out to DigitalCowboy`,
      html: `
        <p>Hi ${data.name.split(' ')[0]},</p>
        <p>Thanks for getting in touch with DigitalCowboy. We've received your enquiry regarding ${data.service || 'our services'} and will get back to you shortly.</p>
        <p>Best regards,<br>The DigitalCowboy Team</p>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return { success: false, error: error.message };
  }
}

export async function getContactMessages(filters?: { status?: string }) {
  try {
    let query: any = collections.messages;
    
    query = query.orderBy('createdAt', 'desc');

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    const snapshot = await query.get();

    const messages = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() 
          ? data.createdAt.toDate().toISOString() 
          : new Date().toISOString(),
      };
    });

    return { success: true, messages };
  } catch (error: any) {
    console.error('Get messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']) {
  try {
    const query: any = collections.messages;
    await query.doc(id).update({ status });
    return { success: true };
  } catch (error: any) {
    console.error('Update message error:', error);
    return { success: false, error: error.message };
  }
}
