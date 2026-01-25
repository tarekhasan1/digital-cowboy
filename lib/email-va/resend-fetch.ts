// lib/email-va/resend-fetch.ts
import { Resend } from 'resend';

interface ResendReceivingResponse<T> {
  data?: T;
  error?: any;
}

interface ListReceivingEmailsResponse {
  data?: any[];
}

export class ResendReceivingService {
  private client: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    this.client = new Resend(apiKey);
  }

  /**
   * List all received emails
   */
  async listReceivedEmails(): Promise<{
    success: boolean;
    emails?: any[];
    error?: string;
  }> {
    try {
      // @ts-ignore
      const response: ResendReceivingResponse<ListReceivingEmailsResponse> = 
        await this.client.emails.receiving.list();

      if (response.error) {
        console.error('Resend receiving.list error:', response.error);
        return { 
          success: false, 
          error: (response.error as any)?.message || String(response.error) 
        };
      }

      // Extract the emails array from the nested structure
      const emails = response.data?.data || [];
      
      console.log('✅ Received emails from Resend:', emails.length);
      
      return { 
        success: true, 
        emails 
      };
    } catch (error: any) {
      console.error('List received emails error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a specific received email by ID
   */
  async getReceivedEmail(emailId: string): Promise<{
    success: boolean;
    email?: any;
    error?: string;
  }> {
    try {
      // @ts-ignore
      const response: ResendReceivingResponse<any> = await this.client.emails.receiving.get(emailId);

      if (response.error) {
        console.error('Resend receiving.get error:', response.error);
        return { 
          success: false, 
          error: (response.error as any)?.message || String(response.error) 
        };
      }

      // 🔥 FIX: Handle potential nested data structure
      // The response might be { data: { data: {...} } } or { data: {...} }
      let email = response.data;
      
      // Check if there's a nested data property
      if (email && typeof email === 'object' && 'data' in email && !('text' in email) && !('html' in email)) {
        email = email.data;
      }

      console.log('📧 Fetched email details:', {
        id: email?.id,
        hasText: !!email?.text,
        hasHtml: !!email?.html,
        textLength: email?.text?.length || 0,
        htmlLength: email?.html?.length || 0,
      });

      return { 
        success: true, 
        email 
      };
    } catch (error: any) {
      console.error('Get received email error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List attachments for a received email
   */
  async listAttachments(emailId: string): Promise<{
    success: boolean;
    attachments?: any[];
    error?: string;
  }> {
    try {
      // @ts-ignore
      const response: ResendReceivingResponse<any[]> = await this.client.attachments.receiving.list({
        emailId,
      });

      if (response.error) {
        console.error('Resend attachments.list error:', response.error);
        return { 
          success: false, 
          error: (response.error as any)?.message || String(response.error) 
        };
      }

      return { 
        success: true, 
        attachments: response.data || [] 
      };
    } catch (error: any) {
      console.error('List attachments error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a specific attachment
   */
  async getAttachment(attachmentId: string, emailId: string): Promise<{
    success: boolean;
    attachment?: any;
    error?: string;
  }> {
    try {
      // @ts-ignore
      const response: ResendReceivingResponse<any> = await this.client.attachments.receiving.get({
        id: attachmentId,
        emailId,
      });

      if (response.error) {
        console.error('Resend attachments.get error:', response.error);
        return { 
          success: false, 
          error: (response.error as any)?.message || String(response.error) 
        };
      }

      return { 
        success: true,  // 🔥 FIX: This was 'false' before!
        attachment: response.data 
      };
    } catch (error: any) {
      console.error('Get attachment error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const resendReceiving = new ResendReceivingService();