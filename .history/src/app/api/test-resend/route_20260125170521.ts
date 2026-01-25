// app/api/test-resend/route.ts
import { NextResponse } from 'next/server';
import { resendFetch } from '../../../../lib/email-va/resend-fetch';

/**
 * Test endpoint to verify Resend API connection
 * Visit: /api/test-resend
 */
export async function GET() {
  try {
    console.log('🧪 Testing Resend API connection...');

    const result = await resendFetch.fetchEmails(10);

    if (result.success && result.emails) {
      return NextResponse.json({
        success: true,
        message: `✅ Connected! Found ${result.emails.length} emails`,
        emails: result.emails.map(e => ({
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
        error: result.error,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}