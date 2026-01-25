'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Users, 
  Send, 
  Inbox, 
  TrendingUp,
  Settings 
} from 'lucide-react';

interface Stats {
  totalLeads: number;
  activeCampaigns: number;
  pendingReplies: number;
  sentToday: number;
}

export default function EmailVADashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    activeCampaigns: 0,
    pendingReplies: 0,
    sentToday: 0,
  });

  useEffect(() => {
    // Fetch stats from Firestore
    // This is a placeholder - implement actual fetching
    setStats({
      totalLeads: 150,
      activeCampaigns: 3,
      pendingReplies: 5,
      sentToday: 24,
    });
  }, []);

  return (
    <div className="min-h-screen pt-[100px] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Virtual Assistant</h1>
          <p className="text-gray-600 mt-2">Manage your email campaigns and auto-replies</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={<Send className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Pending Replies"
            value={stats.pendingReplies}
            icon={<Inbox className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Sent Today"
            value={stats.sentToday}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Compose Email"
            description="Send a manual email to your contacts"
            icon={<Mail className="w-8 h-8" />}
            href="/admin/email-va/compose"
            color="blue"
          />
          <QuickActionCard
            title="Create Campaign"
            description="Start a new email campaign"
            icon={<Send className="w-8 h-8" />}
            href="/admin/email-va/campaigns/new"
            color="green"
          />
          <QuickActionCard
            title="Manage Leads"
            description="Import and organize your contacts"
            icon={<Users className="w-8 h-8" />}
            href="/admin/email-va/leads"
            color="purple"
          />
          <QuickActionCard
            title="Inbox"
            description="View and manage incoming messages"
            icon={<Inbox className="w-8 h-8" />}
            href="/admin/email-va/inbox"
            color="yellow"
          />
          <QuickActionCard
            title="Campaigns"
            description="View all email campaigns"
            icon={<TrendingUp className="w-8 h-8" />}
            href="/admin/email-va/campaigns"
            color="red"
          />
          <QuickActionCard
            title="Settings"
            description="Configure AI prompts and email settings"
            icon={<Settings className="w-8 h-8" />}
            href="/admin/email-va/settings"
            color="gray"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  }[color] || 'bg-gray-100 text-gray-600';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function QuickActionCard({ title, description, icon, href, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    red: 'bg-red-500 hover:bg-red-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
  }[color] || 'bg-gray-500 hover:bg-gray-600';

  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </Card>
    </Link>
  );
}