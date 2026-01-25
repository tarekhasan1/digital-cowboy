// actions/email-va/send-email.ts
'use server';

import { collections } from '../../lib/email-va/firebase';
import { resend } from '../../lib/email-va/resend';

interface SendEmailParams {
  to: string[];
  subject: string;
  bodyHtml: string;
  bodyPlain?: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams) {
  try {
    // Validate inputs
    if (!params.to || params.to.length === 0) {
      return { success: false, error: 'No recipients provided' };
    }

    if (!params.subject || !params.bodyHtml) {
      return { success: false, error: 'Subject and body are required' };
    }

    // Send email
    const result = await resend.sendEmail({
      to: params.to,
      subject: params.subject,
      html: params.bodyHtml,
      text: params.bodyPlain,
      replyTo: params.replyTo,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Log to Firestore
    await collections.sent.add({
      toEmail: params.to.join(', '),
      subject: params.subject,
      body: params.bodyHtml,
      type: 'manual',
      sentAt: new Date(),
    });

    return {
      success: true,
      message: `Email sent to ${params.to.length} recipient(s)`,
    };
  } catch (error: any) {
    console.error('Send email error:', error);
    return { success: false, error: error.message };
  }
}