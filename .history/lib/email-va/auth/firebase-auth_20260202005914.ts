// lib/email-va/auth/firebase-auth.ts
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth } from '../firebase-admin';

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
}

/**
 * Verify Firebase ID token and check if user is admin
 */
export async function verifyFirebaseToken(idToken: string): Promise<AdminUser | null> {
  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists in admins collection
    const adminDoc = await adminCollections.admins.doc(uid).get();

    if (!adminDoc.exists) {
      console.error('User not found in admins collection:', uid);
      return null;
    }

    const adminData = adminDoc.data()!;

    // Check if admin is active
    if (!adminData.isActive) {
      console.error('Admin account is disabled:', uid);
      return null;
    }

    // Update last login
    await adminCollections.admins.doc(uid).update({
      lastLogin: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      uid,
      email: adminData.email,
      name: adminData.name,
      role: adminData.role,
      isActive: adminData.isActive,
      lastLogin: adminData.lastLogin,
    };
  } catch (error: any) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number; blockedUntil?: number }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record) return false;

    if (record.blockedUntil && Date.now() < record.blockedUntil) {
      return true;
    }

    // Reset if window expired
    if (Date.now() - record.firstAttempt > this.WINDOW_MS) {
      this.attempts.delete(identifier);
      return false;
    }

    return false;
  }

  recordAttempt(identifier: string, success: boolean): void {
    if (success) {
      this.attempts.delete(identifier);
      return;
    }

    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now - record.firstAttempt > this.WINDOW_MS) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return;
    }

    record.count++;

    if (record.count >= this.MAX_ATTEMPTS) {
      record.blockedUntil = now + this.BLOCK_DURATION_MS;
      console.warn(`Rate limit exceeded for ${identifier}. Blocked for 1 hour.`);
    }

    this.attempts.set(identifier, record);
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, record] of this.attempts.entries()) {
      if (now - record.firstAttempt > this.WINDOW_MS && 
          (!record.blockedUntil || now > record.blockedUntil)) {
        this.attempts.delete(identifier);
      }
    }
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => globalRateLimiter.cleanup(), 5 * 60 * 1000);
}