'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateAIReply, approveAndSendReply } from '../../../../../actions/email-va/ai-reply';
import { 
  sendManualReply,
  sendEditedAIReply,
} from '../../../../../actions/email-va/inbox-actions';
import {
  getInboxMessagesPaginated,
  getInboxCounts,
  permanentlyDeleteMessage,
  bulkPermanentlyDeleteMessages,
  moveMessageToCategory,
  bulkMoveMessages,
  markMessageAsRead,
  bulkMarkAsRead,
  getInboxMessage,
} from '../../../../../actions/email-va/inbox-advanced';
import { syncEmailsFromResend } from '../../../../../actions/email-va/sync-resend';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, Mail, Clock, CheckCircle, Send, Sparkles, RefreshCw, 
  Trash2, Edit2, Archive, Search, ChevronRight, ChevronLeft, AlertCircle,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

interface InboxMessage {
  id: string;
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
  intent?: string;
  priority: string;
  category: string;
  status: string;
  aiReply?: string;
  aiApproved: boolean;
  manualReply?: string;
  replyType?: string;
  createdAt: any;
}

type Category = 'inbox' | 'spam' | 'archived';

const CATEGORIES: { label: string; value: Category; icon: any }[] = [
  { label: 'Inbox', value: 'inbox', icon: Mail },
  { label: 'Spam', value: 'spam', icon: AlertCircle },
  { label: 'Archived', value: 'archived', icon: Archive },
];

export default function InboxPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('inbox');
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState({ inbox: 0, spam: 0, archived: 0 });
  
  // Pagination state
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [editingReply, setEditingReply] = useState(false);
  const [editedReplyText, setEditedReplyText] = useState('');
  const [manualReplyMode, setManualReplyMode] = useState(false);
  const [manualReplyText, setManualReplyText] = useState('');
  const [showActions, setShowActions] = useState<string | null>(null);

  // Auto-sync on mount
  useEffect(() => {
    const autoSync = async () => {
      console.log('[Inbox] Starting auto-sync...');
      setSyncing(true);
      try {
        const syncResult = await syncEmailsFromResend();
        console.log('[Inbox] Sync result:', syncResult);
      } catch (e) {
        console.error('[Inbox] Sync error:', e);
      }
      setSyncing(false);
      
      console.log('[Inbox] Loading messages...');
      try {
        await loadMessages(true);
        await loadCounts();
      } catch (e) {
        console.error('[Inbox] Load error:', e);
      }
    };
    autoSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages when category changes
  useEffect(() => {
    const loadOnCategoryChange = async () => {
      setPage(1);
      setCursor(undefined);
      setLoading(true);
      const result = await getInboxMessagesPaginated(
        { category: activeCategory, search: searchQuery },
        20,
        undefined
      );
      if (result.items) {
        setMessages(result.items);
        setHasMore(result.hasMore);
        setCursor(result.items.length > 0 ? result.items[result.items.length - 1].id : undefined);
      }
      setLoading(false);
    };
    loadOnCategoryChange();
  }, [activeCategory, searchQuery]);

  const loadMessages = async (reset: boolean = false) => {
    setLoading(true);
    const result = await getInboxMessagesPaginated(
      { category: activeCategory, search: searchQuery },
      20,
      reset ? undefined : cursor
    );

    if (result.items) {
      setMessages(reset ? result.items : [...messages, ...result.items]);
      setHasMore(result.hasMore);
      setCursor(result.items.length > 0 ? result.items[result.items.length - 1].id : undefined);
    }
    setLoading(false);
  };

  const loadCounts = async () => {
    const result = await getInboxCounts();
    setCounts(result);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setPage(1);
      setCursor(undefined);
    },
    []
  );

  const handleDeletePermanently = async (messageId: string) => {
    if (!confirm('Permanently delete this message? This cannot be undone.')) return;

    const result = await permanentlyDeleteMessage(messageId);
    if (result.success) {
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
      await loadCounts();
    } else {
      alert(result.error || 'Failed to delete');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedMessages.size) {
      alert('Please select messages');
      return;
    }
    if (!confirm(`Permanently delete ${selectedMessages.size} messages? This cannot be undone.`)) return;

    const result = await bulkPermanentlyDeleteMessages(Array.from(selectedMessages));
    if (result.success) {
      setMessages(messages.filter(m => !selectedMessages.has(m.id)));
      setSelectedMessages(new Set());
      setSelectedMessage(null);
      await loadCounts();
    } else {
      alert(result.error || 'Failed to delete');
    }
  };

  const handleMoveToCategory = async (messageId: string, category: Category) => {
    const result = await moveMessageToCategory(messageId, category);
    if (result.success) {
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
      await loadCounts();
    } else {
      alert(result.error || 'Failed to move');
    }
  };

  const handleBulkMove = async (category: Category) => {
    if (!selectedMessages.size) return;

    const result = await bulkMoveMessages(Array.from(selectedMessages), category);
    if (result.success) {
      setMessages(messages.filter(m => !selectedMessages.has(m.id)));
      setSelectedMessages(new Set());
      await loadCounts();
    } else {
      alert(result.error || 'Failed to move');
    }
  };

  const handleGenerateReply = async (messageId: string) => {
    setGenerating(true);
    const result = await generateAIReply(messageId);
    setGenerating(false);

    if (result.success) {
      const updated = await getInboxMessage(messageId);
      if (updated.success && updated.message) {
        setSelectedMessage(updated.message);
      }
    } else {
      alert((result as any).error || 'Failed to generate');
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
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
      setSelectedMessage(null);
      setManualReplyMode(false);
      setManualReplyText('');
      await loadCounts();
    } else {
      alert((result as any).error || 'Failed to send');
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
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
      setSelectedMessage(null);
      setEditingReply(false);
      setEditedReplyText('');
      await loadCounts();
    } else {
      alert((result as any).error || 'Failed to send');
    }
  };

  const handleApproveReply = async (messageId: string) => {
    if (!confirm('Send this reply?')) return;

    const result = await approveAndSendReply(messageId);
    if (result.success) {
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
      await loadCounts();
    } else {
      alert((result as any).error || 'Failed to send');
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: any) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'N/A';
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
              Back
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Inbox</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const count = counts[cat.value];
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
                  activeCategory === cat.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => {
              setSyncing(true);
              syncEmailsFromResend().then(() => {
                setSyncing(false);
                loadMessages(true);
                loadCounts();
              });
            }}
            disabled={syncing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.size > 0 && (
          <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-medium">{selectedMessages.size} selected</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkMove('spam')}
                  size="sm"
                  variant="outline"
                >
                  Mark as Spam
                </Button>
                <Button
                  onClick={() => handleBulkMove('archived')}
                  size="sm"
                  variant="outline"
                >
                  Archive
                </Button>
                <Button
                  onClick={handleBulkDelete}
                  size="sm"
                  variant="destructive"
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <Card className="lg:col-span-1 p-4 max-h-[800px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Messages</h2>
              <input
                type="checkbox"
                checked={selectedMessages.size === messages.length && messages.length > 0}
                onChange={toggleSelectAll}
                className="cursor-pointer"
              />
            </div>

            {loading && !messages.length ? (
              <p className="text-center text-gray-500 py-8">Loading...</p>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No messages</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded border transition cursor-pointer ${
                      selectedMessage?.id === msg.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
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
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => setSelectedMessage(msg)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm truncate">
                            {msg.status === 'unread' && <span className="font-bold">●</span>}
                            {msg.fromName || msg.fromEmail}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${getPriorityColor(msg.priority)}`}>
                            {msg.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{msg.subject}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {(hasMore || page > 1) && (
              <div className="mt-4 flex gap-2 justify-between">
                <Button
                  onClick={() => {
                    setPage(p => p - 1);
                    setCursor(undefined);
                    loadMessages(true);
                  }}
                  disabled={page === 1}
                  size="sm"
                  variant="outline"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-500 flex items-center">Page {page}</span>
                <Button
                  onClick={() => {
                    setPage(p => p + 1);
                    loadMessages(false);
                  }}
                  disabled={!hasMore}
                  size="sm"
                  variant="outline"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Message Detail */}
          <Card className="lg:col-span-2 p-6">
            {!selectedMessage ? (
              <div className="text-center py-20">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select a message</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMessage.subject}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {selectedMessage.fromName || selectedMessage.fromEmail}
                      </p>
                    </div>
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowActions(showActions === selectedMessage.id ? null : selectedMessage.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {showActions === selectedMessage.id && (
                        <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                          {activeCategory !== 'spam' && (
                            <button
                              onClick={() => {
                                handleMoveToCategory(selectedMessage.id, 'spam');
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                              Mark as Spam
                            </button>
                          )}
                          {activeCategory !== 'archived' && (
                            <button
                              onClick={() => {
                                handleMoveToCategory(selectedMessage.id, 'archived');
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                              Archive
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleDeletePermanently(selectedMessage.id);
                              setShowActions(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                          >
                            Delete Permanently
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <h3 className="font-semibold mb-2">Message</h3>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="whitespace-pre-wrap text-sm">{selectedMessage.body}</p>
                  </div>
                </div>

                {/* Replies Section */}
                {selectedMessage.status !== 'sent' && (
                  <>
                    {selectedMessage.aiReply && (
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          AI Reply
                        </h3>
                        {editingReply ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editedReplyText}
                              onChange={(e) => setEditedReplyText(e.target.value)}
                              className="min-h-[200px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSendEditedReply}
                                disabled={sendingReply}
                                className="flex-1"
                              >
                                {sendingReply ? 'Sending...' : 'Send'}
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
                            <div className="bg-purple-50 p-4 rounded border">
                              <p className="text-sm whitespace-pre-wrap">{selectedMessage.aiReply}</p>
                            </div>
                            {!selectedMessage.aiApproved && (
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
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleApproveReply(selectedMessage.id)}
                                  className="flex-1"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {!selectedMessage.aiReply && !manualReplyMode && (
                      <Button
                        onClick={() => handleGenerateReply(selectedMessage.id)}
                        disabled={generating}
                        variant="outline"
                        className="w-full"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {generating ? 'Generating...' : 'Generate AI Reply'}
                      </Button>
                    )}

                    {manualReplyMode ? (
                      <div className="space-y-3 bg-blue-50 p-4 rounded border">
                        <h3 className="font-semibold">Reply</h3>
                        <Textarea
                          value={manualReplyText}
                          onChange={(e) => setManualReplyText(e.target.value)}
                          className="min-h-[200px]"
                          placeholder="Type reply..."
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSendManualReply}
                            disabled={sendingReply}
                            className="flex-1"
                          >
                            {sendingReply ? 'Sending...' : 'Send'}
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
                      <Button
                        onClick={() => setManualReplyMode(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Write Reply
                      </Button>
                    )}
                  </>
                )}

                {selectedMessage.status === 'sent' && (
                  <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800 text-sm">
                    ✓ Reply sent
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
