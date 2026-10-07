import { NextResponse } from 'next/server';
import { ingestInboundEmail } from '@/actions/crm/inbound';
import { resendReceiving } from '@/lib/email-va/resend-fetch';
import { resend } from '@/lib/email-va/resend';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    const isValid = resend.verifyWebhookSignature(rawBody, {
      id: req.headers.get('svix-id') || '',
      timestamp: req.headers.get('svix-timestamp') || '',
      signature: req.headers.get('svix-signature') || '',
    });
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // 1. Validate Event Type
    if (payload.type !== 'email.received') {
      return NextResponse.json({ success: true, message: 'Ignored non-inbound event' });
    }

    const emailData = payload.data;
    if (!emailData) {
      return NextResponse.json({ success: false, error: 'Missing email data' }, { status: 400 });
    }

    // The webhook payload only carries metadata (from/to/subject/email_id/message_id) —
    // body and headers must be fetched separately via the receiving.get API.
    const emailId = emailData.email_id || emailData.id;
    let fullEmail: any = emailData;
    if (emailId) {
      const fullEmailResult = await resendReceiving.getReceivedEmail(emailId);
      if (fullEmailResult.success && fullEmailResult.email) {
        fullEmail = fullEmailResult.email;
      } else {
        console.error('[Webhook] Could not fetch full email, proceeding with metadata only:', fullEmailResult.error);
      }
    }

    const result = await ingestInboundEmail(fullEmail);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log(`[Webhook] Processed inbound email: ${fullEmail.subject || '(No Subject)'}${result.skipped ? ' (duplicate)' : ''}`);

    return NextResponse.json({ success: true, skipped: result.skipped || false });

  } catch (error: any) {
    console.error('[Webhook] Inbound email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
