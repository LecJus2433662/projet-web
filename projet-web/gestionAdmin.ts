import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role  = req.cookies.get('role')?.value;

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage  = req.nextUrl.pathname === '/admin/login';

  // Si pas connecté ou pas admin → login
  if (isAdminRoute && !isLoginPage) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};