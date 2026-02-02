// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/email-va/auth/firebase-session';

export async function GET(request: NextRequest) {
  try {
    const validation = await validateRequest(request);
    
    if (!validation.isValid || !validation.user) {
      return NextResponse.json(
        { error: validation.error || 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: validation.user.uid,
        uid: validation.user.uid,
        email: validation.user.email,
        name: validation.user.name,
        role: validation.user.role,
        lastLogin: validation.user.lastLogin,
      },
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}