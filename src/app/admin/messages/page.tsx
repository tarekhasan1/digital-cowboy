'use client';

import { useState, useEffect } from 'react';
import { getContactMessages, updateMessageStatus, ContactMessage } from '../../../../actions/messages';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, CheckCircle, Clock, Search, Archive } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await getContactMessages();
    if (res.success && res.messages) {
      setMessages(res.messages as ContactMessage[]);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: ContactMessage['status']) => {
    const res = await updateMessageStatus(id, status);
    if (res.success) {
      setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 h-[calc(100vh-80px)]">
      {/* Left panel - List */}
      <Card className="w-1/3 flex flex-col bg-white/5 border-white/10 overflow-hidden text-white h-full">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Contact Enquiries
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-white/10 rounded-xl" />
            ))
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <p>No messages found.</p>
            </div>
          ) : (
            messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedMessage?.id === msg.id 
                    ? 'bg-primary/20 border-primary border-opacity-50' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate pr-2">{msg.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                    msg.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                    msg.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {msg.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-white/60 truncate mb-1">{msg.email}</p>
                <p className="text-xs text-white/40">{new Date(msg.createdAt!).toLocaleDateString()}</p>
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Right panel - Details */}
      <Card className="flex-1 bg-white/5 border-white/10 text-white h-full overflow-y-auto">
        {selectedMessage ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedMessage.name}</h2>
                <div className="flex items-center gap-4 text-white/60">
                  <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary transition-colors">
                    {selectedMessage.email}
                  </a>
                  {selectedMessage.phone && (
                    <>
                      <span>•</span>
                      <a href={`tel:${selectedMessage.phone}`} className="hover:text-primary transition-colors">
                        {selectedMessage.phone}
                      </a>
                    </>
                  )}
                  {selectedMessage.company && (
                    <>
                      <span>•</span>
                      <span>{selectedMessage.company}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {selectedMessage.status === 'new' && (
                  <Button onClick={() => handleUpdateStatus(selectedMessage.id!, 'read')} variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                    Mark as Read
                  </Button>
                )}
                {selectedMessage.status !== 'replied' && (
                  <Button onClick={() => handleUpdateStatus(selectedMessage.id!, 'replied')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Replied
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <span className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1 block">Service Required</span>
                <p className="font-medium capitalize">{selectedMessage.service}</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <span className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1 block">Budget</span>
                <p className="font-medium capitalize">{selectedMessage.budget.replace('_', ' ')}</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <span className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1 block">Timeline</span>
                <p className="font-medium capitalize">{selectedMessage.timeline}</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <span className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1 block">Received On</span>
                <p className="font-medium">{new Date(selectedMessage.createdAt!).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Project Description</h3>
              <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.description}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <a href={`mailto:${selectedMessage.email}?subject=Re: Enquiry for ${selectedMessage.service}`}>
                <Button>Reply via Email Client</Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/40">
            <Mail className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a message to read</p>
          </div>
        )}
      </Card>
    </div>
  );
}
