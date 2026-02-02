// actions/email-va/inbox-advanced.ts
'use server';

import { collections } from '../../lib/email-va/firebase';
import { resend } from '../../lib/email-va/resend';
import { InboxMessage, PaginationResult, InboxFilters } from '../../lib/email-va/types';

/**
 * Get paginated inbox messages with filtering and search
 */
export async function getInboxMessagesPaginated(
  filters: InboxFilters,
  limit: number = 20,
  cursor?: string
): Promise<PaginationResult<InboxMessage>> {
  try {
    // Start with category filter only (indexed)
    let query = collections.inbox.where('category', '==', filters.category);

    // Order by created date descending
    query = query.orderBy('createdAt', 'desc');

    // Add pagination
    if (cursor) {
      const cursorDoc = await collections.inbox.doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    // Fetch one extra to determine if there are more results
    const snapshot = await query.limit(limit + 1).get();

    const hasMore = snapshot.docs.length > limit;
    const docs = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs;

    // Format messages and apply client-side filtering
    let messages = docs.map(doc => formatMessage(doc));

    // Apply priority filter on client side
    if (filters.priority) {
      messages = messages.filter(msg => msg.priority === filters.priority);
    }

    // Apply status filter on client side
    if (filters.status) {
      messages = messages.filter(msg => msg.status === filters.status);
    }

    // Search in results if needed
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      messages = messages.filter(msg =>
        msg.subject.toLowerCase().includes(searchLower) ||
        msg.fromEmail.toLowerCase().includes(searchLower) ||
        msg.fromName?.toLowerCase().includes(searchLower) ||
        msg.body.toLowerCase().includes(searchLower)
      );
    }

    // Get total count for this category
    const totalSnapshot = await collections.inbox
      .where('category', '==', filters.category)
      .count()
      .get();

    return {
      items: messages,
      hasMore,
      cursor: messages.length > 0 ? messages[messages.length - 1].id : undefined,
      total: totalSnapshot.data().count,
    };
  } catch (error: any) {
    console.error('Get paginated inbox messages error:', error);
    return { items: [], hasMore: false, total: 0 };
  }
}

/**
 * Get unread count by category
 */
export async function getInboxCounts() {
  try {
    const [inboxDocs, spamDocs, archivedDocs] = await Promise.all([
      collections.inbox
        .where('category', '==', 'inbox')
        .get(),
      collections.inbox
        .where('category', '==', 'spam')
        .get(),
      collections.inbox
        .where('category', '==', 'archived')
        .get(),
    ]);

    // Count unread on client side
    const inboxCount = inboxDocs.docs.filter(d => d.data().status === 'unread').length;
    const spamCount = spamDocs.docs.filter(d => d.data().status === 'unread').length;
    const archivedCount = archivedDocs.docs.filter(d => d.data().status === 'unread').length;

    return {
      inbox: inboxCount,
      spam: spamCount,
      archived: archivedCount,
    };
  } catch (error: any) {
    console.error('Get inbox counts error:', error);
    return { inbox: 0, spam: 0, archived: 0 };
  }
}

/**
 * Hard delete message from database and attempt Resend deletion
 */
export async function permanentlyDeleteMessage(messageId: string) {
  try {
    const messageDoc = await collections.inbox.doc(messageId).get();

    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    const message = messageDoc.data() as InboxMessage;

    // Delete from Resend if it has resendEmailId
    if (message?.resendEmailId) {
      try {
        // Resend doesn't support direct deletion, so we log it
        // In production, you might want to:
        // 1. Mark as "deleted" in Resend's system
        // 2. Use suppression lists
        // 3. Have a webhook to handle bounce/complaint events
        console.log(`📧 Marked Resend email ${message.resendEmailId} as deleted in DB`);

        // Optional: Add to suppression list in a separate collection
        await collections.add({
          resendEmailId: message.resendEmailId,
          email: message.fromEmail,
          deletedAt: new Date(),
          reason: 'user_deleted',
        });
      } catch (error) {
        console.error('Error handling Resend deletion:', error);
      }
    }

    // Hard delete from database
    await collections.inbox.doc(messageId).delete();

    console.log(`🗑️ Permanently deleted message ${messageId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Permanent delete message error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk hard delete messages
 */
export async function bulkPermanentlyDeleteMessages(messageIds: string[]) {
  try {
    if (!messageIds.length) {
      return { success: false, error: 'No messages selected' };
    }

    // Get all messages first
    const messageSnapshots = await Promise.all(
      messageIds.map(id => collections.inbox.doc(id).get())
    );

    // Delete from Resend if applicable
    for (const doc of messageSnapshots) {
      if (doc.exists) {
        const message = doc.data() as InboxMessage;
        if (message?.resendEmailId) {
          try {
            await collections.add({
              resendEmailId: message.resendEmailId,
              email: message.fromEmail,
              deletedAt: new Date(),
              reason: 'bulk_delete',
            });
          } catch (error) {
            console.error('Error marking Resend deletion:', error);
          }
        }
      }
    }

    // Batch delete from database
    const batch = collections.batch?.() || [];
    for (const messageId of messageIds) {
      batch.delete(collections.inbox.doc(messageId));
    }
    await batch.commit?.();

    console.log(`🗑️ Permanently deleted ${messageIds.length} messages`);
    return { success: true, deleted: messageIds.length };
  } catch (error: any) {
    console.error('Bulk permanent delete error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Move message to category (inbox, spam, archived)
 */
export async function moveMessageToCategory(
  messageId: string,
  newCategory: 'inbox' | 'spam' | 'archived'
) {
  try {
    const messageDoc = await collections.inbox.doc(messageId).get();

    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    await collections.inbox.doc(messageId).update({
      category: newCategory,
      updatedAt: new Date(),
    });

    console.log(`📁 Moved message ${messageId} to ${newCategory}`);
    return { success: true };
  } catch (error: any) {
    console.error('Move message error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk move messages to category
 */
export async function bulkMoveMessages(
  messageIds: string[],
  newCategory: 'inbox' | 'spam' | 'archived'
) {
  try {
    if (!messageIds.length) {
      return { success: false, error: 'No messages selected' };
    }

    const batch = collections.batch?.() || [];
    const now = new Date();

    for (const messageId of messageIds) {
      batch.update(collections.inbox.doc(messageId), {
        category: newCategory,
        updatedAt: now,
      });
    }

    await batch.commit?.();

    console.log(`📁 Moved ${messageIds.length} messages to ${newCategory}`);
    return { success: true, moved: messageIds.length };
  } catch (error: any) {
    console.error('Bulk move error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark message as read/unread
 */
export async function markMessageAsRead(messageId: string, isRead: boolean) {
  try {
    await collections.inbox.doc(messageId).update({
      status: isRead ? 'read' : 'unread',
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Mark as read error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk mark messages as read
 */
export async function bulkMarkAsRead(messageIds: string[], isRead: boolean) {
  try {
    if (!messageIds.length) {
      return { success: false, error: 'No messages selected' };
    }

    const batch = collections.batch?.() || [];
    const status = isRead ? 'read' : 'unread';

    for (const messageId of messageIds) {
      batch.update(collections.inbox.doc(messageId), {
        status,
        updatedAt: new Date(),
      });
    }

    await batch.commit?.();

    return { success: true, updated: messageIds.length };
  } catch (error: any) {
    console.error('Bulk mark as read error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to format message document
 */
function formatMessage(doc: any): InboxMessage {
  const data = doc.data();

  return {
    id: doc.id,
    fromEmail: data.fromEmail || '',
    fromName: data.fromName || undefined,
    subject: data.subject || '',
    body: data.body || '',
    intent: data.intent || undefined,
    priority: data.priority || 'medium',
    category: data.category || 'inbox',
    status: data.status || 'unread',
    aiReply: data.aiReply || undefined,
    aiReplyEdited: data.aiReplyEdited || undefined,
    aiApproved: data.aiApproved || false,
    manualReply: data.manualReply || undefined,
    replyType: data.replyType || undefined,
    resendEmailId: data.resendEmailId || undefined,
    sentAt: data.sentAt?.toDate?.() ? data.sentAt.toDate() : undefined,
    createdAt: data.createdAt?.toDate?.()
      ? data.createdAt.toDate()
      : new Date(),
    updatedAt: data.updatedAt?.toDate?.()
      ? data.updatedAt.toDate()
      : new Date(),
  };
}

/**
 * Get single message
 */
export async function getInboxMessage(messageId: string) {
  try {
    const doc = await collections.inbox.doc(messageId).get();

    if (!doc.exists) {
      return { success: false, error: 'Message not found', message: null };
    }

    return { success: true, message: formatMessage(doc) };
  } catch (error: any) {
    console.error('Get message error:', error);
    return { success: false, error: error.message, message: null };
  }
}
