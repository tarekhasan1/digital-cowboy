// actions/email-va/inbox-actions.ts
'use server';

import { collections } from '../../lib/email-va/firebase';
import { resend } from '../../lib/email-va/resend';

/**
 * Delete a single message from database and Resend
 */
export async function deleteInboxMessage(messageId: string) {
  try {
    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    const message = messageDoc.data();

    // Track deleted resendEmailId to prevent re-syncing
    if (message?.resendEmailId) {
      try {
        await collections.deletedEmails.add({
          resendEmailId: message.resendEmailId,
          fromEmail: message.fromEmail,
          subject: message.subject,
          deletedAt: new Date(),
        });
        console.log(`📌 Marked resendEmailId ${message.resendEmailId} as deleted to prevent re-sync`);
      } catch (error) {
        console.warn('Warning: Could not track deleted email:', error);
      }
    }

    // Delete from database
    await collections.inbox.doc(messageId).delete();

    console.log(`🗑️ Message ${messageId} permanently deleted`);
    return { success: true };
  } catch (error: any) {
    console.error('Delete message error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk delete multiple messages
 */
export async function bulkDeleteInboxMessages(messageIds: string[]) {
  try {
    if (!messageIds.length) {
      return { success: false, error: 'No messages selected' };
    }

    const batch = [];
    const deleteTracking = [];
    
    for (const messageId of messageIds) {
      const messageDoc = await collections.inbox.doc(messageId).get();
      if (messageDoc.exists) {
        const message = messageDoc.data();
        
        // Track deleted resendEmailId
        if (message?.resendEmailId) {
          deleteTracking.push({
            resendEmailId: message.resendEmailId,
            fromEmail: message.fromEmail,
            subject: message.subject,
            deletedAt: new Date(),
          });
        }
        
        batch.push(collections.inbox.doc(messageId).delete());
      }
    }

    // Add all deleted emails to tracking
    for (const deletion of deleteTracking) {
      try {
        await collections.deletedEmails.add(deletion);
      } catch (error) {
        console.warn('Warning: Could not track deleted email:', error);
      }
    }

    // Delete all messages
    await Promise.all(batch);

    console.log(`🗑️ Permanently deleted ${messageIds.length} messages`);
    if (deleteTracking.length > 0) {
      console.log(`📌 Tracked ${deleteTracking.length} resendEmailIds to prevent re-sync`);
    }
    return { success: true, deleted: messageIds.length };
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send manual reply to a message
 */
export async function sendManualReply(messageId: string, replyText: string) {
  try {
    if (!replyText.trim()) {
      return { success: false, error: 'Reply text cannot be empty' };
    }

    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    const message = messageDoc.data();
    
    if (!message) {
      return { success: false, error: 'Message data not found' };
    }

    // Send email
    const result = await resend.sendEmail({
      to: message.fromEmail,
      subject: `Re: ${message.subject}`,
      html: replyText.replace(/\n/g, '<br>'),
      text: replyText,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Save to database
    await collections.inbox.doc(messageId).update({
      manualReply: replyText,
      status: 'sent',
      replyType: 'manual',
      sentAt: new Date(),
      updatedAt: new Date(),
    });

    // Log sent email
    await collections.sent.add({
      toEmail: message.fromEmail,
      subject: `Re: ${message.subject}`,
      body: replyText,
      type: 'manual',
      inboxId: messageId,
      sentAt: new Date(),
    });

    console.log(`📤 Manual reply sent to ${message.fromEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('Send manual reply error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update AI reply with edited version and send
 */
export async function sendEditedAIReply(messageId: string, editedReplyText: string) {
  try {
    if (!editedReplyText.trim()) {
      return { success: false, error: 'Reply text cannot be empty' };
    }

    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    const message = messageDoc.data();
    
    if (!message) {
      return { success: false, error: 'Message data not found' };
    }

    // Send email
    const result = await resend.sendEmail({
      to: message.fromEmail,
      subject: `Re: ${message.subject}`,
      html: editedReplyText.replace(/\n/g, '<br>'),
      text: editedReplyText,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Save to database
    await collections.inbox.doc(messageId).update({
      aiReplyEdited: editedReplyText,
      status: 'sent',
      aiApproved: true,
      replyType: 'ai',
      sentAt: new Date(),
      updatedAt: new Date(),
    });

    // Log sent email
    await collections.sent.add({
      toEmail: message.fromEmail,
      subject: `Re: ${message.subject}`,
      body: editedReplyText,
      type: 'manual',
      inboxId: messageId,
      sentAt: new Date(),
    });

    console.log(`📤 Edited AI reply sent to ${message.fromEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('Send edited AI reply error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Archive message
 */
export async function archiveInboxMessage(messageId: string) {
  try {
    await collections.inbox.doc(messageId).update({
      status: 'archived',
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Archive message error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark message as unread/read
 */
export async function markMessageStatus(messageId: string, status: 'unread' | 'read') {
  try {
    await collections.inbox.doc(messageId).update({
      status,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Mark message status error:', error);
    return { success: false, error: error.message };
  }
}
/**
 * Mark message as spam by setting intent to 'spam'
 */
export async function markAsSpam(messageId: string) {
  try {
    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    await collections.inbox.doc(messageId).update({
      intent: 'spam',
      updatedAt: new Date(),
    });

    console.log(`\ud83d\uddd1\ufe0f Message ${messageId} marked as spam`);
    return { success: true };
  } catch (error: any) {
    console.error('Mark as spam error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unmark message from spam
 */
export async function unmarkAsSpam(messageId: string, previousIntent: string = 'other') {
  try {
    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    await collections.inbox.doc(messageId).update({
      intent: previousIntent,
      updatedAt: new Date(),
    });

    console.log(`\u2705 Message ${messageId} unmarked from spam`);
    return { success: true };
  } catch (error: any) {
    console.error('Unmark as spam error:', error);
    return { success: false, error: error.message };
  }
}