'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Plus, Workflow, MessageSquare, Trash2, Power, PowerOff, Mail, Users } from 'lucide-react';
import { getAutomations, toggleAutomation, deleteAutomation, AutomationWorkflow } from '../../../../actions/automations';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    setLoading(true);
    const res = await getAutomations();
    if (res.success && res.automations) {
      setAutomations(res.automations as AutomationWorkflow[]);
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleAutomation(id, !currentStatus);
    if (res.success) {
      setAutomations(automations.map(a => a.id === id ? { ...a, active: !currentStatus } : a));
    } else {
      alert('Failed to toggle automation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    const res = await deleteAutomation(id);
    if (res.success) {
      setAutomations(automations.filter(a => a.id !== id));
    } else {
      alert('Failed to delete automation');
    }
  };

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes('contact')) return <MessageSquare className="w-5 h-5 text-blue-400" />;
    if (trigger.includes('lead')) return <Users className="w-5 h-5 text-green-400" />;
    return <Workflow className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            Automations
          </h1>
          <p className="text-white/60 text-lg">Configure automatic responses and background workflows.</p>
        </div>
        <Link href="/admin/automations/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]">
            <Plus className="w-5 h-5 mr-2" />
            New Workflow
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <Skeleton className="h-48 w-full bg-white/5 rounded-2xl" />
        ) : automations.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Workflow className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Automations Yet</h3>
            <p className="text-white/50 mb-6 max-w-md">You haven't created any automated workflows. Build one to save time on repetitive tasks.</p>
            <Link href="/admin/automations/new">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Create Your First Workflow</Button>
            </Link>
          </Card>
        ) : (
          automations.map((automation) => (
            <Card key={automation.id} className="bg-white/5 border-white/10 p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex gap-5 w-full">
                  <div className={`w-14 h-14 rounded-2xl ${automation.active ? 'bg-primary/20 shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.4)]' : 'bg-white/5'} flex items-center justify-center shrink-0 transition-all`}>
                    {automation.active ? <Zap className="w-7 h-7 text-primary animate-pulse" /> : <PowerOff className="w-7 h-7 text-white/40" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{automation.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${automation.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                        {automation.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    {automation.description && (
                      <p className="text-white/60 mb-5 text-sm">{automation.description}</p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 bg-black/30 border border-white/5 rounded-xl p-4">
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1 block">Trigger</span>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                          {getTriggerIcon(automation.trigger)}
                          <span className="font-medium">{automation.trigger.replace(/_/g, ' ').toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center justify-center px-4">
                        <div className="w-8 h-[2px] bg-white/10 relative">
                          <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-white/10 transform rotate-45"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1 block">Action</span>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                          <Mail className="w-5 h-5 text-blue-400" />
                          <span className="font-medium">{automation.action.replace(/_/g, ' ').toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                  <Button 
                    onClick={() => handleToggle(automation.id!, automation.active)} 
                    variant={automation.active ? "outline" : "default"} 
                    className={automation.active ? "border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                  >
                    {automation.active ? 'Pause' : 'Activate'}
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(automation.id!)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/40">Triggered:</span>
                  <span className="font-bold text-white">{automation.stats.triggered} times</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">Success Rate:</span>
                  <span className="font-bold text-green-400">
                    {automation.stats.triggered > 0 
                      ? Math.round((automation.stats.success / automation.stats.triggered) * 100) 
                      : 100}%
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
