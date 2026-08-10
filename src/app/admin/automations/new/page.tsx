'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Zap, Save, Plus, Workflow, MessageSquare, Mail, Users, Bell, ArrowRight } from 'lucide-react';
import { createAutomation } from '../../../../../actions/automations';

const TRIGGERS = [
  { id: 'contact_form_submitted', name: 'Contact Form Submitted', description: 'Triggers when a new enquiry is received', icon: <MessageSquare className="w-6 h-6 text-blue-400" /> },
  { id: 'new_lead_added', name: 'New Lead Added', description: 'Triggers when a lead is manually or automatically added', icon: <Users className="w-6 h-6 text-green-400" /> },
  { id: 'email_received', name: 'Email Received', description: 'Triggers when a new email hits the Inbox', icon: <Mail className="w-6 h-6 text-purple-400" /> },
];

const ACTIONS = [
  { id: 'send_welcome_email', name: 'Send Welcome Email', description: 'Send a pre-configured welcome sequence', icon: <Mail className="w-6 h-6 text-blue-400" /> },
  { id: 'notify_team_slack', name: 'Notify Team (Slack)', description: 'Send a notification to the team channel', icon: <Bell className="w-6 h-6 text-yellow-400" /> },
  { id: 'add_to_campaign', name: 'Add to Drip Campaign', description: 'Subscribe the user to a specific marketing campaign', icon: <Workflow className="w-6 h-6 text-green-400" /> },
];

export default function NewAutomationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: '',
    action: '',
    active: true,
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.trigger || !formData.action) {
      alert('Please fill in a name, select a trigger, and select an action.');
      return;
    }

    setSaving(true);
    const res = await createAutomation(formData);
    setSaving(false);

    if (res.success) {
      router.push('/admin/automations');
    } else {
      alert(res.error || 'Failed to create workflow');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/automations">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Create Workflow</h1>
            <p className="text-white/60">Design a new automated sequence</p>
          </div>
        </div>
        <Button 
          onClick={handleCreate} 
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Creating...' : 'Save Workflow'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Basic Details */}
        <Card className="bg-white/5 border-white/10 p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
            Basic Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Workflow Name</label>
              <Input 
                placeholder="e.g., Lead Welcome Sequence" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 text-lg focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Description (Optional)</label>
              <Textarea 
                placeholder="What does this automation do?" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-black/20 border-white/10 text-white placeholder:text-white/30 resize-none h-24 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </Card>

        {/* Builder Canvas */}
        <div className="relative">
          {/* Vertical connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-1/2 z-0"></div>

          {/* Trigger Section */}
          <Card className="bg-black/40 border-white/10 p-8 shadow-2xl relative z-10 backdrop-blur-md overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">2</span>
              When this happens... (Trigger)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {TRIGGERS.map(trigger => (
                <button
                  key={trigger.id}
                  onClick={() => setFormData({...formData, trigger: trigger.id})}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    formData.trigger === trigger.id 
                      ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {formData.trigger === trigger.id && (
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_0_rgba(59,130,246,0.8)] animate-pulse"></div>
                  )}
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${formData.trigger === trigger.id ? 'bg-blue-500/20' : 'bg-black/30'}`}>
                    {trigger.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">{trigger.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{trigger.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Connection Node */}
          <div className="flex justify-center py-6 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_20px_0_rgba(var(--primary-rgb),0.3)] backdrop-blur-md">
              <ArrowRight className="w-5 h-5 text-primary transform rotate-90" />
            </div>
          </div>

          {/* Action Section */}
          <Card className="bg-black/40 border-white/10 p-8 shadow-2xl relative z-10 backdrop-blur-md overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center text-sm shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]">3</span>
              Do this... (Action)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => setFormData({...formData, action: action.id})}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    formData.action === action.id 
                      ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {formData.action === action.id && (
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_0_rgba(34,197,94,0.8)] animate-pulse"></div>
                  )}
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${formData.action === action.id ? 'bg-green-500/20' : 'bg-black/30'}`}>
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">{action.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{action.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
