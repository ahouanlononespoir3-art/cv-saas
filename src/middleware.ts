// src/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/pricing', '/privacy', '/terms'];
const AUTH_PATHS   = ['/login', '/register', '/forgot-password'];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const path  = nextUrl.pathname;

  const isPublic  = PUBLIC_PATHS.some(p => path === p || path.startsWith('/api/auth'));
  const isAuthPage = AUTH_PATHS.includes(path);
  const isApiRoute = path.startsWith('/api');

  // Redirect authenticated users away from auth pages
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect dashboard and API routes (except auth)
  if (!session && !isPublic && !isApiRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Protect API routes (except auth + stripe webhook)
  if (isApiRoute && !isPublic && !path.startsWith('/api/stripe/webhook')) {
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
