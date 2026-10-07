'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Save, Bell, Globe, Calendar, X } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/actions/settings';

type TabId = 'general' | 'notifications' | 'availability';

const WEEKDAYS: { id: string; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [newBlackoutDate, setNewBlackoutDate] = useState('');

  useEffect(() => {
    getSiteSettings().then(s => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const update = (patch: Partial<SiteSettings>) => {
    setSettings(prev => prev ? { ...prev, ...patch } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await saveSiteSettings(settings);
    setSaving(false);
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
        <Button onClick={handleSave} disabled={saving || loading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Card className="bg-white/5 border-white/10 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'general' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-4 h-4" /> General Site Details
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'notifications' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bell className="w-4 h-4" /> Notifications
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'availability' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" /> Availability
              </button>
            </nav>
          </Card>
        </div>

        <div className="col-span-2 space-y-6">
          {loading || !settings ? (
            <Card className="bg-white/5 border-white/10 p-6 space-y-4">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-10 w-full bg-white/10" />
            </Card>
          ) : activeTab === 'general' ? (
            <>
              <Card className="bg-white/5 border-white/10 p-6 space-y-6">
                <h3 className="font-semibold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-4">General Site Details</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={e => update({ siteName: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={e => update({ supportEmail: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Physical Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={e => update({ address: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-white/5 border-white/10 p-6 space-y-6">
                <h3 className="font-semibold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-4">Branding</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Primary Color (Hex)</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-md shadow-inner" style={{ backgroundColor: settings.primaryColor }}></div>
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={e => update({ primaryColor: e.target.value })}
                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : activeTab === 'notifications' ? (
            <Card className="bg-white/5 border-white/10 p-6 space-y-6">
              <h3 className="font-semibold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-4">Notifications</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Notify Email Address</label>
                  <input
                    type="email"
                    value={settings.notifyEmail}
                    onChange={e => update({ notifyEmail: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-white/40">Where new-lead/enquiry and automation notifications are sent.</p>
                </div>

                <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
                  <span className="text-sm font-medium text-white/80">Email me when a new lead comes in</span>
                  <input
                    type="checkbox"
                    checked={settings.notifyOnNewLead}
                    onChange={e => update({ notifyOnNewLead: e.target.checked })}
                    className="w-5 h-5 accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
                  <span className="text-sm font-medium text-white/80">Email me when a new enquiry is submitted</span>
                  <input
                    type="checkbox"
                    checked={settings.notifyOnNewEnquiry}
                    onChange={e => update({ notifyOnNewEnquiry: e.target.checked })}
                    className="w-5 h-5 accent-primary"
                  />
                </label>
              </div>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10 p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-white uppercase text-xs tracking-wider border-b border-white/10 pb-4 mb-4">Discovery Call Availability</h3>
                <p className="text-xs text-white/40 -mt-2">Times are in Australia/Brisbane (no daylight saving).</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => {
                    const enabled = settings.bookingEnabledDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => update({
                          bookingEnabledDays: enabled
                            ? settings.bookingEnabledDays.filter(d => d !== day.id)
                            : [...settings.bookingEnabledDays, day.id],
                        })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          enabled ? 'bg-primary/20 text-primary border-primary/30' : 'bg-black/20 text-white/50 border-white/10 hover:text-white'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Start Time</label>
                  <input
                    type="time"
                    value={settings.bookingStartTime}
                    onChange={e => update({ bookingStartTime: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">End Time</label>
                  <input
                    type="time"
                    value={settings.bookingEndTime}
                    onChange={e => update({ bookingEndTime: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Slot Length</label>
                  <select
                    value={settings.bookingSlotMinutes}
                    onChange={e => update({ bookingSlotMinutes: Number(e.target.value) })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Bookable Days Ahead</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={settings.bookingDaysAhead}
                    onChange={e => update({ bookingDaysAhead: Number(e.target.value) })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Blackout Dates</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newBlackoutDate}
                    onChange={e => setNewBlackoutDate(e.target.value)}
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                    onClick={() => {
                      if (!newBlackoutDate || settings.bookingBlackoutDates.includes(newBlackoutDate)) return;
                      update({ bookingBlackoutDates: [...settings.bookingBlackoutDates, newBlackoutDate].sort() });
                      setNewBlackoutDate('');
                    }}
                  >
                    Add
                  </Button>
                </div>
                {settings.bookingBlackoutDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {settings.bookingBlackoutDates.map(date => (
                      <span key={date} className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white/70">
                        {date}
                        <button
                          type="button"
                          onClick={() => update({ bookingBlackoutDates: settings.bookingBlackoutDates.filter(d => d !== date) })}
                          className="text-white/40 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
