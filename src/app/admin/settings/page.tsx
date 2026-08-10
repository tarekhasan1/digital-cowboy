'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Save, Bell, Shield, Globe } from 'lucide-react';

export default function GlobalSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Global Settings
          </h1>
          <p className="text-white/60">Manage platform configurations and preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Card className="bg-white/5 border-white/10 p-4">
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/20 text-primary rounded-lg font-medium border border-primary/20 transition-colors">
                <Globe className="w-4 h-4" /> General Site Details
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors">
                <Bell className="w-4 h-4" /> Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors">
                <Shield className="w-4 h-4" /> Security
              </button>
            </nav>
          </Card>
        </div>

        <div className="col-span-2 space-y-6">
          <Card className="bg-white/5 border-white/10 p-6 space-y-6">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-4">General Site Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Site Name</label>
                <input type="text" defaultValue="DigitalCowboy" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Support Email</label>
                <input type="email" defaultValue="hello@digitalcowboy.com.au" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Physical Address</label>
                <input type="text" defaultValue="Perth, Western Australia" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6 space-y-6">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-4">Branding</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Primary Color (Hex)</label>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-md bg-[#c72635] shadow-inner"></div>
                  <input type="text" defaultValue="#c72635" className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
