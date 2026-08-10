import { NextResponse } from 'next/server';
import { resend } from '@/lib/email-va/resend';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get('to') || 'test@example.com';
    
    console.log(`Testing Resend to: ${to}`);
    
    // Call the wrapper
    const result = await resend.sendEmail({
      to,
      subject: 'Debug Test Email',
      html: '<p>This is a test from the Command Center debug route.</p>',
      text: 'This is a test from the Command Center debug route.'
    });

    return NextResponse.json({
      success: result.success,
      id: result.id,
      error: result.error,
      note: 'If success is true but you did not receive it, check the spam folder or your Resend dashboard (domain verification).'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
