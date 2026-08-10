'use client';

import { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../../../../actions/analytics';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, FileText, Mail, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      const res = await getDashboardMetrics();
      if (res.success) {
        setMetrics(res.metrics);
      }
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

      <Card className="bg-white/5 border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <BarChart3 className="w-16 h-16 text-white/20 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics Coming Soon</h3>
        <p className="text-white/50 max-w-md">
          We are currently integrating deeper tracking (e.g., page views, conversion rates). Basic platform metrics are displayed above.
        </p>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
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
