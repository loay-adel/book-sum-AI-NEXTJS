import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // 1. Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // 2. Check if pathname has locale (en or ar)
  const hasLocale = pathname.startsWith('/en') || pathname.startsWith('/ar');

  // 3. If no locale, redirect to /en
  if (!hasLocale) {
    // Get Accept-Language header for better UX
    const acceptLanguage = request.headers.get('accept-language') || '';
    const locale = acceptLanguage.includes('ar') ? 'ar' : 'en';
    
    // Construct new URL with locale
    const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
};