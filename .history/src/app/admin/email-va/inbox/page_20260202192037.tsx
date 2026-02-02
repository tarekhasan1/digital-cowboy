'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateAIReply, approveAndSendReply } from '../../../../../actions/email-va/ai-reply';
import { getInboxMessages } from '../../../../../actions/email-va/inbox';
import { 
  deleteInboxMessage, 
  bulkDeleteInboxMessages,
  sendManualReply,
  sendEditedAIReply,
  archiveInboxMessage,
  markMessageStatus,
  markAsSpam,
  unmarkAsSpam
} from '../../../../../actions/email-va/inbox-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Clock, CheckCircle, Send, Sparkles, RefreshCw, Download, Trash2, Edit2, Copy, Archive, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
  manualReply?: string;
  replyType?: string;
  createdAt: any;
}

type FilterTab = 'all' | 'unread' | 'spam' | 'archived';

export default function InboxPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingReply, setEditingReply] = useState(false);
  const [editedReplyText, setEditedReplyText] = useState('');
  const [manualReplyMode, setManualReplyMode] = useState(false);
  const [manualReplyText, setManualReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [allMessages, setAllMessages] = useState<InboxMessage[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    // Filter messages based on active tab
    filterMessages(activeTab);
  }, [activeTab, allMessages]);

  const loadMessages = async () => {
    setLoading(true);
    const result = await getInboxMessages(50);
    if (result.success && result.messages) {
      setAllMessages(result.messages as InboxMessage[]);
    }
    setLoading(false);
  };

  const filterMessages = useCallback((tab: FilterTab) => {
    let filtered = allMessages;
    
    switch (tab) {
      case 'unread':
        filtered = allMessages.filter(m => m.status === 'unread');
        break;
      case 'spam':
        filtered = allMessages.filter(m => m.intent === 'spam');
        break;
      case 'archived':
        filtered = allMessages.filter(m => m.status === 'archived');
        break;
      case 'all':
      default:
        filtered = allMessages;
    }
    
    setMessages(filtered);
    setSelectedMessages(new Set());
  }, [allMessages]);

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
      setEditingReply(false);
      setEditedReplyText('');
    } else {
      alert((result as any).error || 'Failed to send reply');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Delete this message? This action cannot be undone.')) return;

    const result = await deleteInboxMessage(messageId);
    
    if (result.success) {
      alert('Message deleted');
      await loadMessages();
      setSelectedMessage(null);
    } else {
      alert((result as any).error || 'Failed to delete message');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedMessages.size) {
      alert('Please select messages to delete');
      return;
    }

    if (!confirm(`Delete ${selectedMessages.size} messages? This action cannot be undone.`)) return;

    const result = await bulkDeleteInboxMessages(Array.from(selectedMessages));
    
    if (result.success) {
      alert(`Deleted ${result.deleted} messages`);
      setSelectedMessages(new Set());
      await loadMessages();
      setSelectedMessage(null);
    } else {
      alert((result as any).error || 'Failed to delete messages');
    }
  };

  const handleSendManualReply = async () => {
    if (!selectedMessage || !manualReplyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    setSendingReply(true);
    const result = await sendManualReply(selectedMessage.id, manualReplyText);
    setSendingReply(false);

    if (result.success) {
      alert('Reply sent successfully!');
      setManualReplyMode(false);
      setManualReplyText('');
      await loadMessages();
      setSelectedMessage(null);
    } else {
      alert((result as any).error || 'Failed to send reply');
    }
  };

  const handleSendEditedReply = async () => {
    if (!selectedMessage || !editedReplyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    setSendingReply(true);
    const result = await sendEditedAIReply(selectedMessage.id, editedReplyText);
    setSendingReply(false);

    if (result.success) {
      alert('Reply sent successfully!');
      setEditingReply(false);
      setEditedReplyText('');
      await loadMessages();
      setSelectedMessage(null);
    } else {
      alert((result as any).error || 'Failed to send reply');
    }
  };

  const handleArchiveMessage = async (messageId: string) => {
    const result = await archiveInboxMessage(messageId);
    
    if (result.success) {
      alert('Message archived');
      await loadMessages();
      setSelectedMessage(null);
    } else {
      alert((result as any).error || 'Failed to archive message');
    }
  };

  const handleMarkAsSpam = async (messageId: string) => {
    const msg = allMessages.find(m => m.id === messageId);
    if (msg?.intent === 'spam') {
      // Unmark spam
      const result = await unmarkAsSpam(messageId, 'other');
      if (result.success) {
        alert('Message unmarked from spam');
        await loadMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, intent: 'other' });
        }
      } else {
        alert((result as any).error || 'Failed to unmark spam');
      }
    } else {
      // Mark as spam
      const result = await markAsSpam(messageId);
      if (result.success) {
        alert('Message marked as spam');
        await loadMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, intent: 'spam' });
        }
      } else {
        alert((result as any).error || 'Failed to mark as spam');
      }
    }
  };

  const handleToggleReadStatus = async (messageId: string) => {
    const msg = allMessages.find(m => m.id === messageId);
    const newStatus = msg?.status === 'unread' ? 'read' : 'unread';
    
    const result = await markMessageStatus(messageId, newStatus as 'read' | 'unread');
    
    if (result.success) {
      await loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } else {
      alert((result as any).error || 'Failed to update status');
    }
  };

  const toggleSelectMessage = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map(m => m.id)));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Mail className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'drafted': return <Clock className="w-4 h-4" />;
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
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

  const getTabCount = (tab: FilterTab): number => {
    switch (tab) {
      case 'unread':
        return allMessages.filter(m => m.status === 'unread').length;
      case 'spam':
        return allMessages.filter(m => m.intent === 'spam').length;
      case 'archived':
        return allMessages.filter(m => m.status === 'archived').length;
      case 'all':
      default:
        return allMessages.length;
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

        {/* Title and Tabs */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Inbox</h1>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200">
            {(['all', 'unread', 'spam', 'archived'] as FilterTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="capitalize">
                  {tab === 'all' && '📬 All'}
                  {tab === 'unread' && '✉️ New'}
                  {tab === 'spam' && '⚠️ Spam'}
                  {tab === 'archived' && '📁 Archived'}
                </span>
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {getTabCount(tab)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <Card className="lg:col-span-1 p-4 max-h-[800px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">
                {activeTab === 'all' && 'All Messages'}
                {activeTab === 'unread' && 'New Messages'}
                {activeTab === 'spam' && 'Spam'}
                {activeTab === 'archived' && 'Archived'}
                <span className="text-gray-500 text-sm ml-2">({messages.length})</span>
              </h2>
              {messages.length > 0 && (
                <input
                  type="checkbox"
                  checked={selectedMessages.size === messages.length}
                  onChange={toggleSelectAll}
                  title="Select all"
                  className="cursor-pointer"
                />
              )}
            </div>
            
            {selectedMessages.size > 0 && (
              <div className="mb-4 space-y-2">
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete {selectedMessages.size} Messages
                </Button>
              </div>
            )}
            
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No messages</p>
                <p className="text-gray-400 text-xs mt-1">
                  {activeTab === 'spam' && 'No spam messages'}
                  {activeTab === 'archived' && 'No archived messages'}
                  {activeTab === 'unread' && 'No new messages'}
                  {activeTab === 'all' && 'Emails will appear here'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded cursor-pointer transition ${
                      selectedMessage?.id === msg.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMessages.has(msg.id)}
                        onChange={() => toggleSelectMessage(msg.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0" onClick={() => setSelectedMessage(msg)}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getStatusIcon(msg.status)}
                            <span className={`font-medium text-sm truncate ${msg.status === 'unread' ? 'font-bold' : ''}`}>
                              {msg.fromName || msg.fromEmail}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${getPriorityColor(msg.priority)}`}>
                            {msg.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                        {msg.intent === 'spam' && (
                          <span className="text-xs text-red-600 mt-1 inline-block">
                            🚫 Marked as spam
                          </span>
                        )}
                        {msg.intent && msg.intent !== 'spam' && (
                          <span className="text-xs text-gray-500 mt-1 inline-block">
                            {msg.intent}
                          </span>
                        )}
                      </div>
                    </div>
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
                    {selectedMessage.intent && selectedMessage.intent !== 'spam' && (
                      <p><strong>Intent:</strong> 
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {selectedMessage.intent}
                        </span>
                      </p>
                    )}
                    {selectedMessage.intent === 'spam' && (
                      <p><strong>Status:</strong> 
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          🚫 Marked as Spam
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

                {/* AI Reply Section */}
                {selectedMessage.aiReply && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      AI Generated Reply:
                    </h3>
                    
                    {editingReply ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editedReplyText}
                          onChange={(e) => setEditedReplyText(e.target.value)}
                          className="min-h-[200px]"
                          placeholder="Edit the AI reply..."
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSendEditedReply}
                            disabled={sendingReply}
                            className="flex-1"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {sendingReply ? 'Sending...' : 'Send Edited Reply'}
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingReply(false);
                              setEditedReplyText('');
                            }}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-purple-50 p-4 rounded border border-purple-200">
                          <p className="whitespace-pre-wrap text-sm">{selectedMessage.aiReply}</p>
                        </div>
                        
                        {selectedMessage.status !== 'sent' && !selectedMessage.aiApproved && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingReply(true);
                                setEditedReplyText(selectedMessage.aiReply || '');
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit & Send
                            </Button>
                            <Button
                              onClick={() => handleApproveReply(selectedMessage.id)}
                              className="flex-1"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send as Is
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Reply Section */}
                {!selectedMessage.aiReply && (
                  <Button
                    onClick={() => {
                      setGenerating(true);
                      handleGenerateReply(selectedMessage.id);
                    }}
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

                {/* Manual Reply Option */}
                {manualReplyMode ? (
                  <div className="space-y-3 bg-blue-50 p-4 rounded border border-blue-200">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Compose Manual Reply:
                    </h3>
                    <Textarea
                      value={manualReplyText}
                      onChange={(e) => setManualReplyText(e.target.value)}
                      className="min-h-[200px]"
                      placeholder="Type your reply here..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSendManualReply}
                        disabled={sendingReply}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                      </Button>
                      <Button
                        onClick={() => {
                          setManualReplyMode(false);
                          setManualReplyText('');
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  selectedMessage.status !== 'sent' && (
                    <Button
                      onClick={() => setManualReplyMode(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Write Manual Reply
                    </Button>
                  )
                )}

                {/* Status */}
                {selectedMessage.status === 'sent' && (
                  <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800 text-sm">
                    ✓ {selectedMessage.replyType === 'manual' ? 'Manual' : 'AI'} reply sent successfully
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 border-t pt-4 flex-wrap">
                  <Button
                    onClick={() => handleToggleReadStatus(selectedMessage.id)}
                    variant="outline"
                    size="sm"
                  >
                    {selectedMessage.status === 'unread' ? (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Mark as Read
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Mark as Unread
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleMarkAsSpam(selectedMessage.id)}
                    variant={selectedMessage.intent === 'spam' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {selectedMessage.intent === 'spam' ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Unmark Spam
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Mark as Spam
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleArchiveMessage(selectedMessage.id)}
                    variant={selectedMessage.status === 'archived' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {selectedMessage.status === 'archived' ? 'Unarchive' : 'Archive'}
                  </Button>

                  <Button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}