import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();

    try {
      // Get total recipe count
      const [recipeCount] = await connection.execute(
        'SELECT COUNT(*) as count FROM recipes'
      );
      const totalRecipes = (recipeCount as any)[0]?.count || 0;

      // Get total redirects count
      const [redirectCount] = await connection.execute(
        'SELECT COUNT(*) as count FROM recipe_redirects'
      );
      const totalRedirects = (redirectCount as any)[0]?.count || 0;

      // Get recent recipe updates (last 10)
      const [recentRecipes] = await connection.execute(`
        SELECT title, slug, updated_at 
        FROM recipes 
        ORDER BY updated_at DESC 
        LIMIT 10
      `);

      // Get recent redirects (last 10)
      const [recentRedirects] = await connection.execute(`
        SELECT rr.old_slug, rr.new_slug, rr.created_at, r.title
        FROM recipe_redirects rr
        JOIN recipes r ON rr.recipe_id = r.id
        ORDER BY rr.created_at DESC 
        LIMIT 10
      `);

      return NextResponse.json({
        totalRecipes,
        totalRedirects,
        recentUpdates: recentRecipes,
        recentRedirects: recentRedirects,
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}