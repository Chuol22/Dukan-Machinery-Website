// admin/auth/login/route.ts — validate credentials and set session cookie
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const officerPassword = process.env.OFFICER_PASSWORD || 'officer';

    let authenticatedUser = null;

    if ((email === 'admin@dukanmachinery.com' || email === 'john@dukanmachinery.com') && password === adminPassword && role === 'SUPER_ADMIN') {
      authenticatedUser = {
        name: 'admin (Admin)',
        email: 'admin@dukanmachinery.com',
        role: 'SUPER_ADMIN',
      };
    } else if ((email === 'officer@dukanmachinery.com' || email === 'sarah@dukanmachinery.com') && password === officerPassword && role === 'SALES_OFFICER') {
      authenticatedUser = {
        name: 'officer (Sales Officer)',
        email: 'officer@dukanmachinery.com',
        role: 'SALES_OFFICER',
      };
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { message: 'Invalid email, password, or role selection.' },
        { status: 401 }
      );
    }

    // Create a session payload.
    // Encoded as base64 for simplicity, robustness and zero bundling issue.
    const sessionData = JSON.stringify({
      ...authenticatedUser,
      createdAt: new Date().toISOString(),
    });
    const sessionToken = Buffer.from(sessionData).toString('base64');

    // Create the response and set the HttpOnly cookie.
    const response = NextResponse.json({ success: true, user: authenticatedUser });
    response.cookies.set('dkm_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
