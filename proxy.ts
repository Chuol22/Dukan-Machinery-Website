// proxy.ts — middleware protecting /admin routes via session cookie
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // We only run this middleware on paths starting with /admin
  if (path.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('dkm_admin_session');

    // Case 1: Visiting /admin/login
    if (path === '/admin/login') {
      if (sessionCookie?.value) {
        // Already logged in, redirect to admin home
        try {
          const decodedData = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
          const session = JSON.parse(decodedData);
          if (session.email && session.role) {
            return NextResponse.redirect(new URL('/admin', request.url));
          }
        } catch {
          // session cookie was invalid/malformed, clear it and allow login page
          const res = NextResponse.next();
          res.cookies.delete('dkm_admin_session');
          return res;
        }
      }
      return NextResponse.next();
    }

    // Case 2: Visiting protected /admin paths
    if (!sessionCookie?.value) {
      // Not logged in, redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify session formatting
    try {
      const decodedData = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
      const session = JSON.parse(decodedData);
      if (!session.email || !session.role) {
        throw new Error('Invalid structure');
      }
    } catch {
      // session cookie was invalid/malformed, redirect to login page and clear cookie
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.delete('dkm_admin_session');
      return res;
    }
  }

  return NextResponse.next();
}

// Ensure middleware runs for all /admin subpaths
export const config = {
  matcher: ['/admin/:path*'],
};
