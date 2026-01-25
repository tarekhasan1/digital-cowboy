'use client';

import { useState, useEffect } from 'react';
import { getSettings, saveConfig, savePrompts } from '../../../../../actions/email-va/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [classifyPrompt, setClassifyPrompt] = useState('');
  const [replyPrompt, setReplyPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getSettings();
      
      console.log('Settings result:', result);
      
      if (result.success) {
        // 🔥 FIX: Safely access nested properties with defaults
        setAutoReplyEnabled(result.config?.autoReplyEnabled ?? false);
        setRequireApproval(result.config?.requireApproval ?? true);
        setClassifyPrompt(result.prompts?.classify ?? '');
        setReplyPrompt(result.prompts?.reply ?? '');
      } else {
        // Still set defaults even on failure
        setAutoReplyEnabled(false);
        setRequireApproval(true);
        setClassifyPrompt('');
        setReplyPrompt('');
        setError(result.error || 'Failed to load settings');
      }
    } catch (err: any) {
      console.error('Load settings error:', err);
      setError(err.message || 'An unexpected error occurred');
      // Set defaults on error
      setAutoReplyEnabled(false);
      setRequireApproval(true);
      setClassifyPrompt('');
      setReplyPrompt('');
    } finally {
      // 🔥 FIX: Always set loading to false
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const result = await saveConfig({
        autoReplyEnabled,
        requireApproval,
        rateLimitPerHour: 50,
      });
      
      if (result.success) {
        alert('Settings saved successfully!');
      } else {
        alert(result.error || 'Failed to save settings');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrompts = async () => {
    setSaving(true);
    try {
      const result = await savePrompts({
        classifyPrompt,
        replyPrompt,
      });
      
      if (result.success) {
        alert('Prompts saved successfully!');
      } else {
        alert(result.error || 'Failed to save prompts');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save prompts');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/email-va">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin/email-va">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={loadSettings} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Error Banner */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700 text-sm">
              ⚠️ {error}
            </p>
            <Button 
              onClick={loadSettings} 
              variant="outline" 
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </Card>
        )}

        <div className="space-y-6">
          {/* Email Config */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Email Configuration</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">Auto-Reply</h3>
                  <p className="text-sm text-gray-600">
                    Automatically generate AI replies for incoming messages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoReplyEnabled}
                    onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">Require Approval</h3>
                  <p className="text-sm text-gray-600">
                    Require human approval before sending AI replies
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireApproval}
                    onChange={(e) => setRequireApproval(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <Button onClick={handleSaveConfig} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </Card>

          {/* AI Prompts */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold">AI Prompts</h2>
            </div>
            
            <div className="space-y-6">
              {/* Classification Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intent Classification Prompt
                </label>
                <Textarea
                  value={classifyPrompt}
                  onChange={(e) => setClassifyPrompt(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder="Enter your classification prompt here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This prompt is used to classify incoming emails by intent and priority
                </p>
              </div>

              {/* Reply Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Generation Prompt
                </label>
                <Textarea
                  value={replyPrompt}
                  onChange={(e) => setReplyPrompt(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder="Enter your reply generation prompt here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This prompt is used to generate automatic email replies
                </p>
              </div>

              <Button onClick={handleSavePrompts} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Prompts'}
              </Button>
            </div>
          </Card>

          {/* API Info */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold mb-2">API Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>AI Provider:</strong> Groq (FREE - 14,400 requests/day)
              </p>
              <p>
                <strong>Email Provider:</strong> Resend (FREE - 3,000 emails/month)
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Configure API keys in your .env.local file
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}