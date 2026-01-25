'use client';

import { useState, useEffect } from 'react';
import { generateAIReply, approveAndSendReply } from '../../../../../actions/email-va/ai-reply';
import { getInboxMessages } from '../../../../../actions/email-va/inbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Mail, Clock, CheckCircle, Send, Sparkles, RefreshCw, Download } from 'lucide-react';
import Link from 'next/link';
import { syncEmailsFromResend } from '../../../../../actions/email-va/sync-resend';

interface InboxMessage {
  id: string;
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
  intent?: string;
  priority: string;
  status: string;
  aiReply?: string;
  aiApproved: boolean;
  createdAt: any;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const result = await getInboxMessages(50);
    if (result.success && result.messages) {
      setMessages(result.messages as InboxMessage[]);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const handleSyncFromResend = async () => {
    setSyncing(true);
    const result = await syncEmailsFromResend();
    setSyncing(false);

    if (result.success) {
      alert(result.message || `Synced ${result.synced} new emails!`);
      await loadMessages();
    } else {
      alert((result as any).error || 'Failed to sync emails');
    }
  };

  const handleGenerateReply = async (messageId: string) => {
    setGenerating(true);
    const result = await generateAIReply(messageId);
    setGenerating(false);

    if (result.success) {
      // Reload all messages to get updated data
      await loadMessages();
      
      // Update selected message with the new reply
      const updatedMessages = await getInboxMessages(50);
      if (updatedMessages.success && updatedMessages.messages) {
        const updatedMsg = updatedMessages.messages.find((m: any) => m.id === messageId);
        if (updatedMsg) {
          setSelectedMessage(updatedMsg as InboxMessage);
        }
      }
    } else {
      alert((result as any).error || 'Failed to generate reply');
    }
  };

  const handleApproveReply = async (messageId: string) => {
    if (!confirm('Send this AI-generated reply?')) return;

    const result = await approveAndSendReply(messageId);
    
    if (result.success) {
      alert('Reply sent successfully!');
      await loadMessages();
      setSelectedMessage(null);
    } else {
      alert((result as any).error || 'Failed to send reply');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Mail className="w-4 h-4" />;
      case 'drafted': return <Clock className="w-4 h-4" />;
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin/email-va">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Inbox</h1>
          <div className="flex gap-3">
            <Button 
              onClick={handleSyncFromResend} 
              disabled={syncing}
              variant="default"
              size="sm"
            >
              <Download className={`w-4 h-4 mr-2 ${syncing ? 'animate-bounce' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync from Resend'}
            </Button>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <Card className="lg:col-span-1 p-4 max-h-[800px] overflow-y-auto">
            <h2 className="font-semibold mb-4">Messages ({messages.length})</h2>
            
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Emails sent to your inbox will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3 rounded cursor-pointer transition ${
                      selectedMessage?.id === msg.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(msg.status)}
                        <span className="font-medium text-sm truncate">
                          {msg.fromName || msg.fromEmail}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(msg.priority)}`}>
                        {msg.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                    {msg.intent && (
                      <span className="text-xs text-gray-500 mt-1 inline-block">
                        {msg.intent}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Message Detail */}
          <Card className="lg:col-span-2 p-6">
            {!selectedMessage ? (
              <div className="text-center py-20 text-gray-500">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select a message to view details</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Message Info */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{selectedMessage.subject}</h2>
                    <span className={`px-3 py-1 rounded text-sm ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>From:</strong> {selectedMessage.fromName || selectedMessage.fromEmail}</p>
                    <p><strong>Email:</strong> {selectedMessage.fromEmail}</p>
                    {selectedMessage.intent && (
                      <p><strong>Intent:</strong> 
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {selectedMessage.intent}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Original Message */}
                <div>
                  <h3 className="font-semibold mb-2">Message:</h3>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="whitespace-pre-wrap text-sm">{selectedMessage.body}</p>
                  </div>
                </div>

                {/* AI Reply */}
                {selectedMessage.aiReply ? (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      AI Generated Reply:
                    </h3>
                    <div className="bg-purple-50 p-4 rounded border border-purple-200">
                      <p className="whitespace-pre-wrap text-sm">{selectedMessage.aiReply}</p>
                    </div>
                    
                    {selectedMessage.status !== 'sent' && !selectedMessage.aiApproved && (
                      <Button
                        onClick={() => handleApproveReply(selectedMessage.id)}
                        className="mt-4 w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Approve & Send Reply
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleGenerateReply(selectedMessage.id)}
                    disabled={generating}
                    variant="outline"
                    className="w-full"
                  >
                    {generating ? (
                      'Generating AI Reply...'
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Reply
                      </>
                    )}
                  </Button>
                )}

                {/* Status */}
                {selectedMessage.status === 'sent' && (
                  <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800 text-sm">
                    ✓ Reply sent successfully
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}