import { collections } from '@/lib/email-va/firebase';
import { resendReceiving } from '@/lib/email-va/resend-fetch';

export async function GET() {
  try {
    // Check Resend
    console.log('🔍 Checking Resend for emails...');
    const resendResult = await resendReceiving.listReceivedEmails();
    console.log('Resend result:', {
      success: resendResult.success,
      emailCount: resendResult.emails?.length,
      error: resendResult.error,
    });

    // Check Firestore
    console.log('🔍 Checking Firestore inbox...');
    const snapshot = await collections.inbox.get();
    console.log('Firestore inbox:', {
      total: snapshot.docs.length,
      docs: snapshot.docs.map(doc => ({
        id: doc.id,
        subject: doc.data().subject,
        category: doc.data().category,
      })),
    });

    return Response.json({
      resend: {
        success: resendResult.success,
        emailCount: resendResult.emails?.length || 0,
        error: resendResult.error,
      },
      firestore: {
        total: snapshot.docs.length,
        sample: snapshot.docs.slice(0, 3).map(doc => ({
          id: doc.id,
          subject: doc.data().subject,
          category: doc.data().category,
          fromEmail: doc.data().fromEmail,
        })),
      },
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return Response.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
