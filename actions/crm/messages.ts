'use server';

import { collections } from '@/lib/email-va/firebase';
import { resend } from '@/lib/email-va/resend';
import { updateConversation } from './conversations';
import crypto from 'crypto';

export interface EmailMessage {
  id?: string;
  conversationId: string;
  resendEmailId?: string;
  messageIdHeader?: string;
  inReplyTo?: string;
  references?: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  html?: string;
  text?: string;
  direction: 'inbound' | 'outbound';
  readStatus: 'unread' | 'read';
  isStarred: boolean;
  deliveryStatus?: 'draft' | 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced';
  attachments?: any[];
  createdAt?: string | Date;
}

export async function getMessagesByConversation(conversationId: string) {
  try {
    // Only query by conversationId and sort in memory to avoid needing a Firestore composite index
    const snapshot = await collections.emailMessages
      .where('conversationId', '==', conversationId)
      .get();
      
    let messages = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : undefined,
      };
    });
    
    // Sort ascending by createdAt
    messages.sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });
    
    return { success: true, messages };
  } catch (error: any) {
    console.error('Get messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
}

export async function createMessage(params: Partial<EmailMessage> & { conversationId: string, direction: 'inbound'|'outbound', from: string, to: string, sendViaResend?: boolean }) {
  try {
    let resendEmailId = params.resendEmailId;
    let messageIdHeader = params.messageIdHeader;

    if (params.sendViaResend) {
      // Generate a custom Message-ID to ensure threading works perfectly when the client replies
      const domain = process.env.EMAIL_FROM ? process.env.EMAIL_FROM.split('@')[1] : 'digitalcowboy.com.au';
      const customMessageId = `<${crypto.randomUUID()}@${domain}>`;
      messageIdHeader = customMessageId;

      const resendResult = await resend.sendEmail({
        to: params.to,
        subject: params.subject || '',
        html: params.html || params.text?.replace(/\n/g, '<br>') || '',
        text: params.text || '',
        headers: {
          'Message-ID': customMessageId,
          ...(params.inReplyTo && { 'In-Reply-To': params.inReplyTo }),
          ...(params.references && { 'References': params.references })
        }
      });

      if (!resendResult.success) {
        return { success: false, error: `Resend failed: ${resendResult.error}` };
      }
      resendEmailId = resendResult.id;
    }

    const data: any = {
      ...params,
      resendEmailId,
      messageIdHeader,
      readStatus: params.readStatus || 'unread',
      isStarred: params.isStarred || false,
      createdAt: params.createdAt || new Date(),
    };
    
    // Remove transient properties before saving
    delete data.sendViaResend;
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    
    const ref = await collections.emailMessages.add(data);
    
    // Update conversation last activity
    await updateConversation(params.conversationId, {
      lastMessageSnippet: params.text ? params.text.substring(0, 100) : '',
      lastMessageAt: data.createdAt,
      latestDirection: params.direction,
      unreadCount: params.direction === 'inbound' ? 1 : 0 
    });
    
    // Attempt to resolve contactId to log activity
    const convInfo = await collections.conversations.doc(params.conversationId).get();
    if (convInfo.exists) {
      const { logActivity } = await import('./activity');
      await logActivity({
        contactId: convInfo.data()?.contactId,
        type: params.direction === 'outbound' ? 'email_sent' : 'email_received',
        title: params.direction === 'outbound' ? 'Email Sent' : 'Email Received',
        description: `Subject: ${params.subject}`,
      });
    }

    return { success: true, messageId: ref.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markMessageRead(id: string) {
  try {
    await collections.emailMessages.doc(id).update({ readStatus: 'read' });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upsertDraft(conversationId: string, text: string) {
  try {
    const existing = await collections.emailMessages
      .where('conversationId', '==', conversationId)
      .where('deliveryStatus', '==', 'draft')
      .limit(1)
      .get();
      
    if (!existing.empty) {
      await existing.docs[0].ref.update({ text, updatedAt: new Date() });
      return { success: true, id: existing.docs[0].id };
    } else {
      const ref = await collections.emailMessages.add({
        conversationId,
        text,
        direction: 'outbound',
        deliveryStatus: 'draft',
        readStatus: 'read',
        isStarred: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        from: 'admin@digitalcowboy.com',
        to: '', // Real recipient resolved at send time
        subject: 'Draft'
      });
      return { success: true, id: ref.id };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDraft(conversationId: string) {
  try {
    const existing = await collections.emailMessages
      .where('conversationId', '==', conversationId)
      .where('deliveryStatus', '==', 'draft')
      .get();
      
    const batch = collections.firestore.batch();
    existing.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
