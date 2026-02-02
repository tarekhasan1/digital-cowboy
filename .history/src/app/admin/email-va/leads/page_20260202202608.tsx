'use client';

import { useState, useEffect, useRef } from 'react';
import { getLeads, addLead, deleteLead, updateLead, importLeads } from '../../../../../actions/email-va/leads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Upload, 
  UserPlus, 
  Trash2, 
  Search,
  Download,
  Edit
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  tags: string[];
  status: string;
  createdAt: any;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const result = await getLeads({ limit: 100 });
      if (result.success && result.leads) {
        // 🔥 FIX: Add type assertion and fallback
        setLeads(result.leads as Lead[]);
      } else {
        setLeads([]);
        if (!result.success) {
          console.error('Failed to load leads:', result.error);
        }
      }
    } catch (error) {
      console.error('Error loading leads:', error);
      setLeads([]);
    }
    setLoading(false);
  };

  const filteredLeads = leads.filter(lead =>
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    const result = await deleteLead(leadId);
    if (result.success) {
      setLeads(leads.filter(l => l.id !== leadId));
    } else {
      alert((result as any).error || 'Failed to delete lead');
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowEditLead(true);
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
            <h1 className="text-3xl font-bold">Lead Management</h1>
            <p className="text-gray-600 mt-1">{leads.length} total leads</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddLead(true)} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
            <Button onClick={() => setShowImport(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search leads by email, name, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Import Modal */}
        {showImport && (
          <ImportLeadsModal 
            onClose={() => setShowImport(false)}
            onSuccess={loadLeads}
          />
        )}

        {/* Add Lead Modal */}
        {showAddLead && (
          <AddLeadModal
            onClose={() => setShowAddLead(false)}
            onSuccess={loadLeads}
          />
        )}

        {/* Edit Lead Modal */}
        {showEditLead && editingLead && (
          <EditLeadModal
            lead={editingLead}
            onClose={() => {
              setShowEditLead(false);
              setEditingLead(null);
            }}
            onSuccess={loadLeads}
          />
        )}

        {/* Leads Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Email</th>
                  <th className="text-left p-4 font-medium text-gray-700">Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Company</th>
                  <th className="text-left p-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left p-4 font-medium text-gray-700">Tags</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-right p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      Loading leads...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{lead.email}</td>
                      <td className="p-4">{lead.name || '-'}</td>
                      <td className="p-4">{lead.company || '-'}</td>
                      <td className="p-4">{lead.phone || '-'}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {(lead.tags || []).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          lead.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(lead)}
                            title="Edit lead"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
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
    </div>
  );
}

function ImportLeadsModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [csvContent, setCsvContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is CSV
    if (!file.name.endsWith('.csv') && !file.type.includes('text')) {
      alert('Please select a valid CSV file');
      return;
    }

    try {
      const text = await file.text();
      setCsvContent(text);
    } catch (error) {
      alert('Failed to read file');
      console.error('File read error:', error);
    }
  };

  const handleImport = async () => {
    if (!csvContent) {
      alert('Please select or paste CSV content');
      return;
    }

    setLoading(true);
    const importResult = await importLeads({
      csvContent,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      source: 'csv_import',
    });

    setLoading(false);
    setResult(importResult);

    if (importResult.success) {
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Import Leads from CSV</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mb-3"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose CSV File
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              {csvContent ? (
                <span className="text-green-600 font-medium">
                  ✓ CSV file loaded ({csvContent.split('\n').length - 1} rows)
                </span>
              ) : (
                <>or drag and drop</>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              CSV format: Any columns with email, name, company, phone (auto-detected)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              CSV Preview / Manual Entry
            </label>
            <Textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="Email,Full Name,Company Name,Phone Number&#10;john@example.com,John Doe,Acme Inc,+1234567890&#10;jane@example.com,Jane Smith,Tech Corp,+0987654321"
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="client, prospect, newsletter"
            />
          </div>

          {result && (
            <div className={`p-4 rounded ${
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {result.success ? (
                <div>
                  <p className="font-medium">Import successful!</p>
                  <p className="text-sm mt-1">Imported: {result.imported}, Skipped: {result.skipped}</p>
                  
                  {result.detectedColumns && (
                    <div className="text-xs mt-3 pt-3 border-t border-green-200">
                      <p className="font-medium mb-1">Detected columns:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Email: {result.detectedColumns.email}</li>
                        {result.detectedColumns.name && <li>Name: {result.detectedColumns.name}</li>}
                        {result.detectedColumns.company && <li>Company: {result.detectedColumns.company}</li>}
                        {result.detectedColumns.phone && <li>Phone: {result.detectedColumns.phone}</li>}
                      </ul>
                    </div>
                  )}
                  
                  {result.errors?.length > 0 && (
                    <div className="text-xs mt-2 max-h-32 overflow-y-auto">
                      <p className="font-medium mb-1">Errors:</p>
                      {result.errors.map((err: string, i: number) => (
                        <p key={i}>{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p>{result.error}</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleImport} disabled={loading} className="flex-1">
              {loading ? 'Importing...' : 'Import Leads'}
            </Button>
            <Button onClick={onClose} variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AddLeadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email) {
      alert('Email is required');
      return;
    }

    setLoading(true);
    const result = await addLead({
      email,
      name,
      company,
      phone,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });

    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert((result as any).error || 'Failed to add lead');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Add Lead</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="client, prospect"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAdd} disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Lead'}
            </Button>
            <Button onClick={onClose} variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function EditLeadModal({ lead, onClose, onSuccess }: { lead: Lead; onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState(lead.email);
  const [name, setName] = useState(lead.name || '');
  const [company, setCompany] = useState(lead.company || '');
  const [phone, setPhone] = useState(lead.phone || '');
  const [tags, setTags] = useState(lead.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!email) {
      alert('Email is required');
      return;
    }

    setLoading(true);
    const result = await updateLead(lead.id, {
      email,
      name,
      company,
      phone,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date(),
    });

    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert((result as any).error || 'Failed to update lead');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Edit Lead</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="client, prospect"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleUpdate} disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Lead'}
            </Button>
            <Button onClick={onClose} variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}