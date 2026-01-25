// actions/email-va/sync-resend.ts
'use server';

import { collections, getConfig } from "../../lib/email-va/firebase";
import { groqAI } from "../../lib/email-va/groq";
import { resendReceiving } from "../../lib/email-va/resend-fetch";



/**
 * Sync received emails from Resend to Firebase inbox
 * Uses official Resend receiving API
 */
export async function syncEmailsFromResend() {
  try {
    console.log('🔄 Syncing received emails from Resend...');

    // Fetch received emails from Resend
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

    for (const email of result.emails) {
      try {
        // Check if email already exists in inbox (by unique ID)
        const existingSnapshot = await collections.inbox
          .where('resendEmailId', '==', email.id)
          .limit(1)
          .get();

        if (!existingSnapshot.empty) {
          skipped++;
          console.log(`⏭️  Skipped duplicate: ${email.subject}`);
          continue;
        }

        // Extract email and name from "Name <email@domain.com>"
        let fromEmail = email.from || '';
        let fromName = undefined;

        const emailMatch = fromEmail.match(/<(.+?)>/);
        if (emailMatch) {
          fromEmail = emailMatch[1].trim();
          const nameMatch = email.from.match(/^(.+?)\s*</);
          if (nameMatch) {
            fromName = nameMatch[1].trim().replace(/["']/g, '');
          }
        }

        // Get email body
        const body = email.text || email.html || '';

        // Classify intent using AI
        let intent = undefined;
        let priority = 'medium';

        try {
          const classification = await groqAI.classifyIntent(
            `Subject: ${email.subject}\n\nBody: ${body}`
          );
          intent = classification.intent;
          priority = classification.priority;
        } catch (error) {
          console.log('⚠️  Classification failed, using defaults');
        }

        // Add to inbox
        const docRef = await collections.inbox.add({
          resendEmailId: email.id, // Store Resend ID for deduplication
          fromEmail,
          fromName,
          subject: email.subject || '(No Subject)',
          body,
          intent,
          priority,
          status: 'unread',
          aiApproved: false,
          createdAt: email.created_at ? new Date(email.created_at) : new Date(),
          updatedAt: new Date(),
        });

        synced++;
        console.log(`✅ Synced: ${email.subject} (${docRef.id})`);

        // Auto-generate AI reply if enabled
        const config = await getConfig();
        if (config.autoReplyEnabled) {
          try {
            const aiReply = await groqAI.generateReply(
              `Subject: ${email.subject}\n\nBody: ${body}`,
              intent
            );

            await collections.inbox.doc(docRef.id).update({
              aiReply,
              status: 'drafted',
              updatedAt: new Date(),
            });

            console.log(`🤖 AI reply generated for: ${email.subject}`);
          } catch (error) {
            console.log(`⚠️  AI reply generation failed for: ${email.subject}`);
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
      errors: errors.slice(0, 5), // Return first 5 errors
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

/**
 * Get details of a specific received email
 */
export async function getReceivedEmailDetails(emailId: string) {
  try {
    const result = await resendReceiving.getReceivedEmail(emailId);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Also fetch attachments if any
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

/**
 * Auto-sync emails on a schedule (for cron jobs)
 */
export async function autoSyncEmails() {
  const result = await syncEmailsFromResend();
  console.log('🔄 Auto-sync result:', result);
  return result;
}