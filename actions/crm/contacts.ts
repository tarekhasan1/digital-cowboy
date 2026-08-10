'use server';

import { collections } from '@/lib/email-va/firebase';

export interface Contact {
  id?: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  type: 'lead' | 'customer' | 'subscriber' | 'contact';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'unsubscribed' | 'bounced' | 'active';
  score: number;
  source?: string;
  tags: string[];
  customFields?: Record<string, any>;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  lastContactAt?: string | Date;
  nextFollowUpAt?: string | Date;
}

/**
 * Get contacts with optional filters
 */
export async function getContacts(filters?: {
  type?: string;
  status?: string;
  tags?: string[];
  search?: string;
  limit?: number;
}) {
  try {
    let query: any = collections.contacts.orderBy('createdAt', 'desc');

    if (filters?.type) {
      query = query.where('type', '==', filters.type);
    }
    
    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.where('tags', 'array-contains-any', filters.tags);
    }

    const snapshot = await query.limit(filters?.limit || 100).get();

    let contacts = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
        lastContactAt: data.lastContactAt?.toDate?.() ? data.lastContactAt.toDate().toISOString() : undefined,
        nextFollowUpAt: data.nextFollowUpAt?.toDate?.() ? data.nextFollowUpAt.toDate().toISOString() : undefined,
      };
    });

    // In-memory search if requested
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      contacts = contacts.filter((c: Contact) => 
        c.email.toLowerCase().includes(term) || 
        c.name?.toLowerCase().includes(term) || 
        c.company?.toLowerCase().includes(term)
      );
    }

    return { success: true, contacts };
  } catch (error: any) {
    console.error('Get contacts error:', error);
    return { success: false, error: error.message, contacts: [] };
  }
}

/**
 * Get a single contact by ID
 */
export async function getContactById(id: string) {
  try {
    const doc = await collections.contacts.doc(id).get();
    if (!doc.exists) {
      return { success: false, error: 'Contact not found' };
    }

    const data = doc.data()!;
    const contact = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      lastContactAt: data.lastContactAt?.toDate?.() ? data.lastContactAt.toDate().toISOString() : undefined,
      nextFollowUpAt: data.nextFollowUpAt?.toDate?.() ? data.nextFollowUpAt.toDate().toISOString() : undefined,
    };

    return { success: true, contact };
  } catch (error: any) {
    console.error('Get contact by id error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Find contact by email
 */
export async function findContactByEmail(email: string) {
  try {
    const snapshot = await collections.contacts
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { success: false, error: 'Contact not found', contact: null };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const contact = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    };

    return { success: true, contact };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create or Update Contact
 */
export async function upsertContact(params: Partial<Contact> & { email: string }) {
  try {
    const email = params.email.toLowerCase().trim();
    
    // Check if exists
    const existing = await findContactByEmail(email);
    
    const cleanData: Record<string, any> = { ...params, email };
    delete cleanData.id;
    // Firestore throws error on undefined fields unless ignoreUndefinedProperties is set
    Object.keys(cleanData).forEach(key => cleanData[key] === undefined && delete cleanData[key]);
    cleanData.updatedAt = new Date();

    if (existing.success && existing.contact) {
      // Update
      await collections.contacts.doc(existing.contact.id).update(cleanData);
      return { success: true, contactId: existing.contact.id, action: 'updated' };
    } else {
      // Create
      cleanData.createdAt = new Date();
      cleanData.type = cleanData.type || 'contact';
      cleanData.status = cleanData.status || 'new';
      cleanData.score = cleanData.score || 0;
      cleanData.tags = cleanData.tags || [];
      
      const ref = await collections.contacts.add(cleanData);
      return { success: true, contactId: ref.id, action: 'created' };
    }
  } catch (error: any) {
    console.error('Upsert contact error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete Contact
 */
export async function deleteContact(id: string) {
  try {
    await collections.contacts.doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Delete contact error:', error);
    return { success: false, error: error.message };
  }
}
