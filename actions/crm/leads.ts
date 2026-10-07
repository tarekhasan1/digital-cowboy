'use server';

import { collections } from '@/lib/email-va/firebase';

export interface Lead {
  id?: string;
  contactId: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  value?: number;
  serviceInterest?: string;
  aiScore: number;
  nextFollowUp?: string | Date;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export async function getLeads(filters?: { contactId?: string }) {
  try {
    let query: any = collections.leads;
    
    if (filters?.contactId) {
      query = query.where('contactId', '==', filters.contactId);
    }
    
    const snapshot = await query.get();
    const leads = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        nextFollowUp: data.nextFollowUp?.toDate?.() ? data.nextFollowUp.toDate().toISOString() : undefined,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : undefined,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : undefined,
      };
    });
    
    return { success: true, leads };
  } catch (error: any) {
    console.error('Get leads error:', error);
    return { success: false, error: error.message, leads: [] };
  }
}

export async function createLead(params: Partial<Lead> & { contactId: string }) {
  try {
    const data: any = {
      ...params,
      status: params.status || 'New',
      aiScore: params.aiScore || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const ref = await collections.leads.add(data);

    const { logActivity } = await import('./activity');
    await logActivity({
      contactId: params.contactId!,
      type: 'lead_created',
      title: 'Lead Created',
      description: `Value: $${data.value || 0}`,
    });

    const contactDoc = await collections.contacts.doc(params.contactId!).get();
    if (contactDoc.exists) {
      const contact = contactDoc.data()!;
      const { checkAndFireAutomations } = await import('../automations');
      await checkAndFireAutomations('new_lead_added', {
        contactId: params.contactId!,
        contactEmail: contact.email,
        contactName: contact.name,
      });

      const { getSiteSettings } = await import('../settings');
      const settings = await getSiteSettings();
      if (settings.notifyOnNewLead) {
        const { resend } = await import('@/lib/email-va/resend');
        await resend.sendEmail({
          to: settings.notifyEmail,
          subject: `New Lead: ${contact.name || contact.email}`,
          html: `<p>A new lead was added to the pipeline.</p><p><strong>Contact:</strong> ${contact.name || contact.email} (${contact.email})</p><p><strong>Service:</strong> ${data.serviceInterest || 'General'}</p>`,
        });
      }
    }

    return { success: true, leadId: ref.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  try {
    const data: any = { ...updates, updatedAt: new Date() };
    delete data.id;
    
    // Remove undefined values
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    
    await collections.leads.doc(id).update(data);
    
    // Log if status changed
    if (updates.status) {
      const doc = await collections.leads.doc(id).get();
      if (doc.exists) {
        const contactId = doc.data()?.contactId;
        const { logActivity } = await import('./activity');
        await logActivity({
          contactId,
          type: 'lead_status_changed',
          title: 'Lead Status Changed',
          description: `Moved to ${updates.status}`,
        });

        // Keep the linked Contact's lifecycle fields in sync with the pipeline.
        if (contactId && updates.status === 'Won') {
          await collections.contacts.doc(contactId).update({ type: 'customer', status: 'won' });
        } else if (contactId && updates.status === 'Lost') {
          await collections.contacts.doc(contactId).update({ status: 'lost' });
        }
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
