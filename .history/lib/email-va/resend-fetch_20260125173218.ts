// lib/email-va/resend-fetch.ts
// Fetch received emails using Resend's official receiving API

import { Resend } from 'resend';

interface ReceivedEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  created_at: string;
}

/**
 * Fetch received emails from Resend using official API
 */
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
      const { data, error } = await this.client.emails.receiving.list();

      if (error) {
        console.error('Resend receiving.list error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Received emails from Resend:', data?.length || 0);
      
      return { 
        success: true, 
        emails: data || [] 
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
      const { data, error } = await this.client.emails.receiving.get(emailId);

      if (error) {
        console.error('Resend receiving.get error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, email: data };
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
      const { data, error } = await this.client.attachments.receiving.list({
        emailId,
      });

      if (error) {
        console.error('Resend attachments.list error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, attachments: data || [] };
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
      const { data, error } = await this.client.attachments.receiving.get({
        id: attachmentId,
        emailId,
      });

      if (error) {
        console.error('Resend attachments.get error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, attachment: data };
    } catch (error: any) {
      console.error('Get attachment error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const resendReceiving = new ResendReceivingService();