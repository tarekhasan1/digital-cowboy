'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Inbox, Star, Send, File, Archive, Trash2,
  Search, CheckSquare, Square, MoreVertical,
  Tag, Clock, AlertCircle, MessageSquare, Briefcase, Plus,
  Reply, Sparkles, Mail, MailOpen, RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getConversations, Conversation, createConversation, updateConversation } from '@/actions/crm/conversations';
import { getMessagesByConversation, EmailMessage, createMessage, upsertDraft, deleteDraft } from '@/actions/crm/messages';
import { getContactById, Contact, upsertContact } from '@/actions/crm/contacts';
import { getContactActivity, ActivityEvent } from '@/actions/crm/activity';
import { generateDraft, modifyDraft } from '@/actions/crm/ai';
import { pullInboundEmails } from '@/actions/crm/inbound';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

type FolderType = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archived' | 'trash' | 'spam';

function getInitials(nameOrEmail: string) {
  const trimmed = nameOrEmail.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

function formatListTimestamp(value?: string | Date) {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  const daysAgo = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (daysAgo < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const AVATAR_PALETTE = [
  'bg-rose-500/20 text-rose-300',
  'bg-amber-500/20 text-amber-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-sky-500/20 text-sky-300',
  'bg-violet-500/20 text-violet-300',
  'bg-pink-500/20 text-pink-300',
];

function getAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState<FolderType>('inbox');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<EmailMessage[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivityEvent[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sendingCompose, setSendingCompose] = useState(false);

  const [draftingReply, setDraftingReply] = useState(false);
  const [draftingCompose, setDraftingCompose] = useState(false);
  const [modifyingDraft, setModifyingDraft] = useState(false);

  const [pullingEmails, setPullingEmails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadConversations();
    setSelectedIds(new Set());
  }, [activeFolder]);

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c => {
      return (
        c.subject?.toLowerCase().includes(q) ||
        c.lastMessageSnippet?.toLowerCase().includes(q) ||
        c.contactName?.toLowerCase().includes(q) ||
        c.contactEmail?.toLowerCase().includes(q)
      );
    });
  }, [conversations, searchQuery]);

  const toggleSelected = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkArchive = async () => {
    const ids = Array.from(selectedIds);
    setConversations(prev => prev.filter(c => !ids.includes(c.id!)));
    clearSelection();
    await Promise.all(ids.map(id => updateConversation(id, { isArchived: true })));
  };

  const handleBulkTrash = async () => {
    const ids = Array.from(selectedIds);
    setConversations(prev => prev.filter(c => !ids.includes(c.id!)));
    clearSelection();
    await Promise.all(ids.map(id => {
      const conv = conversations.find(c => c.id === id);
      const labels = conv?.labels?.includes('trash') ? conv.labels : [...(conv?.labels || []), 'trash'];
      return updateConversation(id, { labels });
    }));
  };

  const handleBulkMarkRead = async () => {
    const ids = Array.from(selectedIds);
    setConversations(prev => prev.map(c => ids.includes(c.id!) ? { ...c, unreadCount: 0 } : c));
    clearSelection();
    await Promise.all(ids.map(id => updateConversation(id, { unreadCount: 0 })));
  };

  const handleToggleStar = async (id: string, currentlyStarred: boolean) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isStarred: !currentlyStarred } : c));
    await updateConversation(id, { isStarred: !currentlyStarred });
  };

  useEffect(() => {
    if (activeConvId) {
      loadThread(activeConvId);
    } else {
      setActiveMessages([]);
      setActiveContact(null);
      setReplyText('');
    }
  }, [activeConvId]);

  // Debounced Autosave for Drafts
  useEffect(() => {
    if (!activeConvId || !replyText.trim() || sendingReply) return;
    
    const handler = setTimeout(() => {
      upsertDraft(activeConvId, replyText).catch(console.error);
    }, 1500);

    return () => clearTimeout(handler);
  }, [replyText, activeConvId, sendingReply]);

  const loadConversations = async () => {
    setLoadingConvs(true);
    let filters: any = { folder: activeFolder };
    
    if (activeFolder === 'archived') filters.isArchived = true;
    else if (activeFolder === 'starred') filters.isStarred = true;

    const res = await getConversations(filters);
    if (res.success) {
      setConversations(res.conversations as Conversation[]);
    }
    setLoadingConvs(false);
  };

  const handlePullEmails = async () => {
    if (pullingEmails) return;
    setPullingEmails(true);
    try {
      await pullInboundEmails();
      await loadConversations();
    } catch (error) {
      console.error('Failed to pull emails:', error);
    } finally {
      setPullingEmails(false);
    }
  };

  const loadThread = async (convId: string) => {
    setLoadingThread(true);
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      const [msgRes, contactRes] = await Promise.all([
        getMessagesByConversation(convId),
        getContactById(conv.contactId)
      ]);
      
      if (contactRes.success && contactRes.contact) {
        setActiveContact(contactRes.contact as Contact);
        const activityRes = await getContactActivity(conv.contactId);
        if (activityRes.success) setActiveActivity(activityRes.events as ActivityEvent[]);
      }
      
      if (msgRes.success) {
        const msgs = msgRes.messages as EmailMessage[];
        // Filter out drafts from thread view
        const publishedMsgs = msgs.filter(m => m.deliveryStatus !== 'draft');
        setActiveMessages(publishedMsgs);
        
        // Load draft into composer if exists
        const draftMsg = msgs.find(m => m.deliveryStatus === 'draft');
        if (draftMsg) {
          setReplyText(draftMsg.text || '');
        } else {
          setReplyText('');
        }
      }
      if (contactRes.success) setActiveContact(contactRes.contact as Contact);
      
      // Auto-mark as read when opening a thread
      if (conv.unreadCount > 0) {
        updateConversation(convId, { unreadCount: 0 }).catch(console.error);
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
      }
    }
    setLoadingThread(false);
  };

  const handleToggleReadStatus = async () => {
    if (!activeConvId) return;
    const currentConv = conversations.find(c => c.id === activeConvId);
    if (!currentConv) return;
    
    const newUnreadCount = currentConv.unreadCount > 0 ? 0 : 1;
    
    // Optimistic UI update
    setConversations(prev => prev.map(c => 
      c.id === activeConvId ? { ...c, unreadCount: newUnreadCount } : c
    ));
    
    // Background sync
    await updateConversation(activeConvId, { unreadCount: newUnreadCount });
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeConvId || !activeContact) return;
    setSendingReply(true);
    
    const result = await createMessage({
      conversationId: activeConvId,
      direction: 'outbound',
      from: 'admin@digitalcowboy.com',
      to: activeContact.email,
      subject: `Re: ${conversations.find(c => c.id === activeConvId)?.subject}`,
      text: replyText,
      readStatus: 'read',
      sendViaResend: true
    });
    
    if (!result.success) {
      alert('Failed to send reply: ' + result.error);
    } else {
      // Clean up the draft once successfully sent
      await deleteDraft(activeConvId);
      
      // Optimistically add to thread
      const newMsg: EmailMessage = {
        id: result.messageId,
        conversationId: activeConvId,
        direction: 'outbound',
        from: 'admin@digitalcowboy.com',
        to: activeContact.email,
        subject: `Re: ${conversations.find(c => c.id === activeConvId)?.subject}`,
        text: replyText,
        readStatus: 'read',
        isStarred: false,
        deliveryStatus: 'sent',
        createdAt: new Date().toISOString()
      };
      setActiveMessages(prev => [...prev, newMsg]);
      
      // Optimistically update conversation snippet
      setConversations(prev => prev.map(c => 
        c.id === activeConvId 
          ? { ...c, lastMessageSnippet: replyText.substring(0, 100), latestDirection: 'outbound', lastMessageAt: new Date().toISOString() } 
          : c
      ));
    }
    
    setReplyText('');
    setSendingReply(false);
  };

  const handleSendCompose = async () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) return;
    setSendingCompose(true);
    
    const contactRes = await upsertContact({ email: composeTo });
    if (!contactRes.success || !contactRes.contactId) {
      alert('Failed to process contact');
      setSendingCompose(false);
      return;
    }
    
    const convRes = await createConversation({
      contactId: contactRes.contactId,
      subject: composeSubject,
      unreadCount: 0,
      isStarred: false,
      isArchived: false,
    });
    
    if (!convRes.success || !convRes.conversationId) {
      alert('Failed to create conversation');
      setSendingCompose(false);
      return;
    }

    const msgRes = await createMessage({
      conversationId: convRes.conversationId,
      direction: 'outbound',
      from: 'admin@digitalcowboy.com',
      to: composeTo,
      subject: composeSubject,
      text: composeBody,
      readStatus: 'read',
      sendViaResend: true
    });
    
    if (!msgRes.success) {
      alert('Failed to send email: ' + msgRes.error);
    }
    
    setIsComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setSendingCompose(false);
    
    if (activeFolder === 'sent') loadConversations();
  };

  const handleGenerateReplyDraft = async () => {
    if (!activeConvId) return;
    setDraftingReply(true);
    const res = await generateDraft(activeConvId);
    if (res.success && res.draft) {
      setReplyText(res.draft);
    } else {
      alert('Failed to generate draft: ' + res.error);
    }
    setDraftingReply(false);
  };

  const handleGenerateComposeDraft = async () => {
    setDraftingCompose(true);
    const context = composeSubject ? `Subject: ${composeSubject}` : 'General inquiry';
    // Provide a dummy ID since it's a new compose, backend handles it or we could create a different Groq wrapper
    const draftRes = await generateDraft('new', context);
    if (draftRes.success && draftRes.draft) {
      setComposeBody(draftRes.draft);
    }
    setDraftingCompose(false);
  };

  const handleModifyDraft = async (modifier: 'shorter' | 'professional' | 'friendly') => {
    if (!replyText.trim()) return;
    setModifyingDraft(true);
    const res = await modifyDraft(replyText, modifier);
    if (res.success && res.draft) {
      setReplyText(res.draft);
    }
    setModifyingDraft(false);
  };

  const selectNextConversation = (currentId: string) => {
    const currentIndex = conversations.findIndex(c => c.id === currentId);
    if (currentIndex === -1) return null;
    if (currentIndex < conversations.length - 1) {
      return conversations[currentIndex + 1].id || null;
    } else if (currentIndex > 0) {
      return conversations[currentIndex - 1].id || null;
    }
    return null;
  };

  const handleArchiveConversation = async () => {
    if (!activeConvId) return;
    const currentConv = conversations.find(c => c.id === activeConvId);
    if (!currentConv) return;
    
    // Toggle archive state
    const newArchivedState = !currentConv.isArchived;
    
    // Optimistically update local state immediately
    if (newArchivedState && activeFolder !== 'archived') {
      const nextId = selectNextConversation(activeConvId);
      setConversations(prev => prev.filter(c => c.id !== activeConvId));
      setActiveConvId(nextId);
    } else if (!newArchivedState && activeFolder === 'archived') {
      const nextId = selectNextConversation(activeConvId);
      setConversations(prev => prev.filter(c => c.id !== activeConvId));
      setActiveConvId(nextId);
    } else {
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, isArchived: newArchivedState } : c
      ));
    }
    
    // Background sync
    await updateConversation(activeConvId, { isArchived: newArchivedState });
  };

  const handleTrashConversation = async () => {
    if (!activeConvId) return;
    const currentConv = conversations.find(c => c.id === activeConvId);
    if (!currentConv) return;
    
    const currentLabels = currentConv.labels || [];
    const isTrash = currentLabels.includes('trash');
    
    const newLabels = isTrash 
      ? currentLabels.filter(l => l !== 'trash')
      : [...currentLabels, 'trash'];
      
    // Optimistic UI update
    if (!isTrash && activeFolder !== 'trash') {
      const nextId = selectNextConversation(activeConvId);
      setConversations(prev => prev.filter(c => c.id !== activeConvId));
      setActiveConvId(nextId);
    } else if (isTrash && activeFolder === 'trash') {
      const nextId = selectNextConversation(activeConvId);
      setConversations(prev => prev.filter(c => c.id !== activeConvId));
      setActiveConvId(nextId);
    } else {
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, labels: newLabels } : c
      ));
    }
    
    // Background sync
    await updateConversation(activeConvId, { labels: newLabels });
  };

  const handleSpamConversation = async () => {
    if (!activeConvId) return;
    const currentConv = conversations.find(c => c.id === activeConvId);
    if (!currentConv) return;
    
    const currentLabels = currentConv.labels || [];
    const isSpam = currentLabels.includes('spam');
    
    const newLabels = isSpam 
      ? currentLabels.filter(l => l !== 'spam')
      : [...currentLabels, 'spam'];
      
    // Optimistic UI update
    if (!isSpam && activeFolder !== 'spam') {
      const nextId = selectNextConversation(activeConvId);
      setConversations(prev => prev.filter(c => c.id !== activeConvId));
      setActiveConvId(nextId);
    } else if (isSpam && activeFolder === 'spam') {
      const nextId = selectNextConversation(activeConvId);
      setConversations(prev => prev.filter(c => c.id !== activeConvId));
      setActiveConvId(nextId);
    } else {
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, labels: newLabels } : c
      ));
    }
      
    // Background sync
    await updateConversation(activeConvId, { labels: newLabels });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      
      {/* LEFT PANE: FOLDERS */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-white/5 backdrop-blur-sm shrink-0">
        <div className="p-4">
          <Button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]"
          >
            <Plus className="w-4 h-4 mr-2" /> Compose
          </Button>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {[
            { id: 'inbox', icon: <Inbox className="w-4 h-4" />, label: 'Inbox' },
            { id: 'starred', icon: <Star className="w-4 h-4" />, label: 'Starred' },
            { id: 'sent', icon: <Send className="w-4 h-4" />, label: 'Sent' },
            { id: 'drafts', icon: <File className="w-4 h-4" />, label: 'Drafts' },
            { id: 'archived', icon: <Archive className="w-4 h-4" />, label: 'Archived' },
            { id: 'spam', icon: <AlertCircle className="w-4 h-4" />, label: 'Spam' },
            { id: 'trash', icon: <Trash2 className="w-4 h-4" />, label: 'Trash' },
          ].map(folder => {
            const unreadInThisFolder = activeFolder === folder.id
              ? conversations.reduce((sum, c) => sum + (c.unreadCount > 0 ? 1 : 0), 0)
              : 0;
            return (
              <button
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id as FolderType); setActiveConvId(null); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activeFolder === folder.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 font-medium">
                  {folder.icon}
                  <span className="capitalize">{folder.label}</span>
                </div>
                {unreadInThisFolder > 0 && (
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-bold tabular-nums">
                    {unreadInThisFolder}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-6 pb-2 px-3">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Labels</h4>
            <div className="space-y-1">
              {['New Lead', 'Support', 'VIP'].map(label => (
                <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <Tag className="w-4 h-4 text-white/40" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* MIDDLE PANE: CONVERSATION LIST */}
      <div className="flex-1 flex flex-col min-w-[320px] border-r border-white/10 relative z-10">
        <div className="p-3 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0">
          {selectedIds.size > 0 ? (
            <div className="flex items-center gap-1 h-9">
              <Button variant="ghost" size="icon" onClick={clearSelection} className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10">
                <Square className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-white/70 px-1 tabular-nums">{selectedIds.size} selected</span>
              <div className="flex-1" />
              <Button variant="ghost" size="icon" onClick={handleBulkMarkRead} title="Mark as read" className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10">
                <MailOpen className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleBulkArchive} title="Archive" className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10">
                <Archive className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleBulkTrash} title="Delete" className="h-9 w-9 text-white/70 hover:text-red-400 hover:bg-white/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search mail..."
                  className="w-full pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePullEmails}
                disabled={pullingEmails}
                title="Pull latest emails"
                className="h-9 w-9 shrink-0 text-white/70 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 ${pullingEmails ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-4 space-y-5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-9 h-9 rounded-full bg-white/5 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3.5 w-1/3 bg-white/5" />
                    <Skeleton className="h-3.5 w-full bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/40 p-8 text-center">
              <Inbox className="w-12 h-12 mb-4 opacity-20" />
              <p>{searchQuery ? `No results for "${searchQuery}"` : `No conversations in ${activeFolder}`}</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredConversations.map(conv => {
                const isUnread = conv.unreadCount > 0;
                const senderLabel = conv.contactName || conv.contactEmail || 'Unknown';
                const isSelected = selectedIds.has(conv.id!);
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id!)}
                    className={`relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors group border-l-2 ${
                      activeConvId === conv.id
                        ? 'bg-primary/10 border-primary'
                        : isSelected
                        ? 'bg-primary/5 border-transparent'
                        : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelected(conv.id!); }}
                      className="mt-0.5 shrink-0 text-white/30 hover:text-white/70 transition-colors"
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : (
                        <>
                          <Square className="w-4 h-4 hidden group-hover:block" />
                          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold group-hover:hidden ${getAvatarColor(senderLabel)}`}>
                            {getInitials(senderLabel)}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className={`truncate ${isUnread ? 'font-semibold text-white' : 'font-medium text-white/60'}`}>
                          {senderLabel}
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-white/40 tabular-nums group-hover:hidden">
                            {formatListTimestamp(conv.lastMessageAt)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleStar(conv.id!, conv.isStarred); }}
                            className={`hidden group-hover:inline-flex ${conv.isStarred ? '!inline-flex' : ''}`}
                          >
                            <Star className={`w-3.5 h-3.5 ${conv.isStarred ? 'fill-amber-400 text-amber-400' : 'text-white/40 hover:text-white/70'}`} />
                          </button>
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        <span className={`text-sm truncate ${isUnread ? 'text-white/90 font-medium' : 'text-white/50'}`}>
                          {conv.subject || '(No Subject)'}
                        </span>
                        <span className="text-sm text-white/35 truncate">
                          — {conv.lastMessageSnippet || 'No content preview'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: THREAD & CONTACT CRM */}
      {activeConvId && activeContact ? (
        <div className="flex-[2] flex min-w-[500px]">
          {/* Thread View */}
          <div className="flex-[3] flex flex-col border-r border-white/10 relative">
            {/* Thread Header */}
            <div className="p-5 border-b border-white/10 bg-black/20 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
              <div className="min-w-0 pr-4">
                <h2 className="text-lg font-semibold text-white tracking-tight truncate">
                  {conversations.find(c => c.id === activeConvId)?.subject || '(No Subject)'}
                </h2>
                <p className="text-xs text-white/40 truncate mt-0.5">
                  {activeMessages.length} message{activeMessages.length !== 1 ? 's' : ''} with {activeContact.name || activeContact.email}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  onClick={handleToggleReadStatus}
                  variant="ghost" 
                  size="icon" 
                  className="text-white/50 hover:text-white"
                  title={conversations.find(c => c.id === activeConvId)?.unreadCount ? "Mark as Read" : "Mark as Unread"}
                >
                  {conversations.find(c => c.id === activeConvId)?.unreadCount ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={handleArchiveConversation}
                  variant="ghost" 
                  size="icon" 
                  className={`${conversations.find(c => c.id === activeConvId)?.isArchived ? 'text-primary' : 'text-white/50'} hover:text-white`}
                  title={conversations.find(c => c.id === activeConvId)?.isArchived ? "Unarchive" : "Archive"}
                >
                  <Archive className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSpamConversation}
                  variant="ghost" 
                  size="icon" 
                  className={`${conversations.find(c => c.id === activeConvId)?.labels?.includes('spam') ? 'text-orange-500' : 'text-white/50'} hover:text-white`}
                  title={conversations.find(c => c.id === activeConvId)?.labels?.includes('spam') ? "Not Spam" : "Mark as Spam"}
                >
                  <AlertCircle className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleTrashConversation}
                  variant="ghost" 
                  size="icon" 
                  className={`${conversations.find(c => c.id === activeConvId)?.labels?.includes('trash') ? 'text-red-500' : 'text-white/50'} hover:text-white`}
                  title={conversations.find(c => c.id === activeConvId)?.labels?.includes('trash') ? "Restore from Trash" : "Move to Trash"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/50 hover:text-white"><MoreVertical className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingThread ? (
                <div className="flex justify-center py-10"><Skeleton className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" /></div>
              ) : activeMessages.map(msg => {
                const isOutbound = msg.direction === 'outbound';
                const senderLabel = isOutbound ? 'You' : (activeContact.name || activeContact.email);
                return (
                  <div
                    key={msg.id}
                    className={`rounded-xl border overflow-hidden ${
                      isOutbound ? 'border-primary/20 bg-primary/[0.04]' : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 px-5 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isOutbound ? 'bg-primary/20 text-primary' : getAvatarColor(senderLabel)
                        }`}>
                          {getInitials(senderLabel)}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{senderLabel}</div>
                          <div className="text-xs text-white/40 truncate">
                            to {isOutbound ? activeContact.email : 'you'}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-white/40 shrink-0 tabular-nums">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>
                    <div className="px-5 py-4">
                      {msg.html ? (
                        <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.html }} />
                      ) : (
                        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/90">{msg.text}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
              <div className="bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 px-4 pt-3 text-xs font-medium text-white/40">
                  <Reply className="w-3.5 h-3.5" />
                  <span>Replying to {activeContact.name || activeContact.email}</span>
                </div>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full bg-transparent px-4 pt-2 pb-4 text-[15px] text-white resize-none outline-none min-h-[100px]"
                />
                <div className="flex justify-between items-center p-3 bg-white/5 border-t border-white/10">
                  <div className="flex gap-2">
                    <Button onClick={handleGenerateReplyDraft} disabled={draftingReply} variant="ghost" size="sm" className="h-8 text-primary hover:text-primary hover:bg-primary/10 gap-2 font-medium">
                      <Sparkles className="w-4 h-4" /> {draftingReply ? 'Drafting...' : 'AI Draft'}
                    </Button>
                    {replyText.trim() && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button disabled={modifyingDraft} variant="ghost" size="sm" className="h-8 text-primary/70 hover:text-primary hover:bg-primary/10 text-xs gap-1">
                            {modifyingDraft ? 'Modifying...' : 'Magic'} <Sparkles className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
                          <DropdownMenuItem onClick={() => handleModifyDraft('shorter')} className="hover:bg-white/10 cursor-pointer">Make Shorter</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModifyDraft('professional')} className="hover:bg-white/10 cursor-pointer">Make Professional</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModifyDraft('friendly')} className="hover:bg-white/10 cursor-pointer">Make Friendly</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                      <File className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendReply} disabled={sendingReply || !replyText.trim()} className="bg-primary text-primary-foreground h-8 px-6 font-bold shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.5)]">
                    <Send className="w-4 h-4 mr-2" /> Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CRM Sidebar */}
          <div className="flex-[2] flex flex-col bg-black/40 backdrop-blur-md overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                {(activeContact.name || activeContact.email).charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{activeContact.name || 'Unknown Contact'}</h3>
              <p className="text-white/50 text-sm mb-4">{activeContact.email}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  {activeContact.status}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/70 rounded-full text-xs font-bold uppercase tracking-wider">
                  Score: {activeContact.score}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {activeContact.company && (
                  <div className="flex items-center gap-3 text-white/70">
                    <Briefcase className="w-4 h-4 text-white/40" /> {activeContact.company}
                  </div>
                )}
                {activeContact.phone && (
                  <div className="flex items-center gap-3 text-white/70">
                    <MessageSquare className="w-4 h-4 text-white/40" /> {activeContact.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 flex-1">
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Recent Activity</h4>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {activeActivity.length === 0 ? (
                  <p className="text-sm text-white/40 italic">No recent activity.</p>
                ) : activeActivity.map((event, i) => (
                  <div key={event.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border border-primary bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-white/5 border border-white/10 shadow hover:bg-white/10 transition-colors">
                      <time className="font-mono text-xs font-medium text-white/40 mb-1 block">
                        {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Unknown'}
                      </time>
                      <div className="text-sm font-medium text-white/90">{event.title}</div>
                      {event.description && <div className="text-xs text-white/60 mt-1">{event.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-[2] flex flex-col items-center justify-center bg-black/20 text-white/30 p-8 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white/50 mb-2">Select a Conversation</h2>
          <p className="max-w-md">Choose an email thread from the left to view messages and contact details.</p>
        </div>
      )}

      {/* COMPOSE MODAL */}
      {isComposeOpen && (
        <div className="absolute bottom-0 right-24 w-[500px] h-[500px] bg-zinc-900 border border-white/10 rounded-t-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 bg-black/40 border-b border-white/10">
            <h3 className="font-bold text-sm text-white">New Message</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/50 hover:text-white" onClick={() => setIsComposeOpen(false)}>
              &times;
            </Button>
          </div>
          <div className="flex flex-col flex-1 bg-background">
            <div className="px-4 py-2 border-b border-white/10 flex items-center">
              <span className="text-white/50 text-sm w-12">To:</span>
              <input 
                type="text" 
                value={composeTo}
                onChange={e => setComposeTo(e.target.value)}
                className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm"
              />
            </div>
            <div className="px-4 py-2 border-b border-white/10 flex items-center">
              <span className="text-white/50 text-sm w-12">Subject:</span>
              <input 
                type="text" 
                value={composeSubject}
                onChange={e => setComposeSubject(e.target.value)}
                className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm font-semibold"
              />
            </div>
            <textarea
              value={composeBody}
              onChange={e => setComposeBody(e.target.value)}
              className="flex-1 w-full bg-transparent p-4 text-sm text-white resize-none outline-none"
            />
            <div className="p-3 bg-white/5 border-t border-white/10 flex justify-between items-center">
              <Button onClick={handleGenerateComposeDraft} disabled={draftingCompose} variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-2">
                <Sparkles className="w-4 h-4" /> {draftingCompose ? 'Drafting...' : 'AI Draft'}
              </Button>
              <Button onClick={handleSendCompose} disabled={sendingCompose || !composeTo || !composeSubject || !composeBody} className="bg-primary text-primary-foreground font-bold shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.5)]">
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
