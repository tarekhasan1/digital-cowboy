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

/**
 * Real-time counts for the dashboard home KPI tiles. Every number here is a
 * live Firestore query/count — no fabricated trends.
 */
export async function getHomeMetrics() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      unreadSnapshot,
      newLeadsSnapshot,
      draftCampaignsSnapshot,
      sendingCampaignsSnapshot,
      allAutomationsSnapshot,
    ] = await Promise.all([
      collections.emailMessages
        .where('readStatus', '==', 'unread')
        .where('direction', '==', 'inbound')
        .count().get(),
      collections.leads.where('createdAt', '>=', sevenDaysAgo).count().get(),
      collections.campaigns.where('status', '==', 'draft').count().get(),
      collections.campaigns.where('status', '==', 'sending').count().get(),
      collections.automations.get(),
    ]);

    const activeAutomations = allAutomationsSnapshot.docs.filter((d: any) => d.data().active).length;
    const inactiveAutomations = allAutomationsSnapshot.size - activeAutomations;

    return {
      success: true,
      metrics: {
        unreadEmails: unreadSnapshot.data().count,
        newLeadsLast7Days: newLeadsSnapshot.data().count,
        draftCampaigns: draftCampaignsSnapshot.data().count,
        sendingCampaigns: sendingCampaignsSnapshot.data().count,
        activeAutomations,
        inactiveAutomations,
      }
    };
  } catch (error: any) {
    console.error('Home metrics error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Real business metrics for the Analytics page, computed from existing CRM
 * collections (not website traffic — that would need separate tracking infra).
 */
export async function getBusinessMetrics() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      newContactsSnapshot,
      newLeadsSnapshot,
      allLeadsThisMonthSnapshot,
      allLeadsSnapshot,
      allCampaignsSnapshot,
      allAutomationsSnapshot,
    ] = await Promise.all([
      collections.contacts.where('createdAt', '>=', startOfMonth).count().get(),
      collections.leads.where('createdAt', '>=', startOfMonth).count().get(),
      collections.leads.where('createdAt', '>=', startOfMonth).get(),
      collections.leads.get(),
      collections.campaigns.get(),
      collections.automations.get(),
    ]);

    // Pipeline value: open deals only.
    let pipelineValue = 0;
    let wonThisMonth = 0;
    let wonValueThisMonth = 0;
    allLeadsSnapshot.docs.forEach((doc: any) => {
      const lead = doc.data();
      if (lead.status !== 'Won' && lead.status !== 'Lost') {
        pipelineValue += lead.value || 0;
      }
    });
    allLeadsThisMonthSnapshot.docs.forEach((doc: any) => {
      const lead = doc.data();
      if (lead.status === 'Won') {
        wonThisMonth++;
        wonValueThisMonth += lead.value || 0;
      }
    });

    const leadsCreatedThisMonth = allLeadsThisMonthSnapshot.size;
    // Approximation: conversion rate of this month's cohort, since we don't
    // snapshot historical status changes to compute a true cohort rate.
    const conversionRate = leadsCreatedThisMonth > 0
      ? Math.round((wonThisMonth / leadsCreatedThisMonth) * 100)
      : 0;

    let totalSent = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    allCampaignsSnapshot.docs.forEach((doc: any) => {
      const c = doc.data();
      totalSent += c.stats?.sent || 0;
      totalOpened += c.stats?.opened || 0;
      totalClicked += c.stats?.clicked || 0;
    });
    const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const avgClickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

    const activeAutomations = allAutomationsSnapshot.docs.filter((d: any) => d.data().active).length;
    const totalAutomationTriggers = allAutomationsSnapshot.docs.reduce(
      (sum: number, d: any) => sum + (d.data().stats?.triggered || 0),
      0
    );

    return {
      success: true,
      metrics: {
        newContactsThisMonth: newContactsSnapshot.data().count,
        newLeadsThisMonth: newLeadsSnapshot.data().count,
        pipelineValue,
        wonThisMonth,
        wonValueThisMonth,
        conversionRate,
        totalCampaignsSent: totalSent,
        avgOpenRate,
        avgClickRate,
        activeAutomations,
        totalAutomationTriggers,
      }
    };
  } catch (error: any) {
    console.error('Business metrics error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Aggregate, privacy-conscious website visitor metrics from collections.visits.
 * No raw IP or raw user-agent is ever read here — the data was already
 * reduced to category labels at write time (see src/app/api/track/route.ts).
 */
export async function getVisitorMetrics(days = 30) {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const snapshot = await collections.visits.where('createdAt', '>=', since).get();

    const visitorIds = new Set<string>();
    const countryCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const pathCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};

    snapshot.docs.forEach((doc: any) => {
      const v = doc.data();
      if (v.visitorId) visitorIds.add(v.visitorId);
      if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
      if (v.deviceType) deviceCounts[v.deviceType] = (deviceCounts[v.deviceType] || 0) + 1;
      if (v.path) pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
      if (v.referrer) {
        try {
          const host = new URL(v.referrer).hostname;
          referrerCounts[host] = (referrerCounts[host] || 0) + 1;
        } catch {
          // ignore malformed referrer values
        }
      }
    });

    const topN = (counts: Record<string, number>, n: number) =>
      Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, count]) => ({ key, count }));

    return {
      success: true,
      metrics: {
        totalPageViews: snapshot.size,
        uniqueVisitors: visitorIds.size,
        topCountries: topN(countryCounts, 5),
        deviceBreakdown: deviceCounts,
        topPages: topN(pathCounts, 5),
        topReferrers: topN(referrerCounts, 5),
      },
    };
  } catch (error: any) {
    console.error('Visitor metrics error:', error);
    return { success: false, error: error.message };
  }
}
