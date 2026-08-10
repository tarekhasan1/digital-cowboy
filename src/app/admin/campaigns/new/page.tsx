'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Check, Sparkles, Send, Megaphone, 
  Users, Edit3, Settings, PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createCampaign, sendCampaign } from '@/actions/email-va/campaigns';
import Link from 'next/link';

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    setGenerating(true);
    // Simulate AI generation for now (real integration would use groqAI action)
    setTimeout(() => {
      setSubject(`Exclusive Offer: Unlock your potential with ${name || 'us'}`);
      setBodyText(`Hi {{name}},\n\nI noticed you might be interested in our services.\n\nWe have a special offer...`);
      setGenerating(false);
    }, 1500);
  };

  const handleNext = () => setStep(s => Math.min(3, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSaveDraft = async () => {
    setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const res = await createCampaign({
      name,
      subject,
      bodyHtml: bodyText.replace(/\n/g, '<br>'),
      bodyPlain: bodyText,
      recipientTags: tags
    });
    
    if (res.success) {
      router.push('/admin/campaigns');
    } else {
      alert('Error saving draft: ' + res.error);
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    if (!confirm('Are you sure you want to send this campaign immediately?')) return;
    
    setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const res = await createCampaign({
      name,
      subject,
      bodyHtml: bodyText.replace(/\n/g, '<br>'),
      bodyPlain: bodyText,
      recipientTags: tags
    });
    
    if (res.success && res.campaignId) {
      const sendRes = await sendCampaign(res.campaignId);
      if (sendRes.success) {
        alert('Campaign queued for sending!');
        router.push('/admin/campaigns');
      } else {
        alert('Saved but failed to send: ' + sendRes.error);
        setLoading(false);
      }
    } else {
      alert('Error creating campaign: ' + res.error);
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Setup', icon: <Settings className="w-4 h-4" /> },
    { num: 2, title: 'Content', icon: <Edit3 className="w-4 h-4" /> },
    { num: 3, title: 'Review', icon: <PlayCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background text-white p-6 md:p-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/campaigns">
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-white/50 text-sm">Design and launch your email marketing campaign.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0"></div>
        {steps.map((s, i) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
              step > s.num ? 'bg-primary border-primary text-primary-foreground' :
              step === s.num ? 'bg-background border-primary text-primary shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.5)]' :
              'bg-background border-white/20 text-white/40'
            }`}>
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? 'text-white' : 'text-white/40'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8">
          
          {step === 1 && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Campaign Name</label>
                <Input 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Summer Promo 2026"
                  className="bg-black/20 border-white/10 text-white focus:border-primary/50"
                />
                <p className="text-xs text-white/40 mt-2">Internal name only, recipients will not see this.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Target Audience (Tags)</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="e.g., vip, newsletter, inactive"
                    className="bg-black/20 border-white/10 text-white pl-9 focus:border-primary/50"
                  />
                </div>
                <p className="text-xs text-white/40 mt-2">Comma separated tags. Leave empty to send to ALL active contacts.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email Subject</label>
                  <Input 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Attention grabbing subject line..."
                    className="bg-black/20 border-white/10 text-white font-medium focus:border-primary/50 text-lg py-6"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-white/70">Email Body</label>
                    <span className="text-xs text-white/40">Use {"{{name}}"} and {"{{company}}"} for personalization</span>
                  </div>
                  <textarea 
                    value={bodyText}
                    onChange={e => setBodyText(e.target.value)}
                    placeholder="Type your email content here..."
                    className="w-full min-h-[300px] bg-black/20 border border-white/10 rounded-md text-white p-4 focus:border-primary/50 outline-none resize-y"
                  />
                </div>
              </div>

              {/* AI Assistant Sidebar */}
              <div className="bg-black/40 rounded-xl p-5 border border-white/5 h-fit sticky top-24">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-primary">
                  <Sparkles className="w-4 h-4" /> AI Generator
                </h3>
                <p className="text-sm text-white/50 mb-4">Describe what you want to say, and the AI will draft the perfect campaign.</p>
                <textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g., Announce our new SEO service with a 20% discount for existing customers."
                  className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-md text-white text-sm p-3 focus:border-primary/50 outline-none mb-3 resize-none"
                />
                <Button 
                  onClick={handleGenerateAI}
                  disabled={generating || !aiPrompt}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  {generating ? 'Generating...' : 'Draft Campaign'}
                </Button>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl mx-auto space-y-8">
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                  <Megaphone className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Review & Send</h2>
                <p className="text-white/50">Double check your campaign details before blasting off.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Campaign Name</p>
                  <p className="font-medium">{name || '(Unnamed)'}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Audience</p>
                  <p className="font-medium">{tagsInput || 'All Contacts'}</p>
                </div>
              </div>

              <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Subject</p>
                  <p className="font-bold text-lg">{subject}</p>
                </div>
                <div className="p-6">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-4">Preview</p>
                  <div className="whitespace-pre-wrap text-white/80">
                    {bodyText || <span className="italic text-white/30">No content provided...</span>}
                  </div>
                </div>
              </div>

            </div>
          )}

        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          disabled={step === 1}
          className="text-white/70 hover:text-white"
        >
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={loading} className="border-white/10 text-white hover:bg-white/5">
            Save as Draft
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Continue
            </Button>
          ) : (
            <Button onClick={handleSendNow} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]">
              {loading ? 'Sending...' : 'Send Campaign Now'}
              {!loading && <Send className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>

    </div>
  );
}
