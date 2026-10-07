import { NextResponse } from 'next/server';
import { autoSyncEmails, cleanupDeletedEmails } from '@/actions/email-va/sync-resend';
import { pullInboundEmails } from '@/actions/crm/inbound';

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
    // 1. Sync new emails into the CRM inbox (conversations/emailMessages) —
    // same pull used by the manual refresh button on /admin/inbox, in case
    // the inbound webhook was missed.
    const pullResult = await pullInboundEmails();

    // 2. Sync new emails into the legacy email-va inbox
    const syncResult = await autoSyncEmails();

    // 3. Cleanup old deleted emails (runs every time, but only deletes older than 90 days)
    const cleanupResult = await cleanupDeletedEmails();

    return NextResponse.json({
      success: true,
      pull: pullResult,
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
