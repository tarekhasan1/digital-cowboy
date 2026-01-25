// actions/email-va/campaigns.ts
'use server';

import { collections } from "../../lib/email-va/firebase";
import { resend } from "../../lib/email-va/resend";


interface CreateCampaignParams {
  name: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  recipientTags: string[];
}

/**
 * Create new campaign
 */
export async function createCampaign(params: CreateCampaignParams) {
  try {
    const campaignRef = await collections.campaigns.add({
      name: params.name,
      subject: params.subject,
      bodyHtml: params.bodyHtml,
      bodyPlain: params.bodyPlain,
      recipientTags: params.recipientTags,
      status: 'draft',
      stats: {
        total: 0,
        sent: 0,
        failed: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      campaignId: campaignRef.id,
    };
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send campaign to leads
 */
export async function sendCampaign(campaignId: string) {
  try {
    // Get campaign
    const campaignDoc = await collections.campaigns.doc(campaignId).get();
    
    if (!campaignDoc.exists) {
      return { success: false, error: 'Campaign not found' };
    }

    const campaign = campaignDoc.data();

    if (campaign?.status !== 'draft') {
      return { success: false, error: 'Campaign already sent or in progress' };
    }

    // Get recipients based on tags
    let leadsQuery = collections.leads.where('status', '==', 'active');

    if (campaign.recipientTags && campaign.recipientTags.length > 0) {
      leadsQuery = leadsQuery.where('tags', 'array-contains-any', campaign.recipientTags);
    }

    const leadsSnapshot = await leadsQuery.get();
    const leads = leadsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (leads.length === 0) {
      return { success: false, error: 'No recipients found for this campaign' };
    }

    // Update campaign status
    await collections.campaigns.doc(campaignId).update({
      status: 'sending',
      'stats.total': leads.length,
      updatedAt: new Date(),
    });

    let sent = 0;
    let failed = 0;

    // Send emails with personalization
    for (const lead of leads) {
      try {
        // Replace variables in body
        let htmlBody = campaign.bodyHtml
          .replace(/\{\{name\}\}/g, lead.name || 'there')
          .replace(/\{\{company\}\}/g, lead.company || '');

        let plainBody = campaign.bodyPlain
          .replace(/\{\{name\}\}/g, lead.name || 'there')
          .replace(/\{\{company\}\}/g, lead.company || '');

        // Add unsubscribe link
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(lead.email)}`;
        htmlBody += `<br><br><small><a href="${unsubscribeUrl}">Unsubscribe</a></small>`;
        plainBody += `\n\nUnsubscribe: ${unsubscribeUrl}`;

        const result = await resend.sendEmail({
          to: lead.email,
          subject: campaign.subject,
          html: htmlBody,
          text: plainBody,
        });

        if (result.success) {
          sent++;
        } else {
          failed++;
        }

        // Rate limiting: wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failed++;
        console.error(`Failed to send to ${lead.email}:`, error);
      }
    }

    // Update final stats
    await collections.campaigns.doc(campaignId).update({
      status: 'sent',
      'stats.sent': sent,
      'stats.failed': failed,
      sentAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      sent,
      failed,
      total: leads.length,
    };
  } catch (error: any) {
    console.error('Send campaign error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all campaigns
 */
export async function getCampaigns() {
  try {
    const snapshot = await collections.campaigns
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const campaigns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete campaign
 */
export async function deleteCampaign(campaignId: string) {
  try {
    await collections.campaigns.doc(campaignId).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Delete campaign error:', error);
    return { success: false, error: error.message };
  }
}