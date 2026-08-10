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
    if (params.status) {
      const doc = await collections.leads.doc(id).get();
      if (doc.exists) {
        const { logActivity } = await import('./activity');
        await logActivity({
          contactId: doc.data()?.contactId,
          type: 'lead_status_changed',
          title: 'Lead Status Changed',
          description: `Moved to ${params.status}`,
        });
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
