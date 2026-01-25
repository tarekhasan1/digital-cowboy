// app/api/webhooks/inbound-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processIncomingMessage } from '../../../../../actions/email-va/ai-reply';

/**
 * Resend Inbound Email Webhook Handler
 * 
 * Resend sends inbound emails with this structure:
 * {
 *   "type": "email.received",
 *   "created_at": "2024-01-01T00:00:00.000Z",
 *   "data": {
 *     "from": "sender@example.com",
 *     "to": ["support@yourdomain.com"],
 *     "subject": "Hello",
 *     "html": "<p>Message content</p>",
 *     "text": "Message content",
 *     "headers": {...},
 *     "message_id": "..."
 *   }
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    // Resend webhook structure
    if (body.type === 'email.received' && body.data) {
      const { from, subject, text, html } = body.data;

      if (!from || !subject) {
        console.error('Missing required fields:', { from, subject });
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Extract email and name from "Name <email@domain.com>" or just "email@domain.com"
      let fromEmail = from;
      let fromName = undefined;

      // Check if format is "Name <email@domain.com>"
      const emailMatch = from.match(/<(.+?)>/);
      if (emailMatch) {
        fromEmail = emailMatch[1].trim();
        const nameMatch = from.match(/^(.+?)\s*</);
        if (nameMatch) {
          fromName = nameMatch[1].trim().replace(/["']/g, '');
        }
      }

      console.log('Processing email:', { fromEmail, fromName, subject });

      // Process the incoming message
      const result = await processIncomingMessage({
        fromEmail,
        fromName,
        subject,
        body: text || html || '',
      });

      if (result.success) {
        console.log('Email processed successfully:', result.messageId);
        return NextResponse.json({ 
          success: true, 
          messageId: result.messageId 
        });
      } else {
        console.error('Failed to process email:', result.error);
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
    }

    // If it's not the expected format
    console.error('Unexpected webhook format:', body);
    return NextResponse.json(
      { error: 'Unexpected webhook format' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Inbound email webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Allow POST requests without authentication for webhooks
export const dynamic = 'force-dynamic';