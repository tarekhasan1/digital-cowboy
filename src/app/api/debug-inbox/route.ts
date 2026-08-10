import { NextResponse } from 'next/server';
import { collections } from '@/lib/email-va/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await collections.inbox.get();
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      success: true,
      count: docs.length,
      docs
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
