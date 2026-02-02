// lib/email-va/auth/firebase-session.ts
import { NextRequest } from 'next/server';
import { adminAuth } from '../firebase-admin';

/**
 * Create session cookie from ID token
 */
export async function createSessionCookie(
  idToken: string,
  expiresIn: number
): Promise<string> {
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    return sessionCookie;
  } catch (error) {
    console.error('Failed to create session cookie:', error);
    throw new Error('Failed to create session');
  }
}

/**
 * Validate session from request
 */
export async function validateRequest(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return {
        isValid: false,
        error: 'No session cookie',
        user: null,
      };
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    // Get admin data
    const adminDoc = await adminCollections.admins.doc(uid).get();

    if (!adminDoc.exists) {
      return {
        isValid: false,
        error: 'Admin not found',
        user: null,
      };
    }

    const adminData = adminDoc.data()!;

    if (!adminData.isActive) {
      return {
        isValid: false,
        error: 'Account disabled',
        user: null,
      };
    }

    return {
      isValid: true,
      user: {
        uid,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        lastLogin: adminData.lastLogin,
      },
    };
  } catch (error: any) {
    console.error('Session validation error:', error);
    return {
      isValid: false,
      error: error.code === 'auth/session-cookie-expired' 
        ? 'Session expired' 
        : 'Invalid session',
      user: null,
    };
  }
}

/**
 * Revoke session
 */
export async function revokeSession(sessionCookie: string): Promise<void> {
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    await adminAuth.revokeRefreshTokens(decodedClaims.uid);
  } catch (error) {
    console.error('Failed to revoke session:', error);
  }
}