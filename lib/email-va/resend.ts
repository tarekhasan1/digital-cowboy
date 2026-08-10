// lib/email-va/resend.ts
import { Resend } from 'resend';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

interface InboundEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  created_at: string;
}

class ResendService {
  private client: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    this.client = new Resend(apiKey);
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@youragency.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Your Agency';
  }

  /**
   * Send single email
   */
  async sendEmail(params: SendEmailParams): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await this.client.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text || this.htmlToText(params.html),
        ...(params.replyTo && { replyTo: params.replyTo }),
        ...(params.headers && { headers: params.headers }),
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch inbound emails (if available via Resend API)
   * Note: This may require a webhook setup or specific Resend plan
   */
  async fetchInboundEmails(): Promise<{
    success: boolean;
    emails?: InboundEmail[];
    error?: string;
  }> {
    try {
      // Note: Resend's inbound email API might be different
      // This is a placeholder - check Resend docs for actual endpoint
      const response = await fetch('https://api.resend.com/emails/inbound', {
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      const data = await response.json();
      return { success: true, emails: data.data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send bulk emails (for campaigns)
   */
  async sendBulk(emails: SendEmailParams[]): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> {
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const email of emails) {
      const result = await this.sendEmail(email);
      
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push(result.error || 'Unknown error');
      }

      // Rate limiting: 10 emails/second for free tier
      await this.delay(100);
    }

    return { sent, failed, errors };
  }

  /**
   * Simple HTML to plain text converter
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton
export const resend = new ResendService();