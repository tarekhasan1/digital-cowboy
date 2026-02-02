// actions/email-va/inbox.ts
'use server';

import { collections } from '../../lib/email-va/firebase';

/**
 * Get inbox messages with optional status filtering
 * @param limit - Number of messages to fetch
 * @param filterStatus - Optional status filter (unread, spam, archived, sent, etc)
 * @param excludeStatuses - Statuses to exclude (default: ['deleted'])
 */
export async function getInboxMessages(
  limit: number = 50,
  filterStatus?: string,
  excludeStatuses: string[] = ['deleted']
) {
  try {
    let query: any = collections.inbox.orderBy('createdAt', 'desc');

    // If specific status filter is provided
    if (filterStatus) {
      if (filterStatus === 'unread') {
        // Unread = not sent yet and not archived
        query = query
          .where('status', '==', 'unread')
          .orderBy('createdAt', 'desc');
      } else if (filterStatus === 'spam') {
        // Spam = intent is marked as spam
        query = query
          .where('intent', '==', 'spam')
          .orderBy('createdAt', 'desc');
      } else if (filterStatus === 'archived') {
        query = query
          .where('status', '==', 'archived')
          .orderBy('createdAt', 'desc');
      } else {
        query = query
          .where('status', '==', filterStatus)
          .orderBy('createdAt', 'desc');
      }
    } else {
      // Default: exclude deleted messages
      // Note: Firestore doesn't support direct "NOT IN" for single queries,
      // so we'll fetch and filter in memory for best UX
    }

    const snapshot = await query.limit(limit * 2).get(); // Fetch more to account for filtering
    
    let messages = snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        fromEmail: data.fromEmail || '',
        fromName: data.fromName || undefined,
        subject: data.subject || '',
        body: data.body || '',
        intent: data.intent || undefined,
        priority: data.priority || 'medium',
        status: data.status || 'unread',
        aiReply: data.aiReply || undefined,
        aiApproved: data.aiApproved || false,
        resendEmailId: data.resendEmailId || undefined,
        // 🔥 FIX: Convert Firestore Timestamps to serializable format
        createdAt: data.createdAt?.toDate?.() 
          ? data.createdAt.toDate().toISOString() 
          : (data.createdAt instanceof Date 
              ? data.createdAt.toISOString() 
              : new Date().toISOString()),
        updatedAt: data.updatedAt?.toDate?.() 
          ? data.updatedAt.toDate().toISOString() 
          : (data.updatedAt instanceof Date 
              ? data.updatedAt.toISOString() 
              : new Date().toISOString()),
      };
    });

    // Filter out excluded statuses
    messages = messages.filter(msg => !excludeStatuses.includes(msg.status));
    
    // Trim to limit
    messages = messages.slice(0, limit);

    console.log(`📬 Fetched ${messages.length} inbox messages${filterStatus ? ` (filter: ${filterStatus})` : ''}`);

    return {
      success: true,
      messages,
    };
  } catch (error: any) {
    console.error('Get inbox messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
}