// actions/email-va/stats.ts
'use server';

import { collections } from '../../lib/email-va/firebase';

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    // Get total leads
    const leadsSnapshot = await collections.leads
      .where('status', '==', 'active')
      .get();
    const totalLeads = leadsSnapshot.size;

    // Get active campaigns (draft, sending, paused)
    const campaignsSnapshot = await collections.campaigns
      .where('status', 'in', ['draft', 'sending', 'paused'])
      .get();
    const activeCampaigns = campaignsSnapshot.size;

    // Get pending replies (drafted status)
    const pendingRepliesSnapshot = await collections.inbox
      .where('status', '==', 'drafted')
      .get();
    const pendingReplies = pendingRepliesSnapshot.size;

    // Get emails sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sentTodaySnapshot = await collections.sent
      .where('sentAt', '>=', today)
      .get();
    const sentToday = sentTodaySnapshot.size;

    return {
      success: true,
      stats: {
        totalLeads,
        activeCampaigns,
        pendingReplies,
        sentToday,
      },
    };
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return {
      success: false,
      error: error.message,
      stats: {
        totalLeads: 0,
        activeCampaigns: 0,
        pendingReplies: 0,
        sentToday: 0,
      },
    };
  }
}
