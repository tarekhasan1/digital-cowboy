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
 * Parse CSV line properly handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Comma outside quotes - field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  return result;
}

/**
 * Intelligently detect column index by matching against common variations
 */
function findColumnIndex(headers: string[], keywords: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    for (const keyword of keywords) {
      // Check for exact match or contains keyword
      if (header === keyword || header.includes(keyword)) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Import leads from CSV with intelligent column detection
 */
export async function importLeads(params: ImportLeadsParams) {
  try {
    // Parse CSV - handle different line endings
    const lines = params.csvContent
      .trim()
      .split(/\r?\n/)
      .filter(line => line.trim());
    
    if (lines.length < 2) {
      return { success: false, error: 'CSV must have headers and at least one row', imported: 0, skipped: 0 };
    }

    // Parse header row with proper CSV parsing
    const rawHeaders = parseCSVLine(lines[0]);
    const headers = rawHeaders.map(h => h.toLowerCase());

    // Intelligent column detection
    const emailIndex = findColumnIndex(headers, ['email', 'email address', 'e-mail', 'mail']);
    const nameIndex = findColumnIndex(headers, ['name', 'full name', 'first name', 'contact name']);
    const companyIndex = findColumnIndex(headers, ['company', 'company name', 'organization', 'business']);
    const phoneIndex = findColumnIndex(headers, ['phone', 'phone number', 'telephone', 'mobile', 'cell', 'contact phone']);

    if (emailIndex === -1) {
      return { 
        success: false, 
        error: `Email column not found. Available columns: ${rawHeaders.join(', ')}`, 
        imported: 0, 
        skipped: 0 
      };
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      // Parse row with proper CSV parsing
      const values = parseCSVLine(line);
      const email = values[emailIndex]?.toLowerCase().trim();

      if (!email || !isValidEmail(email)) {
        skipped++;
        errors.push(`Row ${i + 1}: Invalid or missing email`);
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

      // Create lead object
      const leadData: Record<string, any> = {
        email,
        tags: params.tags || [],
        source: params.source || 'csv_import',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Map detected fields with exact values
      if (nameIndex !== -1 && values[nameIndex]?.trim()) {
        leadData.name = values[nameIndex].trim();
      }
      if (companyIndex !== -1 && values[companyIndex]?.trim()) {
        leadData.company = values[companyIndex].trim();
      }
      if (phoneIndex !== -1 && values[phoneIndex]?.trim()) {
        leadData.phone = values[phoneIndex].trim();
      }

      // Add other fields as custom fields (only if not already mapped)
      for (let j = 0; j < headers.length; j++) {
        const value = values[j]?.trim();
        if (j !== emailIndex && j !== nameIndex && j !== companyIndex && j !== phoneIndex && value) {
          if (!leadData.customFields) leadData.customFields = {};
          leadData.customFields[rawHeaders[j]] = value;
        }
      }

      await collections.leads.add(leadData);
      imported++;
    }

    return {
      success: true,
      imported,
      skipped,
      errors: errors.slice(0, 10),
      detectedColumns: {
        email: rawHeaders[emailIndex],
        name: nameIndex !== -1 ? rawHeaders[nameIndex] : null,
        company: companyIndex !== -1 ? rawHeaders[companyIndex] : null,
        phone: phoneIndex !== -1 ? rawHeaders[phoneIndex] : null,
      },
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