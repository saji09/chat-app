import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const userId = request.cookies.get('userId')?.value;
  
  // If trying to access protected routes without authentication
  if (request.nextUrl.pathname.startsWith('/chat') && !userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If trying to access auth routes while already authenticated
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register')) && 
       userId) {
    return NextResponse.redirect(new URL('/chat/general', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/login', '/register'],
};