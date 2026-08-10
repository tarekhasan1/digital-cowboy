'use client';

import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Filter, MoreHorizontal, 
  Mail, Phone, ExternalLink, ArrowUpDown, Download, 
  Upload, Tag, Briefcase, ChevronRight, LayoutKanban, 
  List, Plus, Building2, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getContacts, Contact } from '@/actions/crm/contacts';
import { getLeads, updateLead, Lead } from '@/actions/crm/leads';

type TabView = 'pipeline' | 'contacts';
const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<TabView>('pipeline');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Drag state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [contactRes, leadRes] = await Promise.all([
      getContacts(),
      getLeads()
    ]);
    
    if (contactRes.success) setContacts(contactRes.contacts as Contact[]);
    if (leadRes.success) setLeads(leadRes.leads as Lead[]);
    setLoading(false);
  };

  const filteredContacts = contacts.filter(c => 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Kanban Native Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Lead['status']) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    // Optimistically update UI
    setLeads(prev => prev.map(l => l.id === draggedLeadId ? { ...l, status: newStatus } : l));
    
    // Update DB
    await updateLead(draggedLeadId, { status: newStatus });
    setDraggedLeadId(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background text-white p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            CRM & Pipeline
          </h1>
          <p className="text-white/50">Manage your active leads and contact database.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black/40 border border-white/10 p-1 rounded-lg flex mr-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('pipeline')}
              className={activeTab === 'pipeline' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}
            >
              <LayoutKanban className="w-4 h-4 mr-2" /> Pipeline
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('contacts')}
              className={activeTab === 'contacts' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}
            >
              <List className="w-4 h-4 mr-2" /> All Contacts
            </Button>
          </div>
          
          {activeTab === 'contacts' ? (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]">
              <UserPlus className="w-4 h-4 mr-2" /> Add Contact
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]">
              <Plus className="w-4 h-4 mr-2" /> Add Lead
            </Button>
          )}
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        /* PIPELINE VIEW */
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {loading ? (
            <div className="flex gap-4 w-full h-full">
              {[1,2,3,4].map(i => <Skeleton key={i} className="min-w-[300px] h-[500px] bg-white/5 rounded-xl" />)}
            </div>
          ) : (
            STAGES.map(stage => (
              <div 
                key={stage} 
                className="flex-shrink-0 w-[300px] flex flex-col bg-white/5 rounded-xl border border-white/10"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage as Lead['status'])}
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-xl">
                  <h3 className="font-bold text-white/90">{stage}</h3>
                  <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-mono">
                    {leads.filter(l => l.status === stage).length}
                  </span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {leads.filter(l => l.status === stage).map(lead => {
                    const contact = contacts.find(c => c.id === lead.contactId);
                    return (
                      <div 
                        key={lead.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id!)}
                        className={`p-4 bg-black/40 rounded-lg border border-white/10 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-lg ${draggedLeadId === lead.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white truncate pr-2">{contact?.name || contact?.email}</h4>
                          <span className="text-green-400 font-mono text-xs whitespace-nowrap">
                            ${lead.value?.toLocaleString() || '---'}
                          </span>
                        </div>
                        {contact?.company && (
                          <div className="text-white/50 text-xs mb-3 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {contact.company}
                          </div>
                        )}
                        <div className="flex justify-between items-end">
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-bold uppercase tracking-wider">
                              {lead.serviceInterest || 'General'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                            <Flame className="w-3 h-3" /> {lead.aiScore}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {leads.filter(l => l.status === stage).length === 0 && (
                    <div className="h-24 flex items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-lg text-sm">
                      Drop lead here
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* CONTACTS LIST VIEW */
        <div className="flex flex-col flex-1">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Contacts', value: contacts.length, trend: '+12%', color: 'text-white' },
              { label: 'Active Leads', value: leads.length, trend: '+5%', color: 'text-primary' },
              { label: 'Customers', value: contacts.filter(c => c.status === 'customer').length, trend: '+2%', color: 'text-green-400' },
              { label: 'New This Month', value: '24', trend: '+1.2%', color: 'text-orange-400' },
            ].map((kpi, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-white/50 text-sm font-medium mb-2">{kpi.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className={`text-3xl font-bold ${kpi.color}`}>{loading ? <Skeleton className="h-9 w-16 bg-white/10" /> : kpi.value}</h3>
                    <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-md">{kpi.trend}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input 
                placeholder="Search by name, email, or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50"
              />
            </div>
          </div>

          {/* Contacts Table */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white/50 uppercase bg-black/20 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium flex items-center gap-2 cursor-pointer hover:text-white">Contact <ArrowUpDown className="w-3 h-3" /></th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Tags</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <tr key={i}>
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton className="w-10 h-10 rounded-full bg-white/5" /><div className="space-y-2"><Skeleton className="h-4 w-32 bg-white/5" /><Skeleton className="h-3 w-24 bg-white/5" /></div></div></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full bg-white/5" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-12 bg-white/5" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-white/5" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded-md bg-white/5 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No contacts found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map(contact => (
                      <tr key={contact.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                              {(contact.name || contact.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-white group-hover:text-primary transition-colors">{contact.name || 'Unknown'}</div>
                              <div className="text-white/50 text-xs">{contact.email}</div>
                              {contact.company && <div className="text-white/40 text-[10px] mt-0.5 flex items-center gap-1"><Briefcase className="w-3 h-3" /> {contact.company}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70">
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, contact.score || 0))}%` }}></div>
                            </div>
                            <span className="text-white/70 font-mono text-xs">{contact.score || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {contact.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/60">
                                {tag}
                              </span>
                            ))}
                            {(contact.tags?.length || 0) > 2 && (
                              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/40">
                                +{(contact.tags?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-primary hover:text-primary hover:bg-primary/10">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
