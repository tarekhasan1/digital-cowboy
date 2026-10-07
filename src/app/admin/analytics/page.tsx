'use client';

import { useState, useEffect } from 'react';
import { getDashboardMetrics, getBusinessMetrics, getVisitorMetrics } from '../../../../actions/analytics';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, FileText, Mail, MessageSquare, TrendingUp, DollarSign, Target, Megaphone, Zap, Eye, Globe, Smartphone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [visitors, setVisitors] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      const [res, bizRes, visitorRes] = await Promise.all([getDashboardMetrics(), getBusinessMetrics(), getVisitorMetrics(30)]);
      if (res.success) setMetrics(res.metrics);
      if (bizRes.success) setBusiness(bizRes.metrics);
      if (visitorRes.success) setVisitors(visitorRes.metrics);
      setLoading(false);
    }
    loadMetrics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-white/60">High-level overview of your platform's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-2xl border border-white/10" />
          ))
        ) : (
          <>
            <StatCard 
              title="Total Form Enquiries" 
              value={metrics?.totalMessages || 0} 
              icon={<MessageSquare className="w-6 h-6" />}
              color="text-blue-400"
            />
            <StatCard 
              title="Total Leads Captured" 
              value={metrics?.totalLeads || 0} 
              icon={<Users className="w-6 h-6" />}
              color="text-green-400"
            />
            <StatCard 
              title="Published Insights" 
              value={metrics?.publishedInsights || 0} 
              icon={<FileText className="w-6 h-6" />}
              color="text-yellow-400"
            />
            <StatCard 
              title="Emails in Inbox" 
              value={metrics?.totalEmails || 0} 
              icon={<Mail className="w-6 h-6" />}
              color="text-purple-400"
            />
          </>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-1">Business Performance</h2>
        <p className="text-white/50 text-sm">Pipeline, campaign, and automation activity — computed from your CRM data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-2xl border border-white/10" />
          ))
        ) : (
          <>
            <StatCard
              title="New Contacts This Month"
              value={business?.newContactsThisMonth || 0}
              icon={<Users className="w-6 h-6" />}
              color="text-blue-400"
            />
            <StatCard
              title="New Leads This Month"
              value={business?.newLeadsThisMonth || 0}
              icon={<TrendingUp className="w-6 h-6" />}
              color="text-green-400"
            />
            <StatCard
              title="Pipeline Value"
              value={`$${(business?.pipelineValue || 0).toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6" />}
              color="text-yellow-400"
            />
            <StatCard
              title="Won This Month"
              value={`${business?.wonThisMonth || 0} ($${(business?.wonValueThisMonth || 0).toLocaleString()})`}
              icon={<Target className="w-6 h-6" />}
              color="text-primary"
            />
            <StatCard
              title="Conversion Rate (This Month)"
              value={`${business?.conversionRate || 0}%`}
              icon={<Target className="w-6 h-6" />}
              color="text-purple-400"
            />
            <StatCard
              title="Campaign Emails Sent"
              value={business?.totalCampaignsSent || 0}
              icon={<Megaphone className="w-6 h-6" />}
              color="text-blue-400"
            />
            <StatCard
              title="Avg Open / Click Rate"
              value={`${business?.avgOpenRate || 0}% / ${business?.avgClickRate || 0}%`}
              icon={<BarChart3 className="w-6 h-6" />}
              color="text-green-400"
            />
            <StatCard
              title="Automations (Active / Triggers)"
              value={`${business?.activeAutomations || 0} / ${business?.totalAutomationTriggers || 0}`}
              icon={<Zap className="w-6 h-6" />}
              color="text-orange-400"
            />
          </>
        )}
      </div>

      <div className="mb-4 mt-8">
        <h2 className="text-lg font-bold text-white mb-1">Website Visitors (Last 30 Days)</h2>
        <p className="text-white/50 text-sm">Aggregate, privacy-conscious traffic stats — country/region level only, no raw IP addresses stored.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-2xl border border-white/10" />
          ))
        ) : (
          <>
            <StatCard title="Page Views" value={visitors?.totalPageViews || 0} icon={<Eye className="w-6 h-6" />} color="text-blue-400" />
            <StatCard title="Unique Visitors" value={visitors?.uniqueVisitors || 0} icon={<Users className="w-6 h-6" />} color="text-green-400" />
            <StatCard
              title="Top Country"
              value={visitors?.topCountries?.[0]?.key || '—'}
              icon={<Globe className="w-6 h-6" />}
              color="text-purple-400"
            />
            <StatCard
              title="Top Device"
              value={visitors?.deviceBreakdown ? Object.entries(visitors.deviceBreakdown).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || '—' : '—'}
              icon={<Smartphone className="w-6 h-6" />}
              color="text-orange-400"
            />
          </>
        )}
      </div>

      {!loading && (visitors?.topPages?.length > 0 || visitors?.topReferrers?.length > 0 || visitors?.topCountries?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ListCard title="Top Pages" items={visitors?.topPages} />
          <ListCard title="Top Countries" items={visitors?.topCountries} />
          <ListCard title="Top Referrers" items={visitors?.topReferrers} emptyLabel="No referrer traffic yet" />
        </div>
      )}
    </div>
  );
}

function ListCard({ title, items, emptyLabel }: { title: string; items?: { key: string; count: number }[]; emptyLabel?: string }) {
  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">{title}</h3>
      {!items || items.length === 0 ? (
        <p className="text-white/40 text-sm italic">{emptyLabel || 'No data yet'}</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.key} className="flex items-center justify-between text-sm">
              <span className="text-white/70 truncate pr-2">{item.key}</span>
              <span className="text-white/40 font-mono shrink-0">{item.count}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) {
  return (
    <Card className="p-6 bg-white/5 border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium mb-2">{title}</p>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </Card>
  );
}
