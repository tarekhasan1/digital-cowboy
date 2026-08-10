'use server';

import { collections } from '@/lib/email-va/firebase';

export interface Enquiry {
  id?: string;
  contactId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
  source: string;
  status: 'New' | 'Reviewing' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed' | 'Spam';
  createdAt?: string | Date;
}

export async function createEnquiry(params: Partial<Enquiry> & { contactId: string, email: string, name: string, service: string, message: string }) {
  try {
    const data: any = {
      ...params,
      status: params.status || 'New',
      source: params.source || 'Website',
      createdAt: new Date(),
    };
    
    // Remove undefined
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    
    const ref = await collections.enquiries.add(data);
    return { success: true, enquiryId: ref.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
