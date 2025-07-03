import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/auth - Verify admin credentials
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!authorization) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }
  
  // Parse the authorization header
  const [scheme, encoded] = authorization.split(' ');
  
  if (scheme !== 'Basic') {
    return new NextResponse('Invalid authentication', { status: 401 });
  }
  
  // Decode credentials
  const decoded = Buffer.from(encoded, 'base64').toString();
  const [username, password] = decoded.split(':');
  
  // Check credentials against environment variables (runtime)
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  
  if (!validUsername || !validPassword) {
    console.error('Admin credentials not configured in environment variables');
    return new NextResponse('Server configuration error', { status: 500 });
  }
  
  if (username !== validUsername || password !== validPassword) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }
  
  // Valid credentials
  return NextResponse.json({ authenticated: true });
}