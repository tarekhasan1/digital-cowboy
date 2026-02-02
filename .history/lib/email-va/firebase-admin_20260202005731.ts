// lib/email-va/auth/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Collections
export const collections = {
  admins: adminDb.collection('admins'),
  auditLogs: adminDb.collection('auditLogs'),
} as const;

// Helper to log audit events
export async function logAuditEvent(
  userId: string,
  action: string,
  details?: Record<string, any>
) {
  try {
    await collections.auditLogs.add({
      userId,
      action,
      details,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

// Initialize default admin if not exists
export async function initializeDefaultAdmin() {
  try {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@digitalcowboy.com.au';
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword123!';
    
    const adminSnapshot = await collections.admins
      .where('email', '==', defaultAdminEmail)
      .limit(1)
      .get();

    if (adminSnapshot.empty) {
      // Create Firebase Auth user
      const userRecord = await adminAuth.createUser({
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        emailVerified: true,
        disabled: false,
      });

      // Create admin document
      await collections.admins.doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: defaultAdminEmail,
        name: 'System Administrator',
        role: 'superadmin',
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        lastLogin: null,
      });

      console.log('✅ Default admin created:', defaultAdminEmail);
      console.log('⚠️  Default password:', defaultAdminPassword);
      console.log('⚠️  Please change the password after first login!');
      
      await logAuditEvent(userRecord.uid, 'ADMIN_CREATED', {
        source: 'system',
        email: defaultAdminEmail,
      });
    }
  } catch (error) {
    console.error('Failed to initialize default admin:', error);
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  initializeDefaultAdmin().catch(console.error);
}