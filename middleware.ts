import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is an admin route
  if (pathname.startsWith('/admin')) {
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      // No auth header, request authentication
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
    
    // Just check that auth header exists - actual validation will happen in server components
    // This is because Edge Runtime doesn't have access to process.env at runtime
    return NextResponse.next();
  }
  
  // Continue to normal route handling for all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on admin routes only
    '/admin/:path*',
  ],
};