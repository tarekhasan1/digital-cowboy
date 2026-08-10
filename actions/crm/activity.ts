'use server';

import { collections } from '@/lib/email-va/firebase';

export interface ActivityEvent {
  id?: string;
  contactId: string;
  type: 'email_received' | 'email_sent' | 'enquiry_submitted' | 'lead_created' | 'lead_status_changed' | 'note_added';
  title: string;
  description?: string;
  metadata?: any;
  createdAt?: string | Date;
}

export async function logActivity(params: Partial<ActivityEvent> & { contactId: string, type: string, title: string }) {
  try {
    const data = {
      ...params,
      createdAt: params.createdAt || new Date(),
    };
    
    // Remove undefined fields
    Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key]);
    
    const ref = await collections.activityLog.add(data);
    return { success: true, activityId: ref.id };
  } catch (error: any) {
    console.error('Log activity error:', error);
    return { success: false, error: error.message };
  }
}

export async function getContactActivity(contactId: string) {
  try {
    // Basic filtering without compound indexing, sort in memory
    const snapshot = await collections.activityLog
      .where('contactId', '==', contactId)
      .get();
      
    let events = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : undefined,
      };
    });
    
    // Sort descending by createdAt
    events.sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    
    return { success: true, events };
  } catch (error: any) {
    console.error('Get activity error:', error);
    return { success: false, error: error.message, events: [] };
  }
}
