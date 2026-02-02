// app/api/auth/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeDefaultAdmin } from '@/lib/email-va/firebase-admin';

/**
 * Setup endpoint to initialize default admin
 * Only works in development mode
 * Call once: GET /api/auth/setup
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Setup only available in development' },
      { status: 403 }
    );
  }

  try {
    await initializeDefaultAdmin();
    return NextResponse.json({
      success: true,
      message: 'Default admin initialized',
      credentials: {
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
      },
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        error: 'Setup failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
