import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, verifyFirebaseToken } from '../../../../../lib/email-va/auth/firebase-auth';
import { createSessionCookie } from '../../../../../lib/email-va/auth/firebase-session';

const rateLimiter = new RateLimiter();

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check rate limiting
    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { idToken } = body;

    // Validation
    if (!idToken) {
      rateLimiter.recordAttempt(ip, false);
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const admin = await verifyFirebaseToken(idToken);
    
    if (!admin) {
      rateLimiter.recordAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid credentials or account not authorized' },
        { status: 401 }
      );
    }

    // Create session cookie (5 days expiry)
    const sessionCookie = await createSessionCookie(idToken, 60 * 60 * 24 * 5 * 1000);
    
    // Record successful attempt
    rateLimiter.recordAttempt(ip, true);

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        uid: admin.uid,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}