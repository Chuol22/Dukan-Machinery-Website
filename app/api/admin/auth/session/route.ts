// admin/auth/session/route.ts — return current admin session from cookie
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('dkm_admin_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Decode base64 session data
    try {
      const decodedData = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
      const session = JSON.parse(decodedData);
      
      // Simple validation: make sure required fields exist
      if (!session.email || !session.role || !session.name) {
        throw new Error('Invalid session structure');
      }

      return NextResponse.json({ authenticated: true, user: session });
    } catch {
      // Cookie is malformed or invalid
      return NextResponse.json({ authenticated: false, message: 'Invalid session' }, { status: 401 });
    }
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ authenticated: false, message: 'Internal server error' }, { status: 500 });
  }
}
