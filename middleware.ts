import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is an admin route (but not the auth API route itself)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/admin/auth')) {
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
    
    try {
      // Forward the auth check to our API route which has access to runtime env vars
      const authUrl = new URL('/api/admin/auth', request.url);
      const authResponse = await fetch(authUrl.toString(), {
        method: 'GET',
        headers: {
          'authorization': authorization,
        },
      });
      
      if (!authResponse.ok) {
        // Authentication failed
        const authHeaders: HeadersInit = {};
        const wwwAuth = authResponse.headers.get('www-authenticate');
        if (wwwAuth) {
          authHeaders['WWW-Authenticate'] = wwwAuth;
        }
        
        return new NextResponse(await authResponse.text(), {
          status: authResponse.status,
          headers: authHeaders,
        });
      }
      
      // Authentication successful, continue to admin page
    } catch (error) {
      console.error('Error checking admin auth:', error);
      return new NextResponse('Authentication service error', { status: 500 });
    }
  }
  
  // Only handle recipe routes
  if (!pathname.startsWith('/recipes/')) {
    return NextResponse.next();
  }
  
  // Extract slug from URL (e.g., /recipes/some-recipe-slug)
  const slug = pathname.split('/recipes/')[1];
  
  // Skip if no slug or if it's a nested path
  if (!slug || slug.includes('/')) {
    return NextResponse.next();
  }
  
  try {
    // Use fetch to check for redirects via API route instead of direct DB connection
    const apiUrl = new URL('/api/redirects/check', request.url);
    apiUrl.searchParams.set('slug', slug);
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.redirect && data.newSlug) {
        const newUrl = new URL(`/recipes/${data.newSlug}`, request.url);
        
        // Preserve query parameters if any
        newUrl.search = request.nextUrl.search;
        
        return NextResponse.redirect(newUrl, 301);
      }
    }
    
    // No redirect found or API error, continue to normal route handling
    return NextResponse.next();
    
  } catch (error) {
    // Log error but don't break the request
    console.error('Error checking recipe redirects:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Run on recipe routes
    '/recipes/:path*',
    // Run on admin routes
    '/admin/:path*',
  ],
};