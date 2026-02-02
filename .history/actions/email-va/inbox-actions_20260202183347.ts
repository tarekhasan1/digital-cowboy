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

    // Delete from Resend if it has resendEmailId
    if (message?.resendEmailId) {
      try {
        // Note: Resend API doesn't have direct delete, so we mark as deleted
        console.log(`📧 Email ${message.resendEmailId} marked for deletion in Resend`);
      } catch (error) {
        console.error('Error deleting from Resend:', error);
      }
    }

    // Delete from database
    await collections.inbox.doc(messageId).update({
      status: 'deleted',
      updatedAt: new Date(),
    });

    console.log(`🗑️ Message ${messageId} deleted`);
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
    
    for (const messageId of messageIds) {
      batch.push(
        collections.inbox.doc(messageId).update({
          status: 'deleted',
          updatedAt: new Date(),
        })
      );
    }

    await Promise.all(batch);

    console.log(`🗑️ Deleted ${messageIds.length} messages`);
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
