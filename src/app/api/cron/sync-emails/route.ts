import { NextResponse } from 'next/server';
import { autoSyncEmails, cleanupDeletedEmails } from '@/actions/email-va/sync-resend';

export const dynamic = 'force-dynamic';

// Vercel Cron Jobs are triggered securely when checking the Authorization header.
// Vercel automatically sends `Bearer ${process.env.CRON_SECRET}`.
export async function GET(request: Request) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Sync new emails
    const syncResult = await autoSyncEmails();
    
    // 2. Cleanup old deleted emails (runs every time, but only deletes older than 90 days)
    const cleanupResult = await cleanupDeletedEmails();

    return NextResponse.json({
      success: true,
      sync: syncResult,
      cleanup: cleanupResult
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
