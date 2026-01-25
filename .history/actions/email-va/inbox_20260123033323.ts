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
    
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      messages,
    };
  } catch (error: any) {
    console.error('Get inbox messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
}
