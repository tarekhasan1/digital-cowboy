/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send, Trash2, Clock, CheckCircle, Users, Mail } from 'lucide-react';
import Link from 'next/link';
import { getCampaign, sendCampaign } from '../../../../../../actions/email-va/campaigns';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  recipientTags: string[];
  status: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
  createdAt: any;
  sentAt?: any;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    setLoading(true);
    const result = await getCampaign(campaignId);
    if (result.success && result.campaign) {
      setCampaign(result.campaign as Campaign);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!campaign || campaign.status !== 'draft') {
      alert('Only draft campaigns can be sent');
      return;
    }

    if (!confirm('Send this campaign now? This cannot be undone.')) return;

    setSending(true);
    const result = await sendCampaign(campaignId);
    setSending(false);

    if (result.success) {
      alert(`Campaign sent! ${result.sent} sent, ${result.failed} failed`);
      await loadCampaign();
    } else {
      alert(result.error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sending: 'bg-blue-100 text-blue-700',
      sent: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
    }[status] || 'bg-gray-100 text-gray-700';

    const icons = {
      draft: <Clock className="w-4 h-4" />,
      sending: <Send className="w-4 h-4" />,
      sent: <CheckCircle className="w-4 h-4" />,
      paused: <Clock className="w-4 h-4" />,
    }[status];

    return (
      <span className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${styles}`}>
        {icons}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Campaign not found</p>
          <Link href="/admin/email-va/campaigns">
            <Button className="mt-4">Back to Campaigns</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/email-va/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-gray-600 mt-1">Created {new Date(campaign.createdAt?.toDate?.() || campaign.createdAt).toLocaleDateString()}</p>
          </div>
          {getStatusBadge(campaign.status)}
        </div>

        <div className="space-y-6">
          {/* Campaign Info */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Campaign Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="mt-1">{campaign.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Recipient Tags</label>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {campaign.recipientTags && campaign.recipientTags.length > 0 ? (
                    campaign.recipientTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">All active leads</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Email Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Email Preview</h2>
            <div className="bg-gray-50 p-4 rounded border">
              <div className="bg-white p-4 rounded border">
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Subject:</p>
                  <p className="font-semibold">{campaign.subject}</p>
                </div>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }}
                />
              </div>
            </div>
          </Card>

          {/* Stats */}
          {campaign.status === 'sent' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Campaign Statistics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-3xl font-bold text-blue-600">{campaign.stats.total}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Recipients</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-3xl font-bold text-green-600">{campaign.stats.sent}</p>
                  <p className="text-sm text-gray-600 mt-1">Sent</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-3xl font-bold text-red-600">{campaign.stats.failed}</p>
                  <p className="text-sm text-gray-600 mt-1">Failed</p>
                </div>
              </div>
              {campaign.sentAt && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Sent on {new Date(campaign.sentAt?.toDate?.() || campaign.sentAt).toLocaleString()}
                </p>
              )}
            </Card>
          )}

          {/* Actions */}
          {campaign.status === 'draft' && (
            <Card className="p-6">
              <div className="flex gap-3">
                <Button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex-1"
                >
                  {sending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Campaign
                    </>
                  )}
                </Button>
                <Link href="/admin/email-va/campaigns">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
