'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, Users, Mail, MessageSquare, Zap, Settings, 
  ArrowRight, Activity, TrendingUp, Search, Command,
  Sparkles, ExternalLink, Globe, LayoutTemplate
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from './layout';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [commandQuery, setCommandQuery] = useState('');

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

        {/* Command Bar (⌘K mock) */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center p-2 focus-within:bg-black/80 transition-colors shadow-2xl">
            <div className="p-3">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <input 
              type="text" 
              placeholder="Ask the AI, search contacts, or jump to a module... (Press ⌘K)"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
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
          
          {/* KPI Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Unread Emails', value: '12', icon: <Mail className="w-4 h-4 text-blue-400" />, trend: '+3 today' },
              { label: 'New Leads', value: '45', icon: <Users className="w-4 h-4 text-green-400" />, trend: '+12% this week' },
              { label: 'Active Campaigns', value: '2', icon: <MessageSquare className="w-4 h-4 text-primary" />, trend: 'Sending...' },
              { label: 'Automations', value: '8', icon: <Zap className="w-4 h-4 text-orange-400" />, trend: 'All healthy' },
            ].map((kpi, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
                    {kpi.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
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
                <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white">View All</Button>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                
                {[
                  { icon: <Mail className="w-4 h-4 text-blue-400" />, title: 'New Email Received', desc: 'From john@example.com regarding SEO services', time: '10 mins ago', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { icon: <Users className="w-4 h-4 text-green-400" />, title: 'Lead Qualified', desc: 'Sarah Smith score increased to 85', time: '1 hour ago', bg: 'bg-green-500/10 border-green-500/20' },
                  { icon: <MessageSquare className="w-4 h-4 text-primary" />, title: 'Campaign Sent', desc: '"Summer Promo 2026" blasted to 450 contacts', time: '3 hours ago', bg: 'bg-primary/20 border-primary/30' },
                  { icon: <Zap className="w-4 h-4 text-orange-400" />, title: 'Automation Triggered', desc: 'Welcome Sequence started for 3 new subscribers', time: '5 hours ago', bg: 'bg-orange-500/10 border-orange-500/20' },
                  { icon: <Globe className="w-4 h-4 text-purple-400" />, title: 'Website Lead', desc: 'New contact form submission', time: 'Yesterday', bg: 'bg-purple-500/10 border-purple-500/20' },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-start justify-between group">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${item.bg} shrink-0 z-10 mr-4`}>
                      {item.icon}
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-sm font-bold text-white/90">{item.title}</h4>
                        <span className="text-[10px] font-mono text-white/40">{item.time}</span>
                      </div>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
                
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}