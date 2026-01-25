// app/api/test-resend/route.ts
import { NextResponse } from 'next/server';
import { resendReceiving } from '../../../../lib/email-va/resend-fetch';

/**
 * Test endpoint to verify Resend Receiving API connection
 * Visit: /api/test-resend
 */
export async function GET() {
  try {
    console.log('🧪 Testing Resend Receiving API...');

    const result = await resendReceiving.listReceivedEmails();

    if (result.success && result.emails) {
      return NextResponse.json({
        success: true,
        message: `✅ Connected! Found ${result.emails.length} received emails`,
        count: result.emails.length,
        emails: result.emails.map((e: any) => ({
          id: e.id,
          from: e.from,
          to: e.to,
          subject: e.subject,
          created_at: e.created_at,
        })),
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'No emails found',
        note: 'Make sure you have inbound routing configured in Resend dashboard',
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}