'use server';

import { collections } from '@/lib/email-va/firebase';
import { upsertContact } from './contacts';
import { createConversation, getConversations } from './conversations';
import { createMessage } from './messages';
import { resendReceiving } from '@/lib/email-va/resend-fetch';

function extractNameEmail(fromAddress: string) {
  let fromEmail = fromAddress;
  let fromName: string | undefined;
  const emailMatch = fromAddress.match(/<(.+?)>/);
  if (emailMatch) {
    fromEmail = emailMatch[1].trim();
    const nameMatch = fromAddress.match(/^(.+?)\s*</);
    if (nameMatch) fromName = nameMatch[1].trim().replace(/["']/g, '');
  }
  return { fromEmail, fromName };
}

function extractThreadingHeaders(headers: any) {
  if (Array.isArray(headers)) {
    return {
      inReplyTo: headers.find((h: any) => h.name?.toLowerCase() === 'in-reply-to')?.value || '',
      references: headers.find((h: any) => h.name?.toLowerCase() === 'references')?.value || '',
    };
  }
  headers = headers || {};
  return {
    inReplyTo: headers['In-Reply-To'] || headers['in-reply-to'] || '',
    references: headers['References'] || headers['references'] || '',
  };
}

/**
 * Ingests one fully-fetched Resend received email (the shape returned by
 * `resend.emails.receiving.get`) into the conversations/emailMessages store.
 * Shared by the inbound webhook (push) and pullInboundEmails (pull), so both
 * paths produce identical records and can't drift apart.
 */
export async function ingestInboundEmail(fullEmail: any) {
  try {
    const emailId: string | undefined = fullEmail.id || fullEmail.email_id;
    const subject = fullEmail.subject || '(No Subject)';
    const textBody = fullEmail.text || '';
    const htmlBody = fullEmail.html || '';
    const { fromEmail, fromName } = extractNameEmail(fullEmail.from || '');
    const { inReplyTo, references } = extractThreadingHeaders(fullEmail.headers);
    const messageId = fullEmail.message_id || '';

    // Dedupe by Message-ID header, then by Resend's own email id.
    if (messageId) {
      const existing = await collections.emailMessages.where('messageIdHeader', '==', messageId).limit(1).get();
      if (!existing.empty) return { success: true, skipped: true };
    }
    if (emailId) {
      const existingById = await collections.emailMessages.where('resendEmailId', '==', emailId).limit(1).get();
      if (!existingById.empty) return { success: true, skipped: true };
    }

    const contactRes = await upsertContact({ email: fromEmail, name: fromName, type: 'contact' });
    const contactId = contactRes.success ? contactRes.contactId : 'unknown';

    let conversationId = '';

    // Threading: match the parent message by In-Reply-To/References.
    if (inReplyTo || references) {
      const parentQuery = inReplyTo || references.split(' ')[0];
      const parentMsg = await collections.emailMessages.where('messageIdHeader', '==', parentQuery).limit(1).get();
      if (!parentMsg.empty) conversationId = parentMsg.docs[0].data().conversationId;
    }

    // Fallback: match by subject within the contact's existing conversations.
    if (!conversationId && contactId !== 'unknown') {
      const cleanSubject = subject.replace(/^(Re|Fwd|RE|FWD):\s*/i, '').trim();
      const existingConvs = await getConversations({ contactId });

      if (existingConvs.success && existingConvs.conversations) {
        const match = existingConvs.conversations.find((c: any) =>
          c.subject.includes(cleanSubject) || cleanSubject.includes(c.subject)
        );
        if (match) conversationId = match.id;
      }

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
      return { success: false, error: 'Could not resolve conversation' };
    }

    const to = Array.isArray(fullEmail.to) ? fullEmail.to.join(',') : (fullEmail.to || '');

    await createMessage({
      conversationId,
      direction: 'inbound',
      from: fromEmail,
      to,
      subject,
      text: textBody,
      html: htmlBody,
      readStatus: 'unread',
      messageIdHeader: messageId,
      inReplyTo,
      references,
      resendEmailId: emailId,
      createdAt: fullEmail.created_at ? new Date(fullEmail.created_at) : new Date(),
    });

    // Note: createMessage() above already logs the 'email_received' activity
    // event internally — logging it again here would duplicate every entry.

    if (contactId !== 'unknown') {
      const { checkAndFireAutomations } = await import('../automations');
      await checkAndFireAutomations('email_received', {
        contactId: contactId!,
        contactEmail: fromEmail,
        contactName: fromName,
      });
    }

    return { success: true, skipped: false, conversationId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Pulls recently received emails from Resend and ingests any not already
 * stored. Backs both the daily cron and the manual "pull" refresh button in
 * the inbox UI, since the webhook push can be missed (misconfiguration,
 * downtime) or simply lag behind what the user wants to see right now.
 */
export async function pullInboundEmails() {
  try {
    const result = await resendReceiving.listReceivedEmails();
    if (!result.success || !result.emails) {
      return { success: false, error: result.error || 'Failed to list received emails' };
    }

    const emails = result.emails;
    if (emails.length === 0) {
      return { success: true, synced: 0, skipped: 0, total: 0, errors: [] };
    }

    // Batch the "already synced?" check — one 'in' query per 30 ids instead
    // of one query per email, which is what was making this slow.
    const ids: string[] = emails.map((e: any) => e.id).filter(Boolean);
    const existingIds = new Set<string>();
    const CHUNK = 30; // Firestore 'in' query limit
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += CHUNK) chunks.push(ids.slice(i, i + CHUNK));

    await Promise.all(
      chunks.map(async (chunk) => {
        const snap = await collections.emailMessages.where('resendEmailId', 'in', chunk).get();
        snap.docs.forEach((doc: any) => existingIds.add(doc.data().resendEmailId));
      })
    );

    const newEmails = emails.filter((e: any) => e.id && !existingIds.has(e.id));
    let skipped = emails.length - newEmails.length;
    let synced = 0;
    const errors: string[] = [];

    // Fetch full bodies with bounded concurrency — this is the network-bound
    // part, and was previously done one-by-one in series.
    const FETCH_CONCURRENCY = 5;
    const fullEmails: any[] = [];
    for (let i = 0; i < newEmails.length; i += FETCH_CONCURRENCY) {
      const batch = newEmails.slice(i, i + FETCH_CONCURRENCY);
      const fetched = await Promise.all(batch.map((e: any) => resendReceiving.getReceivedEmail(e.id)));
      fetched.forEach((r, idx) => {
        fullEmails.push(r.success && r.email ? r.email : batch[idx]);
      });
    }

    // Ingest sequentially: each write may touch a shared contact/conversation
    // doc, so running these concurrently risks duplicate conversations.
    for (const fullEmail of fullEmails) {
      try {
        const ingestResult = await ingestInboundEmail(fullEmail);
        if (ingestResult.success && !ingestResult.skipped) {
          synced++;
        } else if (ingestResult.skipped) {
          skipped++;
        } else {
          errors.push(ingestResult.error || 'Unknown error');
        }
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    return { success: true, synced, skipped, total: emails.length, errors: errors.slice(0, 5) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
