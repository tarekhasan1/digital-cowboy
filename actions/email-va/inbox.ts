// actions/email-va/inbox.ts
'use server';

import { collections } from '../../lib/email-va/firebase';

/**
 * Get inbox messages
 */
export async function getInboxMessages(limit: number = 50) {
  try {
    const snapshot = await collections.inbox
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        fromEmail: data.fromEmail || '',
        fromName: data.fromName || undefined,
        subject: data.subject || '',
        body: data.body || '',
        intent: data.intent || undefined,
        priority: data.priority || 'medium',
        status: data.status || 'unread',
        aiReply: data.aiReply || undefined,
        aiApproved: data.aiApproved || false,
        resendEmailId: data.resendEmailId || undefined,
        // 🔥 FIX: Convert Firestore Timestamps to serializable format
        createdAt: data.createdAt?.toDate?.() 
          ? data.createdAt.toDate().toISOString() 
          : (data.createdAt instanceof Date 
              ? data.createdAt.toISOString() 
              : new Date().toISOString()),
        updatedAt: data.updatedAt?.toDate?.() 
          ? data.updatedAt.toDate().toISOString() 
          : (data.updatedAt instanceof Date 
              ? data.updatedAt.toISOString() 
              : new Date().toISOString()),
      };
    });

    console.log(`📬 Fetched ${messages.length} inbox messages`);

    return {
      success: true,
      messages,
    };
  } catch (error: any) {
    console.error('Get inbox messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
}