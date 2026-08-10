import { NextResponse } from 'next/server';
import { collections } from '@/lib/email-va/firebase';
import { upsertContact } from '@/actions/crm/contacts';
import { createConversation, getConversations, updateConversation } from '@/actions/crm/conversations';
import { createMessage } from '@/actions/crm/messages';
import { groqAI } from '@/lib/email-va/groq';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 1. Validate Event Type
    if (payload.type !== 'email.received') {
      return NextResponse.json({ success: true, message: 'Ignored non-inbound event' });
    }

    const emailData = payload.data;
    if (!emailData) {
      return NextResponse.json({ success: false, error: 'Missing email data' }, { status: 400 });
    }

    // Basic fields
    const fromAddress = emailData.from || '';
    const subject = emailData.subject || '(No Subject)';
    const textBody = emailData.text || '';
    const htmlBody = emailData.html || '';
    
    // Extract Email & Name
    let fromEmail = fromAddress;
    let fromName = undefined;
    const emailMatch = fromAddress.match(/<(.+?)>/);
    if (emailMatch) {
      fromEmail = emailMatch[1].trim();
      const nameMatch = fromAddress.match(/^(.+?)\s*</);
      if (nameMatch) {
        fromName = nameMatch[1].trim().replace(/["']/g, '');
      }
    }

    // Check headers for threading
    const headers = emailData.headers || {};
    // Sometimes headers is an array of {name, value}, sometimes an object. Let's handle both.
    let messageId = '';
    let inReplyTo = '';
    let references = '';
    
    if (Array.isArray(headers)) {
      messageId = headers.find(h => h.name.toLowerCase() === 'message-id')?.value || '';
      inReplyTo = headers.find(h => h.name.toLowerCase() === 'in-reply-to')?.value || '';
      references = headers.find(h => h.name.toLowerCase() === 'references')?.value || '';
    } else {
      messageId = headers['Message-ID'] || headers['message-id'] || '';
      inReplyTo = headers['In-Reply-To'] || headers['in-reply-to'] || '';
      references = headers['References'] || headers['references'] || '';
    }

    // 2. Deduplicate
    if (messageId) {
      const existing = await collections.emailMessages.where('messageIdHeader', '==', messageId).limit(1).get();
      if (!existing.empty) {
        console.log(`[Webhook] Duplicate message ignored: ${messageId}`);
        return NextResponse.json({ success: true, message: 'Duplicate ignored' });
      }
    }

    // 3. Upsert Contact
    const contactRes = await upsertContact({
      email: fromEmail,
      name: fromName,
      type: 'contact'
    });
    const contactId = contactRes.success ? contactRes.contactId : 'unknown';

    // 4. Find or Create Conversation
    let conversationId = '';
    
    // Threading logic: try to find conversation by inReplyTo or references
    if (inReplyTo || references) {
      // Very naive matching: looking for existing message with messageId == inReplyTo
      // More robust: search emailMessages for the parent, get its conversationId.
      const parentQuery = inReplyTo ? inReplyTo : references.split(' ')[0];
      const parentMsg = await collections.emailMessages.where('messageIdHeader', '==', parentQuery).limit(1).get();
      
      if (!parentMsg.empty) {
        conversationId = parentMsg.docs[0].data().conversationId;
      }
    }

    // Fallback: match by subject and contact
    if (!conversationId && contactId !== 'unknown') {
      const cleanSubject = subject.replace(/^(Re|Fwd|RE|FWD):\s*/i, '').trim();
      const existingConvs = await getConversations({ contactId });
      
      if (existingConvs.success && existingConvs.conversations) {
        const match = existingConvs.conversations.find((c: any) => 
          c.subject.includes(cleanSubject) || cleanSubject.includes(c.subject)
        );
        if (match) conversationId = match.id;
      }
      
      // If still no conversation, create new
      if (!conversationId) {
        const createConv = await createConversation({
          contactId,
          subject: cleanSubject,
          unreadCount: 1,
          isArchived: false,
        });
        if (createConv.success && createConv.conversationId) {
          conversationId = createConv.conversationId;
        }
      }
    }

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'Could not resolve conversation' }, { status: 500 });
    }

    // 5. Create Message
    await createMessage({
      conversationId,
      direction: 'inbound',
      from: fromEmail,
      to: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
      subject: subject,
      text: textBody,
      html: htmlBody,
      readStatus: 'unread',
      messageIdHeader: messageId,
      inReplyTo,
      references,
      resendEmailId: payload.data.id || payload.id,
      createdAt: new Date(),
    });

    console.log(`[Webhook] Processed inbound email: ${subject}`);
    
    // Log Activity
    const { logActivity } = await import('@/actions/crm/activity');
    await logActivity({
      contactId,
      type: 'email_received',
      title: 'Email Received',
      description: `Subject: ${subject}`,
      metadata: { conversationId, messageId }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Webhook] Inbound email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}