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

interface CampaignData {
  name: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  recipientTags: string[];
  status: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
  createdAt: any;
  updatedAt: any;
  sentAt?: any;
}

interface LeadData {
  id: string;
  email: string;
  name?: string;
  company?: string;
  tags?: string[];
  status?: string;
}

/**
 * Helper: Convert Firestore Timestamp to ISO string
 */
function serializeTimestamp(timestamp: any): string | undefined {
  if (!timestamp) return undefined;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date().toISOString();
}

/**
 * Create new campaign
 */
export async function createCampaign(params: CreateCampaignParams) {
  try {
    const campaignData: Record<string, any> = {
      name: params.name,
      subject: params.subject,
      bodyHtml: params.bodyHtml,
      bodyPlain: params.bodyPlain,
      recipientTags: params.recipientTags || [],
      status: 'draft',
      stats: {
        total: 0,
        sent: 0,
        failed: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const campaignRef = await collections.campaigns.add(campaignData);

    console.log(`✅ Campaign created: ${campaignRef.id}`);

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
 * 🔥 FIXED: Filter by tags in JavaScript to avoid Firestore composite index issues
 */
export async function sendCampaign(campaignId: string) {
  try {
    console.log(`📧 Starting campaign send: ${campaignId}`);

    // Get campaign
    const campaignDoc = await collections.campaigns.doc(campaignId).get();
    
    if (!campaignDoc.exists) {
      return { success: false, error: 'Campaign not found' };
    }

    const campaign = campaignDoc.data() as CampaignData;

    if (campaign?.status !== 'draft') {
      return { success: false, error: 'Campaign already sent or in progress' };
    }

    console.log(`🔍 Campaign tags:`, campaign.recipientTags);

    // 🔥 FIX: Fetch ALL active leads first (single where clause - no index needed)
    const activeLeadsSnapshot = await collections.leads
      .where('status', '==', 'active')
      .get();

    // Map to typed array
    let leads: LeadData[] = activeLeadsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || '',
        name: data.name || undefined,
        company: data.company || undefined,
        tags: data.tags || [],
        status: data.status || 'active',
      };
    });

    console.log(`👥 Found ${leads.length} active leads total`);

    // 🔥 FIX: Filter by tags in JavaScript (avoids Firestore index requirement)
    if (campaign.recipientTags && campaign.recipientTags.length > 0) {
      const campaignTags = campaign.recipientTags.map((t: string) => 
        t.toLowerCase().trim()
      );
      
      leads = leads.filter(lead => {
        const leadTags = (lead.tags || []).map((t: string) => 
          t.toLowerCase().trim()
        );
        // Check if lead has ANY of the campaign tags
        return campaignTags.some(tag => leadTags.includes(tag));
      });

      console.log(`🏷️ After tag filter (${campaign.recipientTags.join(', ')}): ${leads.length} leads match`);
      
      // Debug: Show which leads matched
      if (leads.length > 0) {
        console.log(`📋 Matching leads:`, leads.map(l => ({
          email: l.email,
          tags: l.tags
        })));
      }
    }

    if (leads.length === 0) {
      // Get all leads for debugging
      const allLeadsSnapshot = await collections.leads.limit(10).get();
      const allLeads = allLeadsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { email: data.email, status: data.status, tags: data.tags };
      });
      
      console.log('⚠️ No matching leads. All leads in DB:', allLeads);
      
      return { 
        success: false, 
        error: `No recipients found with tags: ${campaign.recipientTags?.join(', ') || 'any'}. Make sure leads have matching tags and status='active'.` 
      };
    }

    // Update campaign status
    await collections.campaigns.doc(campaignId).update({
      status: 'sending',
      'stats.total': leads.length,
      updatedAt: new Date(),
    });

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    console.log(`📤 Starting to send ${leads.length} emails...`);

    // Send to ALL leads
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      try {
        console.log(`📧 Sending ${i + 1}/${leads.length} to: ${lead.email}`);

        // Replace variables
        let subject = campaign.subject
          .replace(/\{\{name\}\}/g, lead.name || 'there')
          .replace(/\{\{company\}\}/g, lead.company || '');

        let htmlBody = campaign.bodyHtml
          .replace(/\{\{name\}\}/g, lead.name || 'there')
          .replace(/\{\{company\}\}/g, lead.company || '');

        let plainBody = campaign.bodyPlain
          .replace(/\{\{name\}\}/g, lead.name || 'there')
          .replace(/\{\{company\}\}/g, lead.company || '');

        // Add unsubscribe link
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(lead.email)}`;
        htmlBody += `<br><br><small><a href="${unsubscribeUrl}">Unsubscribe</a></small>`;
        plainBody += `\n\nUnsubscribe: ${unsubscribeUrl}`;

        const result = await resend.sendEmail({
          to: lead.email,
          subject: subject,
          html: htmlBody,
          text: plainBody,
        });

        if (result.success) {
          sent++;
          console.log(`  ✅ Sent to ${lead.email}`);
        } else {
          failed++;
          errors.push(`${lead.email}: ${result.error || 'Unknown error'}`);
          console.log(`  ❌ Failed: ${result.error}`);
        }

        // Rate limiting (Resend free tier = 10/second)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        failed++;
        errors.push(`${lead.email}: ${error.message}`);
        console.error(`  ❌ Error:`, error.message);
      }
    }

    console.log(`📊 Complete: ${sent} sent, ${failed} failed of ${leads.length}`);

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
      errors: errors.slice(0, 10),
    };
  } catch (error: any) {
    console.error('Send campaign error:', error);
    
    try {
      await collections.campaigns.doc(campaignId).update({
        status: 'failed',
        updatedAt: new Date(),
      });
    } catch (e) {}

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

    const campaigns = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.name || '',
        subject: data.subject || '',
        bodyHtml: data.bodyHtml || '',
        bodyPlain: data.bodyPlain || '',
        recipientTags: data.recipientTags || [],
        status: data.status || 'draft',
        stats: {
          total: data.stats?.total || 0,
          sent: data.stats?.sent || 0,
          failed: data.stats?.failed || 0,
        },
        createdAt: serializeTimestamp(data.createdAt),
        updatedAt: serializeTimestamp(data.updatedAt),
        sentAt: serializeTimestamp(data.sentAt),
      };
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return { success: false, error: error.message, campaigns: [] };
  }
}

/**
 * Get single campaign
 */
export async function getCampaign(campaignId: string) {
  try {
    const doc = await collections.campaigns.doc(campaignId).get();
    
    if (!doc.exists) {
      return { success: false, error: 'Campaign not found' };
    }

    const data = doc.data()!;
    
    const campaign = {
      id: doc.id,
      name: data.name || '',
      subject: data.subject || '',
      bodyHtml: data.bodyHtml || '',
      bodyPlain: data.bodyPlain || '',
      recipientTags: data.recipientTags || [],
      status: data.status || 'draft',
      stats: {
        total: data.stats?.total || 0,
        sent: data.stats?.sent || 0,
        failed: data.stats?.failed || 0,
      },
      createdAt: serializeTimestamp(data.createdAt),
      updatedAt: serializeTimestamp(data.updatedAt),
      sentAt: serializeTimestamp(data.sentAt),
    };

    return { success: true, campaign };
  } catch (error: any) {
    console.error('Get campaign error:', error);
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