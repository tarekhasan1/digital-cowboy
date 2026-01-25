// app/api/webhooks/inbound-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processIncomingMessage } from '../../../../../actions/email-va/ai-reply';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Resend webhook payload structure
    const { 
      from, 
      subject, 
      text, 
      html 
    } = body;

    if (!from || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract email and name from "Name <email@domain.com>" format
    let fromEmail = from;
    let fromName = undefined;

    const emailMatch = from.match(/<(.+)>/);
    if (emailMatch) {
      fromEmail = emailMatch[1];
      const nameMatch = from.match(/^(.+)\s*</);
      if (nameMatch) {
        fromName = nameMatch[1].trim();
      }
    }

    // Process the incoming message
    const result = await processIncomingMessage({
      fromEmail,
      fromName,
      subject,
      body: text || html || '',
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
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