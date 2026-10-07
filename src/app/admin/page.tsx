'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3, Users, Mail, MessageSquare, Zap, Settings,
  Activity, Command, Calendar, Eye,
  Sparkles, Globe, LayoutTemplate, FileText, UserCheck, Tag as TagIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from './layout';
import { getHomeMetrics, getVisitorMetrics } from '@/actions/analytics';
import { getRecentActivity } from '@/actions/crm/activity';
import { getBookings } from '@/actions/bookings';

const ACTIVITY_ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  email_received: { icon: <Mail className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-500/10 border-blue-500/20' },
  email_sent: { icon: <Mail className="w-4 h-4 text-primary" />, bg: 'bg-primary/20 border-primary/30' },
  enquiry_submitted: { icon: <Globe className="w-4 h-4 text-purple-400" />, bg: 'bg-purple-500/10 border-purple-500/20' },
  lead_created: { icon: <Users className="w-4 h-4 text-green-400" />, bg: 'bg-green-500/10 border-green-500/20' },
  lead_status_changed: { icon: <UserCheck className="w-4 h-4 text-green-400" />, bg: 'bg-green-500/10 border-green-500/20' },
  note_added: { icon: <FileText className="w-4 h-4 text-orange-400" />, bg: 'bg-orange-500/10 border-orange-500/20' },
  discovery_call_booked: { icon: <Calendar className="w-4 h-4 text-primary" />, bg: 'bg-primary/20 border-primary/30' },
};

function timeAgo(iso?: string) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [commandQuery, setCommandQuery] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  const [metrics, setMetrics] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [upcomingCalls, setUpcomingCalls] = useState<any[]>([]);
  const [visitorMetrics, setVisitorMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHomeMetrics(),
      getRecentActivity(8),
      getBookings({ upcoming: true }),
      getVisitorMetrics(30),
    ]).then(([metricsRes, activityRes, bookingsRes, visitorRes]) => {
      if (metricsRes.success) setMetrics(metricsRes.metrics);
      if (activityRes.success) setActivity(activityRes.events);
      if (bookingsRes.success) setUpcomingCalls(bookingsRes.bookings);
      if (visitorRes.success) setVisitorMetrics(visitorRes.metrics);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        commandInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && commandQuery.trim()) {
      router.push(`/admin/crm?q=${encodeURIComponent(commandQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background text-white p-6 md:p-8">
      
      {/* Header & Global Command Bar */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Welcome back, {user?.name?.split(' ')[0] || 'Cowboy'}
          </h1>
          <p className="text-white/50 text-lg">Your Command Center is ready. What would you like to do today?</p>
        </div>

        {/* Command Bar — ⌘K focuses it; Enter searches contacts/leads in the CRM */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center p-2 focus-within:bg-black/80 transition-colors shadow-2xl">
            <div className="p-3">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <input
              ref={commandInputRef}
              type="text"
              placeholder="Search contacts or leads, then press Enter... (⌘K)"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              onKeyDown={handleCommandSubmit}
              className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-white/40 text-lg px-2"
            />
            <div className="px-3 flex gap-2">
              <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-white/20 bg-white/5 px-2 font-mono text-[10px] font-medium text-white/50">
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Main Modules */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* KPI Overview — every value and trend line below is real, live Firestore data */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: 'Visitors',
                value: visitorMetrics?.uniqueVisitors ?? 0,
                icon: <Eye className="w-4 h-4 text-purple-400" />,
                trend: 'last 30 days',
              },
              {
                label: 'Unread Emails',
                value: metrics?.unreadEmails ?? 0,
                icon: <Mail className="w-4 h-4 text-blue-400" />,
                trend: 'in inbox',
              },
              {
                label: 'New Leads',
                value: metrics?.newLeadsLast7Days ?? 0,
                icon: <Users className="w-4 h-4 text-green-400" />,
                trend: 'last 7 days',
              },
              {
                label: 'Discovery Calls',
                value: upcomingCalls.length,
                icon: <Calendar className="w-4 h-4 text-primary" />,
                trend: 'upcoming',
              },
              {
                label: 'Active Campaigns',
                value: (metrics?.draftCampaigns ?? 0) + (metrics?.sendingCampaigns ?? 0),
                icon: <MessageSquare className="w-4 h-4 text-primary" />,
                trend: `${metrics?.draftCampaigns ?? 0} draft, ${metrics?.sendingCampaigns ?? 0} sending`,
              },
              {
                label: 'Automations',
                value: metrics?.activeAutomations ?? 0,
                icon: <Zap className="w-4 h-4 text-orange-400" />,
                trend: `${metrics?.inactiveAutomations ?? 0} disabled`,
              },
            ].map((kpi, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
                    {kpi.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{loading ? '—' : kpi.value}</h3>
                  <p className="text-[10px] text-white/40">{kpi.trend}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Access Grid */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-primary" /> Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/inbox">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Inbox</h3>
                    <p className="text-xs text-white/50">Manage threaded conversations & AI replies.</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/admin/crm">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">CRM Contacts</h3>
                    <p className="text-xs text-white/50">Manage leads, customers, and scoring.</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/bookings">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Bookings</h3>
                    <p className="text-xs text-white/50">Manage discovery call bookings.</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/campaigns">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Campaigns</h3>
                    <p className="text-xs text-white/50">Launch outbound marketing blasts.</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/automations">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Automations</h3>
                    <p className="text-xs text-white/50">Build trigger-based workflows.</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/admin/analytics">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Analytics</h3>
                    <p className="text-xs text-white/50">View performance metrics and insights.</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/admin/settings">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-500/20 text-zinc-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Settings</h3>
                    <p className="text-xs text-white/50">Configure global preferences.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Activity Feed */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-md h-full min-h-[500px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Activity Feed
                </h2>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 bg-white/5 rounded" />
                        <div className="h-3 w-3/4 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <p className="text-sm text-white/40 italic text-center py-12">No activity yet.</p>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {activity.map((item, i) => {
                    const visual = ACTIVITY_ICONS[item.type] || { icon: <TagIcon className="w-4 h-4 text-white/60" />, bg: 'bg-white/5 border-white/10' };
                    return (
                      <div key={item.id || i} className="relative flex items-start justify-between group">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${visual.bg} shrink-0 z-10 mr-4`}>
                          {visual.icon}
                        </div>
                        <div className="w-full">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-sm font-bold text-white/90">{item.title}</h4>
                            <span className="text-[10px] font-mono text-white/40">{timeAgo(item.createdAt)}</span>
                          </div>
                          <p className="text-xs text-white/50">
                            {item.contactName || item.contactEmail} — {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}