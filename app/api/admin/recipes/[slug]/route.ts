import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// PUT /api/admin/recipes/[slug] - Update recipe title only
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { title } = await request.json();
    const currentSlug = params.slug;

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Recipe title is required' },
        { status: 400 }
      );
    }

    const pool = getConnection();
    const connection = await pool.getConnection();

    try {
      // Check if the recipe exists
      const [recipeRows] = await connection.execute(
        'SELECT id, title FROM recipes WHERE slug = ?',
        [currentSlug]
      );

      if (!Array.isArray(recipeRows) || recipeRows.length === 0) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }

      const recipe = recipeRows[0] as { id: number; title: string };

      // Update only the title
      await connection.execute(
        'UPDATE recipes SET title = ?, updated_at = NOW() WHERE slug = ?',
        [title.trim(), currentSlug]
      );

      return NextResponse.json({
        success: true,
        message: 'Recipe title updated successfully',
        recipe: {
          ...recipe,
          title: title.trim()
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error updating recipe title:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}