'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Users, 
  Send, 
  Inbox, 
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Zap,
  Clock
} from 'lucide-react';

// Create a custom hook that works with the integrated AuthProvider
import { useContext } from 'react';
import { AuthContext } from './layout';

function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminLayout');
  }
  return context;
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name}! Manage your business operations
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  Last login: {user?.lastLogin ? 
                    new Date(user.lastLogin).toLocaleString() : 
                    'First login'}
                </span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AdminCard
            title="Email Virtual Assistant"
            description="Manage email campaigns, leads, and AI-powered replies"
            icon={<Mail className="w-8 h-8" />}
            href="/admin/email-va"
            color="blue"
          />
          <AdminCard
            title="Analytics"
            description="View business metrics and performance data"
            icon={<BarChart3 className="w-8 h-8" />}
            href="/admin/analytics"
            color="green"
            comingSoon
          />
          <AdminCard
            title="Content Management"
            description="Manage blog posts, pages, and content"
            icon={<FileText className="w-8 h-8" />}
            href="/admin/content"
            color="purple"
            comingSoon
          />
          <AdminCard
            title="Messages"
            description="View and respond to customer inquiries"
            icon={<MessageSquare className="w-8 h-8" />}
            href="/admin/messages"
            color="yellow"
            comingSoon
          />
          <AdminCard
            title="Settings"
            description="Configure system settings and preferences"
            icon={<Settings className="w-8 h-8" />}
            href="/admin/settings"
            color="gray"
            comingSoon
          />
          <AdminCard
            title="Automations"
            description="Set up automated workflows and triggers"
            icon={<Zap className="w-8 h-8" />}
            href="/admin/automations"
            color="red"
            comingSoon
          />
        </div>

        {/* Email VA Quick Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Email Virtual Assistant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickLinkCard
              title="Dashboard"
              href="/admin/email-va"
              icon={<BarChart3 className="w-5 h-5" />}
            />
            <QuickLinkCard
              title="Compose"
              href="/admin/email-va/compose"
              icon={<Mail className="w-5 h-5" />}
            />
            <QuickLinkCard
              title="Campaigns"
              href="/admin/email-va/campaigns"
              icon={<Send className="w-5 h-5" />}
            />
            <QuickLinkCard
              title="Leads"
              href="/admin/email-va/leads"
              icon={<Users className="w-5 h-5" />}
            />
            <QuickLinkCard
              title="Inbox"
              href="/admin/email-va/inbox"
              icon={<Inbox className="w-5 h-5" />}
            />
            <QuickLinkCard
              title="Settings"
              href="/admin/email-va/settings"
              icon={<Settings className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <span className="text-sm text-gray-500">
              User: {user?.email}
            </span>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Activity will appear here as you use the system</p>
          </div>
        </Card>
      </div>
    </>
  );
}

function AdminCard({ 
  title, 
  description, 
  icon, 
  href, 
  color,
  comingSoon = false 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  comingSoon?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    red: 'bg-red-500 hover:bg-red-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
  }[color] || 'bg-gray-500 hover:bg-gray-600';

  const content = (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${comingSoon ? 'opacity-60' : 'cursor-pointer'}`}>
      <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {comingSoon && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
      )}
    </Card>
  );

  if (comingSoon) {
    return content;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

function QuickLinkCard({ 
  title, 
  href, 
  icon 
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="text-gray-600">
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </div>
      </Card>
    </Link>
  );
}