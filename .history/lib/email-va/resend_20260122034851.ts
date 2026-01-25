// lib/email-va/resend.ts
// FREE Email using Resend (3,000 emails/month)

import { Resend } from 'resend';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
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
        reply_to: params.replyTo,
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