import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://koreanbabymeals.com'
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin/api routes (if any)
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow all recipe and main pages
Allow: /recipes/
Allow: /about/`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}