import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { collections } from '@/lib/email-va/firebase';
import { resend } from '@/lib/email-va/resend';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    const isValid = resend.verifyWebhookSignature(rawBody, {
      id: req.headers.get('svix-id') || '',
      timestamp: req.headers.get('svix-timestamp') || '',
      signature: req.headers.get('svix-signature') || '',
    });
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.type !== 'email.opened' && payload.type !== 'email.clicked') {
      return NextResponse.json({ success: true, message: 'Ignored non open/click event' });
    }

    const emailId = payload.data?.email_id;
    if (!emailId) {
      return NextResponse.json({ success: false, error: 'Missing email_id' }, { status: 400 });
    }

    const sentSnapshot = await collections.sent.where('resendEmailId', '==', emailId).limit(1).get();
    if (sentSnapshot.empty) {
      // Not a campaign send we're tracking (could be a transactional email) — ignore.
      return NextResponse.json({ success: true, message: 'No matching campaign send' });
    }

    const sentDoc = sentSnapshot.docs[0];
    const sentData = sentDoc.data();
    const { campaignId } = sentData;

    const isOpen = payload.type === 'email.opened';
    const alreadyCounted = isOpen ? !!sentData.openedAt : !!sentData.clickedAt;

    if (!alreadyCounted) {
      await sentDoc.ref.update(isOpen ? { openedAt: new Date() } : { clickedAt: new Date() });
      if (campaignId) {
        await collections.campaigns.doc(campaignId).update({
          [isOpen ? 'stats.opened' : 'stats.clicked']: FieldValue.increment(1),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Webhook] Email event error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
