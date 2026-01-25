// actions/email-va/ai-reply.ts
'use server';

import { collections, getConfig } from '../../lib/email-va/firebase';
import { groqAI } from '../../lib/email-va/groq';
import { resend } from '../../lib/email-va/resend';

/**
 * Generate AI reply for an inbox message
 */
export async function generateAIReply(messageId: string) {
  try {
    // Get message
    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    const message = messageDoc.data();

    // Classify intent first (if not already done)
    let intent = message?.intent;
    if (!intent) {
      const classification = await groqAI.classifyIntent(
        `Subject: ${message?.subject}\n\nBody: ${message?.body}`
      );
      
      intent = classification.intent;
      
      // Update message with classification
      await collections.inbox.doc(messageId).update({
        intent: classification.intent,
        priority: classification.priority,
        updatedAt: new Date(),
      });
    }

    // Generate reply
    const reply = await groqAI.generateReply(
      `Subject: ${message?.subject}\n\nBody: ${message?.body}`,
      intent
    );

    // Save AI reply
    await collections.inbox.doc(messageId).update({
      aiReply: reply,
      status: 'drafted',
      updatedAt: new Date(),
    });

    // Check if auto-send is enabled
    const config = await getConfig();
    
    if (config.autoReplyEnabled && !config.requireApproval) {
      // Auto-send without approval
      return await approveAndSendReply(messageId);
    }

    return {
      success: true,
      reply,
      requiresApproval: config.requireApproval,
    };
  } catch (error: any) {
    console.error('Generate AI reply error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Approve and send AI-generated reply
 */
export async function approveAndSendReply(messageId: string) {
  try {
    // Get message
    const messageDoc = await collections.inbox.doc(messageId).get();
    
    if (!messageDoc.exists) {
      return { success: false, error: 'Message not found' };
    }

    const message = messageDoc.data();

    if (!message?.aiReply) {
      return { success: false, error: 'No AI reply to send' };
    }

    // Send reply
    const result = await resend.sendEmail({
      to: message.fromEmail,
      subject: `Re: ${message.subject}`,
      html: message.aiReply.replace(/\n/g, '<br>'),
      text: message.aiReply,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Update message status
    await collections.inbox.doc(messageId).update({
      aiApproved: true,
      status: 'sent',
      updatedAt: new Date(),
    });

    // Log sent email
    await collections.sent.add({
      toEmail: message.fromEmail,
      subject: `Re: ${message.subject}`,
      body: message.aiReply,
      type: 'auto_reply',
      inboxId: messageId,
      sentAt: new Date(),
    });

    return {
      success: true,
      message: 'Reply sent successfully',
    };
  } catch (error: any) {
    console.error('Approve reply error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Process new incoming message (classify + generate reply)
 */
export async function processIncomingMessage(params: {
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
}) {
  try {
    // Create inbox message
    const messageRef = await collections.inbox.add({
      fromEmail: params.fromEmail,
      fromName: params.fromName,
      subject: params.subject,
      body: params.body,
      priority: 'medium',
      status: 'unread',
      aiApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Auto-generate reply
    const config = await getConfig();
    if (config.autoReplyEnabled) {
      await generateAIReply(messageRef.id);
    }

    return {
      success: true,
      messageId: messageRef.id,
    };
  } catch (error: any) {
    console.error('Process message error:', error);
    return { success: false, error: error.message };
  }
}