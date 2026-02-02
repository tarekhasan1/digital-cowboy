import { collections } from '@/lib/email-va/firebase';
import { resendReceiving } from '@/lib/email-va/resend-fetch';

export async function GET() {
  try {
    console.log('🔍 DEBUG: Starting inbox debug check...');
    
    // Check Resend
    console.log('🔍 DEBUG: Checking Resend for emails...');
    const resendResult = await resendReceiving.listReceivedEmails();
    console.log('🔍 DEBUG: Resend result:', JSON.stringify({
      success: resendResult.success,
      emailCount: resendResult.emails?.length,
      error: resendResult.error,
      emailsSample: resendResult.emails?.slice(0, 2).map(e => ({
        id: e.id,
        subject: e.subject,
        from: e.from,
      })),
    }, null, 2));

    // Check Firestore
    console.log('🔍 DEBUG: Checking Firestore inbox...');
    const allSnapshot = await collections.inbox.get();
    console.log('🔍 DEBUG: All inbox docs:', allSnapshot.docs.length);
    
    const inboxSnapshot = await collections.inbox
      .where('category', '==', 'inbox')
      .get();
    console.log('🔍 DEBUG: Inbox category docs:', inboxSnapshot.docs.length);
    
    const spamSnapshot = await collections.inbox
      .where('category', '==', 'spam')
      .get();
    console.log('🔍 DEBUG: Spam category docs:', spamSnapshot.docs.length);

    return Response.json({
      timestamp: new Date().toISOString(),
      resend: {
        success: resendResult.success,
        emailCount: resendResult.emails?.length || 0,
        error: resendResult.error,
        sampleEmails: resendResult.emails?.slice(0, 2).map(e => ({
          id: e.id,
          subject: e.subject,
          from: e.from,
        })),
      },
      firestore: {
        totalDocs: allSnapshot.docs.length,
        inboxCategory: inboxSnapshot.docs.length,
        spamCategory: spamSnapshot.docs.length,
        archivedCategory: (await collections.inbox
          .where('category', '==', 'archived')
          .get()).docs.length,
        sampleDocs: allSnapshot.docs.slice(0, 3).map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            subject: data.subject,
            category: data.category,
            fromEmail: data.fromEmail,
            createdAt: data.createdAt?.toDate?.().toISOString(),
          };
        }),
      },
      status: 'ok',
    });
  } catch (error: any) {
    console.error('❌ DEBUG ERROR:', error);
    return Response.json(
      { 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
