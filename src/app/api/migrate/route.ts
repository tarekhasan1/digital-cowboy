import { NextRequest, NextResponse } from 'next/server';
import { migrateLeadsToContacts, migrateInboxToConversations } from '@/actions/crm/migrate';
import { validateRequest } from '@/lib/email-va/auth/firebase-session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const validation = await validateRequest(request);
  if (!validation.isValid || !validation.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const leadsRes = await migrateLeadsToContacts();
    const inboxRes = await migrateInboxToConversations();

    return NextResponse.json({
      success: true,
      leads: leadsRes,
      inbox: inboxRes
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
