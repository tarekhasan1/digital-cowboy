'use server';

import { collections } from '@/lib/email-va/firebase';
import { Contact } from './contacts';

export interface Conversation {
  id?: string;
  contactId: string;
  subject: string;
  lastMessageSnippet?: string;
  unreadCount: number;
  isStarred: boolean;
  isArchived: boolean;
  labels: string[];
  latestDirection?: 'inbound' | 'outbound';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  lastMessageAt?: string | Date;
}

export async function getConversations(filters?: {
  contactId?: string;
  isArchived?: boolean;
  isStarred?: boolean;
  folder?: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archived';
  limit?: number;
}) {
  try {
    // We only order by lastMessageAt and do filtering in memory to avoid needing complex Firestore composite indexes
    const snapshot = await collections.conversations.orderBy('lastMessageAt', 'desc').get();

    let conversations = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : undefined,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : undefined,
        lastMessageAt: data.lastMessageAt?.toDate?.() ? data.lastMessageAt.toDate().toISOString() : undefined,
      };
    });

    if (filters?.contactId) {
      conversations = conversations.filter((c: any) => c.contactId === filters.contactId);
    }
    
    // Folder logic
    if (filters?.folder) {
      if (filters.folder === 'sent') {
        conversations = conversations.filter((c: any) => c.latestDirection === 'outbound' && !c.labels?.includes('trash'));
      } else if (filters.folder === 'inbox') {
        conversations = conversations.filter((c: any) => c.latestDirection !== 'outbound' && !c.isArchived && !c.labels?.includes('trash') && !c.labels?.includes('spam'));
      } else if (filters.folder === 'archived') {
        conversations = conversations.filter((c: any) => !!c.isArchived === true && !c.labels?.includes('trash'));
      } else if (filters.folder === 'trash') {
        conversations = conversations.filter((c: any) => c.labels?.includes('trash'));
      } else if (filters.folder === 'spam') {
        conversations = conversations.filter((c: any) => c.labels?.includes('spam'));
      } else if (filters.folder === 'drafts') {
        const draftMsgs = await collections.emailMessages.where('deliveryStatus', '==', 'draft').get();
        const convIdsWithDrafts = new Set(draftMsgs.docs.map((d: any) => d.data().conversationId));
        conversations = conversations.filter((c: any) => convIdsWithDrafts.has(c.id) && !c.labels?.includes('trash'));
      }
    } else {
      // Legacy behavior fallback
      if (filters?.isArchived !== undefined) {
        conversations = conversations.filter((c: any) => !!c.isArchived === filters.isArchived && !c.labels?.includes('trash'));
      }
    }

    if (filters?.isStarred) {
      conversations = conversations.filter((c: any) => !!c.isStarred === true);
    }

    if (filters?.limit) {
      conversations = conversations.slice(0, filters.limit);
    }

    return { success: true, conversations };
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return { success: false, error: error.message, conversations: [] };
  }
}

export async function getConversationById(id: string) {
  try {
    const doc = await collections.conversations.doc(id).get();
    if (!doc.exists) return { success: false, error: 'Not found' };
    
    const data = doc.data()!;
    return { 
      success: true, 
      conversation: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : undefined,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : undefined,
        lastMessageAt: data.lastMessageAt?.toDate?.() ? data.lastMessageAt.toDate().toISOString() : undefined,
      } as Conversation
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createConversation(params: Partial<Conversation> & { contactId: string, subject: string }) {
  try {
    const data: any = {
      ...params,
      unreadCount: params.unreadCount || 0,
      isStarred: params.isStarred || false,
      isArchived: params.isArchived || false,
      labels: params.labels || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
    };
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    
    const ref = await collections.conversations.add(data);
    return { success: true, conversationId: ref.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateConversation(id: string, updates: Partial<Conversation>) {
  try {
    const cleanUpdates = { ...updates, updatedAt: new Date() };
    delete cleanUpdates.id;
    
    await collections.conversations.doc(id).update(cleanUpdates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
