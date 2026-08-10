'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Megaphone, Plus, Search, Filter, MoreHorizontal, 
  Play, Pause, BarChart3, Users, Mail, MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCampaigns } from '@/actions/email-va/campaigns';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const res = await getCampaigns();
    if (res.success) {
      setCampaigns(res.campaigns);
    }
    setLoading(false);
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background text-white p-6 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-primary" />
            Marketing Campaigns
          </h1>
          <p className="text-white/50">Create, send, and analyze outbound email campaigns.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/campaigns/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]">
              <Plus className="w-4 h-4 mr-2" /> New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Sent Campaigns', value: campaigns.filter(c => c.status === 'sent').length, icon: <Megaphone className="w-4 h-4 text-primary" /> },
          { label: 'Total Emails Sent', value: campaigns.reduce((acc, c) => acc + (c.stats?.sent || 0), 0), icon: <Mail className="w-4 h-4 text-blue-400" /> },
          { label: 'Avg Open Rate', value: '42.8%', icon: <Users className="w-4 h-4 text-green-400" /> },
          { label: 'Avg Click Rate', value: '12.4%', icon: <MousePointerClick className="w-4 h-4 text-orange-400" /> },
        ].map((kpi, i) => (
          <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/50 text-sm font-medium">{kpi.label}</p>
                {kpi.icon}
              </div>
              <h3 className="text-3xl font-bold text-white">{loading ? <Skeleton className="h-9 w-16 bg-white/10" /> : kpi.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Search campaigns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white/70 hover:text-white hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {loading ? (
          [1,2,3].map(i => (
            <Card key={i} className="bg-white/5 border-white/10 p-6">
              <div className="flex gap-4 items-center"><Skeleton className="w-12 h-12 rounded-lg bg-white/5" /><div className="space-y-2 flex-1"><Skeleton className="h-5 w-48 bg-white/5" /><Skeleton className="h-4 w-32 bg-white/5" /></div></div>
            </Card>
          ))
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No campaigns found.</p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
            <Card key={campaign.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-white/20 transition-colors group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  
                  {/* Info Section */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        campaign.status === 'sent' ? 'bg-green-500/10 text-green-400' :
                        campaign.status === 'sending' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                        campaign.status === 'draft' ? 'bg-white/10 text-white/70' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {campaign.status}
                      </span>
                      <span className="text-white/40 text-xs font-mono">
                        {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{campaign.name}</h3>
                    <p className="text-white/50 text-sm mb-4">Subject: "{campaign.subject}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Audience:</span>
                      <div className="flex gap-1">
                        {campaign.recipientTags?.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="md:w-64 bg-black/20 p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Sent</div>
                        <div className="text-xl font-bold text-white">{campaign.stats?.sent || 0}</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Errors</div>
                        <div className="text-xl font-bold text-red-400">{campaign.stats?.failed || 0}</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Open %</div>
                        <div className="text-xl font-bold text-white">--</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Click %</div>
                        <div className="text-xl font-bold text-white">--</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="p-4 bg-black/40 flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-white/10">
                    <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
