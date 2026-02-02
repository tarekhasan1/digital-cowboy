// actions/email-va/inbox.ts
'use server';

import { collections } from '../../lib/email-va/firebase';

/**
 * Get inbox messages with optional status filtering and pagination
 * @param limit - Number of messages to fetch
 * @param offset - Number of messages to skip (for pagination)
 * @param filterStatus - Optional status filter (unread, spam, archived, sent, etc)
 * @param excludeStatuses - Statuses to exclude (default: ['deleted'])
 */
export async function getInboxMessages(
  limit: number = 50,
  offset: number = 0,
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

    const snapshot = await query.limit(limit + offset).get(); // Fetch more for pagination
    
    let messages = snapshot.docs.map((doc: any) => {
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
    messages = messages.filter((msg: any) => !excludeStatuses.includes(msg.status));
    
    // Get total count before pagination
    const totalCount = messages.length;
    
    // Apply offset and limit for pagination
    messages = messages.slice(offset, offset + limit);

    console.log(`📬 Fetched ${messages.length} inbox messages (offset: ${offset}, total: ${totalCount})${filterStatus ? ` (filter: ${filterStatus})` : ''}`);

    return {
      success: true,
      messages,
      total: totalCount,
      offset,
      limit,
      hasMore: offset + limit < totalCount,
    };
  } catch (error: any) {
    console.error('Get inbox messages error:', error);
    return { success: false, error: error.message, messages: [], total: 0, hasMore: false };
  }
}