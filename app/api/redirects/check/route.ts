import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET /api/redirects/check?slug=old-slug - Check if a slug has a redirect
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const pool = getConnection();
    const connection = await pool.getConnection();

    try {
      const [redirectRows] = await connection.execute(
        'SELECT new_slug FROM recipe_redirects WHERE old_slug = ?',
        [slug]
      );

      if (Array.isArray(redirectRows) && redirectRows.length > 0) {
        const redirect = redirectRows[0] as { new_slug: string };
        return NextResponse.json({
          redirect: true,
          oldSlug: slug,
          newSlug: redirect.new_slug,
        });
      }

      return NextResponse.json({
        redirect: false,
        slug: slug,
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error checking redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}