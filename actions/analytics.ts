'use server';

import { collections } from '@/lib/email-va/firebase';

export async function getDashboardMetrics() {
  try {
    const leadsSnapshot = await collections.leads.count().get();
    const insightsSnapshot = await collections.insights.where('published', '==', true).count().get();
    const inboxSnapshot = await collections.inbox.count().get();
    const messagesSnapshot = await collections.messages.count().get();

    return {
      success: true,
      metrics: {
        totalLeads: leadsSnapshot.data().count,
        publishedInsights: insightsSnapshot.data().count,
        totalEmails: inboxSnapshot.data().count,
        totalMessages: messagesSnapshot.data().count,
      }
    };
  } catch (error: any) {
    console.error('Analytics error:', error);
    return { success: false, error: error.message };
  }
}
