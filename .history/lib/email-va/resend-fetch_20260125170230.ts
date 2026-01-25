// lib/email-va/resend-fetch.ts
// Fetch received emails from Resend API

interface ResendEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  created_at: string;
}

/**
 * Fetch emails from Resend
 * Uses Resend's emails API to get sent/received emails
 */
export class ResendFetchService {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
  }

  /**
   * Fetch all emails from Resend
   * This includes both sent and received emails
   */
  async fetchEmails(limit: number = 20): Promise<{
    success: boolean;
    emails?: ResendEmail[];
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Resend API error:', error);
        return { success: false, error: `API error: ${response.status}` };
      }

      const data = await response.json();
      
      // Resend returns: { data: [...emails], object: "list" }
      const emails = data.data || [];
      
      return { 
        success: true, 
        emails: emails.slice(0, limit) 
      };
    } catch (error: any) {
      console.error('Fetch emails error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a specific email by ID
   */
  async getEmail(emailId: string): Promise<{
    success: boolean;
    email?: ResendEmail;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/emails/${emailId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `API error: ${response.status}` };
      }

      const email = await response.json();
      
      return { success: true, email };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Filter received emails (emails sent TO your domain)
   */
  filterReceivedEmails(emails: ResendEmail[], yourDomain: string): ResendEmail[] {
    return emails.filter(email => 
      email.to.some(recipient => recipient.includes(yourDomain))
    );
  }
}

export const resendFetch = new ResendFetchService();