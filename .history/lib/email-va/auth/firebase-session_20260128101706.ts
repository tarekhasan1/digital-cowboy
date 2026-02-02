import { adminAuth, collections } from "../firebase-admin";


export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  lastLogin?: Date;
}

// Create Firebase session cookie
export async function createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 5 * 1000) {
  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if user is admin
    const adminDoc = await collections.admins.doc(decodedToken.uid).get();
    
    if (!adminDoc.exists) {
      throw new Error('User is not an admin');
    }

    const adminData = adminDoc.data() as AdminUser;
    
    if (!adminData.isActive) {
      throw new Error('Admin account is deactivated');
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Update last login
    await collections.admins.doc(decodedToken.uid).update({
      lastLogin: new Date(),
      updatedAt: new Date(),
    });

    return sessionCookie;
  } catch (error) {
    console.error('Session cookie creation error:', error);
    throw error;
  }
}

// Verify session cookie
export async function verifySessionCookie(sessionCookie: string): Promise<AdminUser | null> {
  try {
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Check if user is admin
    const adminDoc = await collections.admins.doc(decodedClaims.uid).get();
    
    if (!adminDoc.exists) {
      return null;
    }

    const adminData = adminDoc.data() as AdminUser;
    
    if (!adminData.isActive) {
      return null;
    }

    return adminData;
  } catch (error) {
    console.error('Session cookie verification error:', error);
    return null;
  }
}

// Validate request
export async function validateRequest(request: Request): Promise<{
  isValid: boolean;
  user?: AdminUser;
  error?: string;
}> {
  try {
    // Try to get session cookie
    const cookieHeader = request.headers.get('cookie');
    const sessionCookieMatch = cookieHeader?.match(/session=([^;]+)/);
    const sessionCookie = sessionCookieMatch?.[1];

    if (!sessionCookie) {
      return { isValid: false, error: 'No session cookie' };
    }

    const user = await verifySessionCookie(sessionCookie);
    
    if (!user) {
      return { isValid: false, error: 'Invalid session' };
    }

    return { isValid: true, user };
  } catch (error) {
    console.error('Request validation error:', error);
    return { isValid: false, error: 'Internal server error' };
  }
}