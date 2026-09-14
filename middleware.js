import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './lib/session';

export const config = {
  matcher: ['/espace-client/:path*', '/admin/:path*'],
};

export async function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    const url = request.nextUrl.clone();
    url.pathname = '/espace-client';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
