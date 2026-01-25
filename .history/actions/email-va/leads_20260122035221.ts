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
      return { success: false, error: 'CSV must have headers and at least one row' };
    }

    // Get headers
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const emailIndex = headers.findIndex(h => h === 'email');

    if (emailIndex === -1) {
      return { success: false, error: 'CSV must have an "email" column' };
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

      // Create lead object
      const leadData: any = {
        email,
        tags: params.tags,
        source: params.source,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Map other fields
      headers.forEach((header, index) => {
        if (header !== 'email' && values[index]) {
          if (header === 'name') leadData.name = values[index];
          else if (header === 'company') leadData.company = values[index];
          else {
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
      errors: errors.slice(0, 10), // Return first 10 errors
    };
  } catch (error: any) {
    console.error('Import leads error:', error);
    return { success: false, error: error.message };
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
    let query = collections.leads.orderBy('createdAt', 'desc');

    if (filters?.status) {
      query = query.where('status', '==', filters.status) as any;
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.where('tags', 'array-contains-any', filters.tags) as any;
    }

    const snapshot = await query.limit(filters?.limit || 100).get();

    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, leads };
  } catch (error: any) {
    console.error('Get leads error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add single lead manually
 */
export async function addLead(params: {
  email: string;
  name?: string;
  company?: string;
  tags: string[];
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

    const leadRef = await collections.leads.add({
      email: params.email.toLowerCase(),
      name: params.name,
      company: params.company,
      tags: params.tags,
      source: 'manual',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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
    await collections.leads.doc(leadId).update({
      ...updates,
      updatedAt: new Date(),
    });

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
 * Helper: Validate email
 */
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}