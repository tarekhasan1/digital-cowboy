// actions/email-va/sync-resend.ts
'use server';

import { collections } from "./firebase";
import { resendFetch } from "./resend-fetch";



/**
 * Sync received emails from Resend to Firebase inbox
 */
export async function syncEmailsFromResend() {
  try {
    console.log('🔄 Syncing emails from Resend...');

    // Fetch emails from Resend
    const result = await resendFetch.fetchEmails(50);

    if (!result.success || !result.emails) {
      return { 
        success: false, 
        error: result.error || 'Failed to fetch emails' 
      };
    }

    const yourDomain = process.env.EMAIL_FROM?.split('@')[1] || 'digitalcowboy.com.au';
    
    // Filter to only received emails (sent TO your domain)
    const receivedEmails = result.emails.filter(email => 
      email.to.some(recipient => recipient.includes(yourDomain))
    );

    console.log(`📧 Found ${receivedEmails.length} received emails`);

    let synced = 0;
    let skipped = 0;

    for (const email of receivedEmails) {
      try {
        // Check if already exists in inbox
        const existingSnapshot = await collections.inbox
          .where('fromEmail', '==', email.from)
          .where('subject', '==', email.subject)
          .limit(1)
          .get();

        if (!existingSnapshot.empty) {
          skipped++;
          continue;
        }

        // Extract email and name from "Name <email@domain.com>"
        let fromEmail = email.from;
        let fromName = undefined;

        const emailMatch = email.from.match(/<(.+?)>/);
        if (emailMatch) {
          fromEmail = emailMatch[1].trim();
          const nameMatch = email.from.match(/^(.+?)\s*</);
          if (nameMatch) {
            fromName = nameMatch[1].trim().replace(/["']/g, '');
          }
        }

        // Add to inbox
        await collections.inbox.add({
          fromEmail,
          fromName,
          subject: email.subject,
          body: email.text || email.html || '',
          priority: 'medium',
          status: 'unread',
          aiApproved: false,
          createdAt: new Date(email.created_at),
          updatedAt: new Date(),
        });

        synced++;
        console.log(`✅ Synced: ${email.subject}`);
      } catch (error) {
        console.error(`❌ Error syncing email:`, error);
      }
    }

    return {
      success: true,
      synced,
      skipped,
      total: receivedEmails.length,
      message: `Synced ${synced} new emails, skipped ${skipped} duplicates`,
    };
  } catch (error: any) {
    console.error('Sync error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Auto-sync emails on a schedule
 * Call this from a cron job or manual trigger
 */
export async function autoSyncEmails() {
  const result = await syncEmailsFromResend();
  console.log('Auto-sync result:', result);
  return result;
}