import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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
    // Only run on recipe routes
    '/recipes/:path*',
  ],
};