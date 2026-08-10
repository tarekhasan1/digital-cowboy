import { NextResponse } from 'next/server';
import { migrateLeadsToContacts, migrateInboxToConversations } from '@/actions/crm/migrate';

export const dynamic = 'force-dynamic';

export async function GET() {
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
