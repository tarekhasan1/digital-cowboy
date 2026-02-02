'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                {user?.role === 'superadmin' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{greeting}, {user?.name}! Manage your business operations</p>
            </div>
            
            {/* User info card */}
            <Card className="hidden md:block p-4 border-blue-100 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Last login: {user?.lastLogin ? 
                        new Date(user.lastLogin).toLocaleDateString() : 
                        'First login'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Sessions</p>
                <p className="text-2xl font-bold mt-2">1</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Admin Role</p>
                <p className="text-lg font-semibold mt-2 capitalize">{user?.role}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">System Status</p>
                <p className="text-lg font-semibold mt-2 text-green-600">Operational</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </Card>
        </div>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Email Virtual Assistant</h2>
            <span className="text-sm text-blue-600 font-medium">Quick Access</span>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <span className="text-sm text-gray-500">
              Session started: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Welcome back!</p>
                <p className="text-sm text-gray-600">
                  You successfully logged in to the admin panel
                </p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="text-center py-4 text-gray-500">
              <p>No other recent activity to display</p>
              <p className="text-sm mt-2">Activity will appear here as you use the system</p>
            </div>
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
    <Card className={`p-6 hover:shadow-lg transition-shadow ${comingSoon ? 'opacity-60' : 'cursor-pointer hover:border-blue-300'}`}>
      <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center text-white mb-4 transition-colors`}>
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
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="text-gray-600">
            {icon}
          </div>
          <span className="font-medium text-sm">{title}</span>
        </div>
      </Card>
    </Link>
  );
}