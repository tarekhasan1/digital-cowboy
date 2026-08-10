'use client';

import { useState, useEffect } from 'react';
import { 
  Inbox, Star, Send, File, Archive, Trash2, 
  Search, CheckSquare, Square, MoreVertical, 
  Tag, Clock, AlertCircle, MessageSquare, Briefcase, Plus,
  Reply, Sparkles
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

type FolderType = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archived' | 'trash' | 'spam';

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

  useEffect(() => {
    loadConversations();
  }, [activeFolder]);

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
    }
    setLoadingThread(false);
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
    }
    
    setReplyText('');
    setSendingReply(false);
    loadThread(activeConvId); // reload thread
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

  const handleArchiveConversation = async () => {
    if (!activeConvId) return;
    const currentConv = conversations.find(c => c.id === activeConvId);
    if (!currentConv) return;
    
    // Toggle archive state
    const newArchivedState = !currentConv.isArchived;
    await updateConversation(activeConvId, { isArchived: newArchivedState });
    
    // Update local state immediately
    setConversations(conversations.map(c => 
      c.id === activeConvId ? { ...c, isArchived: newArchivedState } : c
    ));
    
    if (newArchivedState && activeFolder !== 'archived') {
      setActiveConvId(null);
      loadConversations();
    }
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
      
    await updateConversation(activeConvId, { labels: newLabels });
    
    // Update local state
    setConversations(conversations.map(c => 
      c.id === activeConvId ? { ...c, labels: newLabels } : c
    ));
    
    if (!isTrash && activeFolder !== 'trash') {
      setActiveConvId(null);
      loadConversations();
    }
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
      
    await updateConversation(activeConvId, { labels: newLabels });
    
    setConversations(conversations.map(c => 
      c.id === activeConvId ? { ...c, labels: newLabels } : c
    ));
    
    if (!isSpam && activeFolder !== 'spam') {
      setActiveConvId(null);
      loadConversations();
    }
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
            { id: 'inbox', icon: <Inbox className="w-4 h-4" />, label: 'Inbox', badge: 3 },
            { id: 'starred', icon: <Star className="w-4 h-4" />, label: 'Starred' },
            { id: 'sent', icon: <Send className="w-4 h-4" />, label: 'Sent' },
            { id: 'drafts', icon: <File className="w-4 h-4" />, label: 'Drafts' },
            { id: 'archived', icon: <Archive className="w-4 h-4" />, label: 'Archived' },
            { id: 'spam', icon: <AlertCircle className="w-4 h-4" />, label: 'Spam' },
            { id: 'trash', icon: <Trash2 className="w-4 h-4" />, label: 'Trash' },
          ].map(folder => (
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
              {folder.badge && (
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {folder.badge}
                </span>
              )}
            </button>
          ))}
          
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
      <div className="flex-1 flex flex-col min-w-[300px] border-r border-white/10 relative z-10">
        <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search emails..." 
              className="w-full pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-4 space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3 bg-white/5" />
                    <Skeleton className="h-4 w-full bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/40 p-8 text-center">
              <Inbox className="w-12 h-12 mb-4 opacity-20" />
              <p>No conversations found in {activeFolder}</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {conversations.map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id!)}
                  className={`p-4 cursor-pointer transition-colors group ${
                    activeConvId === conv.id 
                      ? 'bg-primary/10 border-l-2 border-primary' 
                      : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-semibold ${conv.unreadCount > 0 ? 'text-white' : 'text-white/70'}`}>
                      {conv.subject || '(No Subject)'}
                    </span>
                    <span className="text-xs text-white/40 whitespace-nowrap ml-2">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className={`text-sm line-clamp-2 ${conv.unreadCount > 0 ? 'text-white/90 font-medium' : 'text-white/50'}`}>
                    {conv.lastMessageSnippet || 'No content preview'}
                  </p>
                </div>
              ))}
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
              <h2 className="text-xl font-bold text-white truncate pr-4">
                {conversations.find(c => c.id === activeConvId)?.subject}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingThread ? (
                <div className="flex justify-center py-10"><Skeleton className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" /></div>
              ) : activeMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.direction === 'outbound' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-5 ${
                    msg.direction === 'outbound' 
                      ? 'bg-primary/20 text-white border border-primary/30' 
                      : 'bg-white/5 text-white/90 border border-white/10'
                  }`}>
                    <div className="flex justify-between items-center mb-3 text-xs opacity-70">
                      <span className="font-semibold">{msg.direction === 'outbound' ? 'You' : activeContact.name || activeContact.email}</span>
                      <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</span>
                    </div>
                    {msg.html ? (
                      <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.html }} />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
              <div className="bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                <textarea 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Draft a reply..."
                  className="w-full bg-transparent p-4 text-sm text-white resize-none outline-none min-h-[100px]"
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
