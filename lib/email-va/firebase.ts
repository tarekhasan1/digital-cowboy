// lib/email-va/firebase.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin (server-side only)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const db = getFirestore();
export const storage = getStorage();

// Collection references
export const collections = {
  leads: db.collection('emailVaLeads'),
  campaigns: db.collection('emailVaCampaigns'),
  inbox: db.collection('emailVaInbox'),
  sent: db.collection('emailVaSent'),
  config: db.collection('emailVaConfig'),
  prompts: db.collection('emailVaPrompts'),
} as const;


export async function getConfig() {
  try {
    const doc = await collections.config.doc('settings').get();
    
    if (!doc.exists) {
      // Return defaults if no config exists
      return {
        autoReplyEnabled: false,
        requireApproval: true,
        rateLimitPerHour: 50,
      };
    }
    
    const data = doc.data()!;
    
    return {
      autoReplyEnabled: data.autoReplyEnabled ?? false,
      requireApproval: data.requireApproval ?? true,
      rateLimitPerHour: data.rateLimitPerHour ?? 50,
    };
  } catch (error) {
    console.error('getConfig error:', error);
    // Return defaults on error
    return {
      autoReplyEnabled: false,
      requireApproval: true,
      rateLimitPerHour: 50,
    };
  }
}

// Helper: Get active prompt
export async function getPrompt(type: 'classify' | 'reply') {
  const snapshot = await collections.prompts
    .where('type', '==', type)
    .where('active', '==', true)
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  return snapshot.docs[0].data().prompt as string;
}