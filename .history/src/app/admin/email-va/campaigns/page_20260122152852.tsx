'use client';

import { useState, useEffect } from 'react';
import { getCampaigns, deleteCampaign } from '../../../../../actions/email-va/campaigns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Send, Trash2, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
  createdAt: any;
  sentAt?: any;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await getCampaigns();
    if (result.success) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Delete this campaign?')) return;
    
    const result = await deleteCampaign(campaignId);
    if (result.success) {
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
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
      draft: <Clock className="w-3 h-3" />,
      sending: <Send className="w-3 h-3" />,
      sent: <CheckCircle className="w-3 h-3" />,
      paused: <Clock className="w-3 h-3" />,
    }[status];

    return (
      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${styles}`}>
        {icons}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/email-va">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Email Campaigns</h1>
            <p className="text-gray-600 mt-1">{campaigns.length} total campaigns</p>
          </div>
          <Link href="/admin/email-va/campaigns/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Card className="p-6">
              <p className="text-gray-500">Loading campaigns...</p>
            </Card>
          ) : campaigns.length === 0 ? (
            <Card className="p-6 col-span-full text-center">
              <Send className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No campaigns yet</p>
              <Link href="/admin/email-va/campaigns/new">
                <Button>Create Your First Campaign</Button>
              </Link>
            </Card>
          ) : (
            campaigns.map(campaign => (
              <Card key={campaign.id} className="p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg">{campaign.name}</h3>
                  {getStatusBadge(campaign.status)}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {campaign.subject}
                </p>

                {campaign.status === 'sent' && (
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {campaign.stats.total}
                        </p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {campaign.stats.sent}
                        </p>
                        <p className="text-xs text-gray-600">Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {campaign.stats.failed}
                        </p>
                        <p className="text-xs text-gray-600">Failed</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/admin/email-va/campaigns/${campaign.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}