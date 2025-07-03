import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

interface RedirectData {
  id: number;
  old_slug: string;
  new_slug: string;
  recipe_id: number;
  recipe_title: string;
  created_at: string;
}

// GET /api/admin/redirects - Get all redirects for admin interface
export async function GET(request: NextRequest) {
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    try {
      // Get all redirects with recipe information
      const [redirectRows] = await connection.execute(`
        SELECT 
          rr.id,
          rr.old_slug,
          rr.new_slug,
          rr.recipe_id,
          rr.created_at,
          r.title as recipe_title
        FROM recipe_redirects rr
        JOIN recipes r ON rr.recipe_id = r.id
        ORDER BY rr.created_at DESC
      `);

      const redirects = redirectRows as RedirectData[];
      
      return NextResponse.json({
        redirects,
        total: redirects.length
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching admin redirects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redirects' },
      { status: 500 }
    );
  }
}