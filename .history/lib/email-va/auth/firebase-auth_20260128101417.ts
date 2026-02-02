
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { adminAuth, collections, logAuditEvent } from '../firebase-admin';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  lastLogin?: Date;
}

// Generate JWT token
export function generateToken(payload: { uid: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Verify JWT token
export function verifyToken(token: string): { uid: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { uid: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// Verify Firebase ID token
export async function verifyFirebaseToken(idToken: string): Promise<AdminUser | null> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if user exists in admins collection
    const adminDoc = await collections.admins.doc(decodedToken.uid).get();
    
    if (!adminDoc.exists) {
      return null;
    }

    const adminData = adminDoc.data() as AdminUser;
    
    // Check if admin is active
    if (!adminData.isActive) {
      return null;
    }

    return adminData;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Create session
export async function createSession(admin: AdminUser, userAgent?: string, ipAddress?: string) {
  try {
    // Update last login
    await collections.admins.doc(admin.uid).update({
      lastLogin: new Date(),
      updatedAt: new Date(),
    });

    // Log login event
    await logAuditEvent(admin.uid, 'LOGIN', {
      userAgent,
      ipAddress,
      success: true,
    });

    // Generate JWT token
    const token = generateToken({
      uid: admin.uid,
      email: admin.email,
      role: admin.role,
    });

    return token;
  } catch (error) {
    console.error('Session creation error:', error);
    throw error;
  }
}

// Validate session from cookie/header
export async function validateSession(request: Request): Promise<{
  isValid: boolean;
  user?: AdminUser;
  error?: string;
}> {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.split(' ')[1];
    
    if (!token) {
      // Try to get from cookie
      const cookieHeader = request.headers.get('cookie');
      const tokenMatch = cookieHeader?.match(/admin_token=([^;]+)/);
      token = tokenMatch?.[1];
    }

    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return { isValid: false, error: 'Invalid token' };
    }

    // Get admin data from Firestore
    const adminDoc = await collections.admins.doc(decoded.uid).get();
    
    if (!adminDoc.exists) {
      return { isValid: false, error: 'Admin not found' };
    }

    const adminData = adminDoc.data() as AdminUser;
    
    if (!adminData.isActive) {
      return { isValid: false, error: 'Account is deactivated' };
    }

    return { isValid: true, user: adminData };
  } catch (error) {
    console.error('Session validation error:', error);
    return { isValid: false, error: 'Internal server error' };
  }
}

// Logout - clear session
export async function logoutSession(uid: string, userAgent?: string, ipAddress?: string) {
  try {
    await logAuditEvent(uid, 'LOGOUT', {
      userAgent,
      ipAddress,
    });
  } catch (error) {
    console.error('Logout logging error:', error);
  }
}

// Rate limiting helper
export class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly RESET_TIME = 15 * 60 * 1000; // 15 minutes

  isBlocked(ip: string): boolean {
    const attempt = this.attempts.get(ip);
    
    if (!attempt) return false;
    
    if (Date.now() > attempt.resetTime) {
      this.attempts.delete(ip);
      return false;
    }
    
    return attempt.count >= this.MAX_ATTEMPTS;
  }

  recordAttempt(ip: string, success: boolean) {
    if (success) {
      this.attempts.delete(ip);
      return;
    }

    const attempt = this.attempts.get(ip) || { count: 0, resetTime: Date.now() + this.RESET_TIME };
    attempt.count++;
    this.attempts.set(ip, attempt);
  }

  getRemainingAttempts(ip: string): number {
    const attempt = this.attempts.get(ip);
    if (!attempt) return this.MAX_ATTEMPTS;
    
    if (Date.now() > attempt.resetTime) {
      this.attempts.delete(ip);
      return this.MAX_ATTEMPTS;
    }
    
    return Math.max(0, this.MAX_ATTEMPTS - attempt.count);
  }
}