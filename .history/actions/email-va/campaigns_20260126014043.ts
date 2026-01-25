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
  [key: string]: any;
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

    // Get recipients based on tags
    console.log(`🔍 Looking for leads with tags:`, campaign.recipientTags);

    let leadsSnapshot;

    // 🔥 FIX: Build query properly to avoid composite index issues
    if (campaign.recipientTags && campaign.recipientTags.length > 0) {
      // Query with tags filter
      leadsSnapshot = await collections.leads
        .where('status', '==', 'active')
        .where('tags', 'array-contains-any', campaign.recipientTags)
        .get();
    } else {
      // Query all active leads if no tags specified
      leadsSnapshot = await collections.leads
        .where('status', '==', 'active')
        .get();
    }

    // 🔥 FIX: Properly type the lead data
    const leads: LeadData[] = leadsSnapshot.docs.map((doc: any) => {
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

    console.log(`👥 Found ${leads.length} leads to send to`);

    // Debug: Log first few leads
    if (leads.length > 0) {
      console.log('📋 First 3 leads:', leads.slice(0, 3).map(l => l.email));
    }

    if (leads.length === 0) {
      // 🔥 FIX: Try fetching all leads to see if it's a filter issue
      const allLeadsSnapshot = await collections.leads.limit(10).get();
      const allLeadsCount = allLeadsSnapshot.docs.length;
      
      console.log(`⚠️ No matching leads found. Total leads in DB: ${allLeadsCount}`);
      
      if (allLeadsCount > 0) {
        const sampleLead = allLeadsSnapshot.docs[0].data();
        console.log('📋 Sample lead data:', {
          email: sampleLead.email,
          status: sampleLead.status,
          tags: sampleLead.tags,
        });
      }

      return { 
        success: false, 
        error: `No recipients found. Make sure leads have status='active' and matching tags: ${campaign.recipientTags?.join(', ') || 'any'}` 
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

    // 🔥 FIX: Send emails to ALL leads with proper iteration
    console.log(`📤 Starting to send ${leads.length} emails...`);

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      try {
        console.log(`📧 Sending ${i + 1}/${leads.length} to: ${lead.email}`);

        // Replace variables in subject
        let subject = campaign.subject
          .replace(/\{\{name\}\}/g, lead.name || 'there')
          .replace(/\{\{company\}\}/g, lead.company || '');

        // Replace variables in body
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
          const errorMsg = result.error || 'Unknown error';
          errors.push(`${lead.email}: ${errorMsg}`);
          console.log(`  ❌ Failed for ${lead.email}: ${errorMsg}`);
        }

        // Rate limiting: wait 100ms between emails (Resend free tier is 10/second)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        failed++;
        const errorMsg = error.message || 'Unknown error';
        errors.push(`${lead.email}: ${errorMsg}`);
        console.error(`  ❌ Error sending to ${lead.email}:`, errorMsg);
      }
    }

    console.log(`📊 Campaign complete: ${sent} sent, ${failed} failed out of ${leads.length}`);

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
      errors: errors.slice(0, 10), // Return first 10 errors
    };
  } catch (error: any) {
    console.error('Send campaign error:', error);
    
    // Try to update campaign status to failed
    try {
      await collections.campaigns.doc(campaignId).update({
        status: 'failed',
        updatedAt: new Date(),
      });
    } catch (updateError) {
      console.error('Failed to update campaign status:', updateError);
    }

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

    // 🔥 FIX: Properly serialize campaign data
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
        // 🔥 FIX: Convert Firestore Timestamps to ISO strings
        createdAt: serializeTimestamp(data.createdAt),
        updatedAt: serializeTimestamp(data.updatedAt),
        sentAt: serializeTimestamp(data.sentAt),
      };
    });

    console.log(`📋 Fetched ${campaigns.length} campaigns`);

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    // 🔥 FIX: Always return campaigns array even on error
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
    
    // 🔥 FIX: Properly serialize campaign data
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
    console.log(`🗑️ Campaign deleted: ${campaignId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Delete campaign error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update campaign (for drafts only)
 */
export async function updateCampaign(campaignId: string, updates: Partial<CreateCampaignParams>) {
  try {
    const doc = await collections.campaigns.doc(campaignId).get();
    
    if (!doc.exists) {
      return { success: false, error: 'Campaign not found' };
    }

    const data = doc.data()!;
    
    if (data.status !== 'draft') {
      return { success: false, error: 'Can only edit draft campaigns' };
    }

    // Build update object without undefined values
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.subject !== undefined) updateData.subject = updates.subject;
    if (updates.bodyHtml !== undefined) updateData.bodyHtml = updates.bodyHtml;
    if (updates.bodyPlain !== undefined) updateData.bodyPlain = updates.bodyPlain;
    if (updates.recipientTags !== undefined) updateData.recipientTags = updates.recipientTags;

    await collections.campaigns.doc(campaignId).update(updateData);

    return { success: true };
  } catch (error: any) {
    console.error('Update campaign error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get campaign stats with recipient details
 */
export async function getCampaignStats(campaignId: string) {
  try {
    const doc = await collections.campaigns.doc(campaignId).get();
    
    if (!doc.exists) {
      return { success: false, error: 'Campaign not found' };
    }

    const data = doc.data()!;

    return {
      success: true,
      stats: {
        total: data.stats?.total || 0,
        sent: data.stats?.sent || 0,
        failed: data.stats?.failed || 0,
        status: data.status || 'draft',
        sentAt: serializeTimestamp(data.sentAt),
      },
    };
  } catch (error: any) {
    console.error('Get campaign stats error:', error);
    return { success: false, error: error.message };
  }
}