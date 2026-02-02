// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revokeSession } from '@/lib/email-va/auth/firebase-session';
import { adminAuth, logAuditEvent } from '@/lib/email-va/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (sessionCookie) {
      // Revoke the session
      await revokeSession(sessionCookie);
      
      // Try to get user ID for logging (best effort)
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        await logAuditEvent(decodedClaims.uid, 'LOGOUT');
      } catch {
        // Ignore errors in logging
      }
    }

    // Clear the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear the cookie even if there's an error
    const response = NextResponse.json({ success: true });
    response.cookies.delete('session');
    
    return response;
  }
}