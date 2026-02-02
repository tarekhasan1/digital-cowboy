// actions/email-va/sync-resend.ts
'use server';

import { collections, getConfig } from "../../lib/email-va/firebase";
import { groqAI } from "../../lib/email-va/groq";
import { resendReceiving } from "../../lib/email-va/resend-fetch";

/**
 * Sync received emails from Resend to Firebase inbox
 */
export async function syncEmailsFromResend() {
  try {
    console.log('🔄 Syncing received emails from Resend...');

    const result = await resendReceiving.listReceivedEmails();

    if (!result.success || !result.emails) {
      console.error('❌ Failed to fetch emails:', result.error);
      return { 
        success: false, 
        error: result.error || 'Failed to fetch emails from Resend' 
      };
    }

    console.log(`📧 Found ${result.emails.length} received emails in Resend`);

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Get list of deleted emails to skip
    let deletedEmailIds: Set<string> = new Set();
    try {
      const deletedSnapshot = await collections.deletedEmails.get();
      deletedEmailIds = new Set(deletedSnapshot.docs.map((doc: any) => doc.data().resendEmailId));
      console.log(`📋 Found ${deletedEmailIds.size} deleted emails to skip`);
    } catch (error) {
      console.warn('Could not fetch deleted emails list:', error);
    }

    for (const email of result.emails) {
      try {
        // Check if email was deleted by user
        if (deletedEmailIds.has(email.id)) {
          skipped++;
          console.log(`⏭️  Skipped deleted: ${email.subject}`);
          continue;
        }

        // Check if email already exists
        const existingSnapshot = await collections.inbox
          .where('resendEmailId', '==', email.id)
          .limit(1)
          .get();

        if (!existingSnapshot.empty) {
          skipped++;
          console.log(`⏭️  Skipped duplicate: ${email.subject}`);
          continue;
        }

        // 🔥 FIX: Fetch full email details to get the body
        let body = '';
        let fullEmailData = email;

        try {
          console.log(`📥 Fetching full details for email: ${email.id}`);
          const fullEmailResult = await resendReceiving.getReceivedEmail(email.id);
          
          if (fullEmailResult.success && fullEmailResult.email) {
            fullEmailData = fullEmailResult.email;
            
            // Try multiple possible body fields
            body = fullEmailData.text 
              || fullEmailData.html 
              || fullEmailData.body 
              || fullEmailData.plain_body
              || fullEmailData.text_body
              || '';
            
            // Strip HTML tags if we only got HTML
            if (!fullEmailData.text && fullEmailData.html) {
              body = fullEmailData.html
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .trim();
            }
            
            console.log(`📄 Body fetched, length: ${body.length} chars`);
          } else {
            console.log(`⚠️  Could not fetch full email, using list data`);
            body = email.text || email.html || '';
          }
        } catch (fetchError: any) {
          console.error(`⚠️  Error fetching full email:`, fetchError.message);
          body = email.text || email.html || '';
        }

        // Extract email and name from "Name <email@domain.com>"
        let fromEmail = fullEmailData.from || email.from || '';
        let fromName: string | undefined = undefined;

        const emailMatch = fromEmail.match(/<(.+?)>/);
        if (emailMatch) {
          fromEmail = emailMatch[1].trim();
          const nameMatch = (fullEmailData.from || email.from || '').match(/^(.+?)\s*</);
          if (nameMatch) {
            fromName = nameMatch[1].trim().replace(/["']/g, '');
          }
        }

        // Classify intent using AI
        let intent: string | undefined = undefined;
        let priority = 'medium';

        const subject = fullEmailData.subject || email.subject || '(No Subject)';

        if (body && body.length > 10) {
          try {
            const classification = await groqAI.classifyIntent(
              `Subject: ${subject}\n\nBody: ${body}`
            );
            intent = classification.intent;
            priority = classification.priority;
          } catch (error) {
            console.log('⚠️  Classification failed, using defaults');
          }
        }

        // Prepare document data
        const inboxData: Record<string, any> = {
          resendEmailId: email.id,
          fromEmail: fromEmail || 'unknown@example.com',
          subject: subject,
          body: body || '(No content available)',
          priority,
          status: 'unread',
          aiApproved: false,
          createdAt: email.created_at ? new Date(email.created_at) : new Date(),
          updatedAt: new Date(),
        };

        if (fromName) {
          inboxData.fromName = fromName;
        }
        if (intent) {
          inboxData.intent = intent;
        }

        // Add to inbox
        const docRef = await collections.inbox.add(inboxData);

        synced++;
        console.log(`✅ Synced: ${subject} (${docRef.id})`);
        console.log(`   📝 Body preview: ${body.substring(0, 100)}...`);

        // Auto-generate AI reply if enabled
        const config = await getConfig();
        if (config.autoReplyEnabled && body && body.length > 10) {
          try {
            const aiReply = await groqAI.generateReply(
              `Subject: ${subject}\n\nBody: ${body}`,
              intent
            );

            await collections.inbox.doc(docRef.id).update({
              aiReply,
              status: 'drafted',
              updatedAt: new Date(),
            });

            console.log(`🤖 AI reply generated for: ${subject}`);
          } catch (error) {
            console.log(`⚠️  AI reply generation failed for: ${subject}`);
          }
        }

      } catch (error: any) {
        console.error(`❌ Error syncing email:`, error);
        errors.push(`${email.subject}: ${error.message}`);
      }
    }

    const message = `Synced ${synced} new emails, skipped ${skipped} duplicates`;
    console.log(`✅ ${message}`);

    return {
      success: true,
      synced,
      skipped,
      total: result.emails.length,
      errors: errors.slice(0, 5),
      message,
    };
  } catch (error: any) {
    console.error('❌ Sync error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// ... rest of the file stays the same
export async function getReceivedEmailDetails(emailId: string) {
  try {
    const result = await resendReceiving.getReceivedEmail(emailId);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const attachmentsResult = await resendReceiving.listAttachments(emailId);

    return {
      success: true,
      email: result.email,
      attachments: attachmentsResult.success ? attachmentsResult.attachments : [],
    };
  } catch (error: any) {
    console.error('Get email details error:', error);
    return { success: false, error: error.message };
  }
}

export async function autoSyncEmails() {
  const result = await syncEmailsFromResend();
  console.log('🔄 Auto-sync result:', result);
  return result;
}

/**
 * Clean up deleted emails older than 90 days
 * Keeps the deletedEmails collection from growing indefinitely
 */
export async function cleanupDeletedEmails() {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    const oldDeletedSnapshot = await collections.deletedEmails
      .where('deletedAt', '<', ninetyDaysAgo)
      .get();

    let deleted = 0;
    const batch = [];
    
    for (const doc of oldDeletedSnapshot.docs) {
      batch.push(collections.deletedEmails.doc(doc.id).delete());
      deleted++;
    }

    if (batch.length > 0) {
      await Promise.all(batch);
      console.log(`🧹 Cleaned up ${deleted} old deleted email records`);
    }

    return { success: true, cleaned: deleted };
  } catch (error: any) {
    console.error('Cleanup deleted emails error:', error);
    return { success: false, error: error.message };
  }
}