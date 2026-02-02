// actions/email-va/leads.ts
'use server';

import { collections } from '../../lib/email-va/firebase';

interface ImportLeadsParams {
  csvContent: string;
  tags: string[];
  source: string;
}

interface Lead {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  [key: string]: any;
}

/**
 * Import leads from CSV
 */
export async function importLeads(params: ImportLeadsParams) {
  try {
    // Parse CSV
    const lines = params.csvContent.trim().split('\n');
    if (lines.length < 2) {
      return { success: false, error: 'CSV must have headers and at least one row', imported: 0, skipped: 0 };
    }

    // Get headers
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const emailIndex = headers.findIndex(h => h === 'email');

    if (emailIndex === -1) {
      return { success: false, error: 'CSV must have an "email" column', imported: 0, skipped: 0 };
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const email = values[emailIndex]?.toLowerCase();

      if (!email || !isValidEmail(email)) {
        skipped++;
        errors.push(`Row ${i + 1}: Invalid email`);
        continue;
      }

      // Check for duplicates
      const existingLead = await collections.leads
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!existingLead.empty) {
        skipped++;
        continue;
      }

      // Create lead object - avoid undefined values
      const leadData: Record<string, any> = {
        email,
        tags: params.tags || [],
        source: params.source || 'csv_import',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Map other fields - only add if value exists
      headers.forEach((header, index) => {
        if (header !== 'email' && values[index]) {
          if (header === 'name') {
            leadData.name = values[index];
          } else if (header === 'company') {
            leadData.company = values[index];
          } else if (header === 'phone') {
            leadData.phone = values[index];
          } else {
            if (!leadData.customFields) leadData.customFields = {};
            leadData.customFields[header] = values[index];
          }
        }
      });

      await collections.leads.add(leadData);
      imported++;
    }

    return {
      success: true,
      imported,
      skipped,
      errors: errors.slice(0, 10),
    };
  } catch (error: any) {
    console.error('Import leads error:', error);
    return { success: false, error: error.message, imported: 0, skipped: 0 };
  }
}

/**
 * Get all leads
 */
export async function getLeads(filters?: {
  tags?: string[];
  status?: string;
  limit?: number;
}) {
  try {
    let query: any = collections.leads.orderBy('createdAt', 'desc');

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.where('tags', 'array-contains-any', filters.tags);
    }

    const snapshot = await query.limit(filters?.limit || 100).get();

    // 🔥 FIX: Properly serialize Firestore data
    const leads = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        email: data.email || '',
        phone: data.phone || undefined,
        name: data.name || undefined,
        company: data.company || undefined,
        tags: data.tags || [],
        status: data.status || 'active',
        source: data.source || undefined,
        customFields: data.customFields || undefined,
        // 🔥 FIX: Convert Firestore Timestamps to ISO strings
        createdAt: data.createdAt?.toDate?.() 
          ? data.createdAt.toDate().toISOString() 
          : (data.createdAt instanceof Date 
              ? data.createdAt.toISOString() 
              : new Date().toISOString()),
        updatedAt: data.updatedAt?.toDate?.() 
          ? data.updatedAt.toDate().toISOString() 
          : (data.updatedAt instanceof Date 
              ? data.updatedAt.toISOString() 
              : undefined),
      };
    });

    console.log(`📋 Fetched ${leads.length} leads`);

    return { success: true, leads };
  } catch (error: any) {
    console.error('Get leads error:', error);
    // 🔥 FIX: Always return leads array even on error
    return { success: false, error: error.message, leads: [] };
  }
}

/**
 * Add single lead manually
 */
export async function addLead(params: {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  tags?: string[];
}) {
  try {
    if (!isValidEmail(params.email)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Check for duplicates
    const existingLead = await collections.leads
      .where('email', '==', params.email.toLowerCase())
      .limit(1)
      .get();

    if (!existingLead.empty) {
      return { success: false, error: 'Lead already exists' };
    }

    // 🔥 FIX: Build object without undefined values (Firestore doesn't allow undefined)
    const leadData: Record<string, any> = {
      email: params.email.toLowerCase(),
      tags: params.tags || [],
      source: 'manual',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only add optional fields if they have values
    if (params.name) {
      leadData.name = params.name;
    }
    if (params.company) {
    if (params.phone) {
      leadData.phone = params.phone;
    }
      leadData.company = params.company;
    }

    const leadRef = await collections.leads.add(leadData);

    return {
      success: true,
      leadId: leadRef.id,
    };
  } catch (error: any) {
    console.error('Add lead error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update lead
 */
export async function updateLead(
  leadId: string,
  updates: Partial<Lead>
) {
  try {
    // 🔥 FIX: Remove undefined values before updating
    const cleanUpdates: Record<string, any> = {
      updatedAt: new Date(),
    };

    // Only add defined values
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });

    await collections.leads.doc(leadId).update(cleanUpdates);

    return { success: true };
  } catch (error: any) {
    console.error('Update lead error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete lead
 */
export async function deleteLead(leadId: string) {
  try {
    await collections.leads.doc(leadId).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Delete lead error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get lead by ID
 */
export async function getLeadById(leadId: string) {
  try {
    const doc = await collections.leads.doc(leadId).get();
    
    if (!doc.exists) {
      return { success: false, error: 'Lead not found' };
    }

    const data = doc.data()!;
    
    const lead = {
      id: doc.id,
      email: data.email || '',
      name: data.name || undefined,
      company: data.company || undefined,
      tags: data.tags || [],
      status: data.status || 'active',
      source: data.source || undefined,
      customFields: data.customFields || undefined,
      createdAt: data.createdAt?.toDate?.() 
        ? data.createdAt.toDate().toISOString() 
        : (data.createdAt instanceof Date 
            ? data.createdAt.toISOString() 
            : new Date().toISOString()),
      updatedAt: data.updatedAt?.toDate?.() 
        ? data.updatedAt.toDate().toISOString() 
        : undefined,
    };

    return { success: true, lead };
  } catch (error: any) {
    console.error('Get lead by ID error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk delete leads
 */
export async function bulkDeleteLeads(leadIds: string[]) {
  try {
    let deleted = 0;
    const errors: string[] = [];

    for (const leadId of leadIds) {
      try {
        await collections.leads.doc(leadId).delete();
        deleted++;
      } catch (err: any) {
        errors.push(`${leadId}: ${err.message}`);
      }
    }

    return { 
      success: true, 
      deleted, 
      failed: leadIds.length - deleted,
      errors: errors.slice(0, 5),
    };
  } catch (error: any) {
    console.error('Bulk delete leads error:', error);
    return { success: false, error: error.message, deleted: 0, failed: leadIds.length };
  }
}

/**
 * Helper: Validate email
 */
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}