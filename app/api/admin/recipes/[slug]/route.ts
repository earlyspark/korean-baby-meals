import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// PUT /api/admin/recipes/[slug] - Update recipe title and slug with redirect preservation
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, slug: newSlug } = await request.json();
    const currentSlug = params.slug;

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Recipe title is required' },
        { status: 400 }
      );
    }

    if (!newSlug?.trim()) {
      return NextResponse.json(
        { error: 'Recipe slug is required' },
        { status: 400 }
      );
    }

    // Validate slug format (only lowercase letters, numbers, and hyphens)
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(newSlug)) {
      return NextResponse.json(
        { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    const pool = getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check if the recipe exists
      const [recipeRows] = await connection.execute(
        'SELECT id, title, slug FROM recipes WHERE slug = ?',
        [currentSlug]
      );

      if (!Array.isArray(recipeRows) || recipeRows.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }

      const recipe = recipeRows[0] as { id: number; title: string; slug: string };

      // Check if new slug conflicts with existing recipe (unless it's the same recipe)
      const [conflictRows] = await connection.execute(
        'SELECT id, title FROM recipes WHERE slug = ? AND id != ?',
        [newSlug, recipe.id]
      );

      if (Array.isArray(conflictRows) && conflictRows.length > 0) {
        await connection.rollback();
        const conflictRecipe = conflictRows[0] as { title: string };
        return NextResponse.json(
          { error: `Slug "${newSlug}" is already used by recipe: "${conflictRecipe.title}"` },
          { status: 409 }
        );
      }

      // Check if new slug conflicts with existing redirects
      const [redirectConflictRows] = await connection.execute(
        'SELECT recipe_id FROM recipe_redirects WHERE old_slug = ? OR new_slug = ?',
        [newSlug, newSlug]
      );

      if (Array.isArray(redirectConflictRows) && redirectConflictRows.length > 0) {
        await connection.rollback();
        return NextResponse.json(
          { error: `Slug "${newSlug}" conflicts with existing redirects` },
          { status: 409 }
        );
      }

      // If slug is changing, manage redirects to avoid chains
      if (currentSlug !== newSlug) {
        // First, update ALL existing redirects for this recipe to point to the new slug
        // This prevents redirect chains by ensuring all old URLs go directly to the newest URL
        await connection.execute(
          'UPDATE recipe_redirects SET new_slug = ? WHERE recipe_id = ?',
          [newSlug, recipe.id]
        );

        // Then, check if we need to create a new redirect for the current slug
        const [existingRedirectRows] = await connection.execute(
          'SELECT id FROM recipe_redirects WHERE old_slug = ? AND recipe_id = ?',
          [currentSlug, recipe.id]
        );

        if (!Array.isArray(existingRedirectRows) || existingRedirectRows.length === 0) {
          // Create new redirect entry for current slug → new slug
          await connection.execute(
            'INSERT INTO recipe_redirects (old_slug, new_slug, recipe_id, created_at) VALUES (?, ?, ?, NOW())',
            [currentSlug, newSlug, recipe.id]
          );
        }
        // Note: If the redirect already exists, it was already updated in the first query above
      }

      // Update the recipe
      await connection.execute(
        'UPDATE recipes SET title = ?, slug = ?, updated_at = NOW() WHERE id = ?',
        [title.trim(), newSlug.trim(), recipe.id]
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Recipe updated successfully',
        data: {
          id: recipe.id,
          title: title.trim(),
          slug: newSlug.trim(),
          redirectCreated: currentSlug !== newSlug,
          oldSlug: currentSlug !== newSlug ? currentSlug : null,
        },
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error updating recipe:', error);
    
    // Return appropriate error message
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/recipes/[slug] - Get recipe details for admin
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const pool = getConnection();
    const connection = await pool.getConnection();

    try {
      const [recipeRows] = await connection.execute(
        'SELECT * FROM recipes WHERE slug = ?',
        [slug]
      );

      if (!Array.isArray(recipeRows) || recipeRows.length === 0) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }

      const recipe = recipeRows[0];

      // Get any redirects for this recipe
      const [redirectRows] = await connection.execute(
        'SELECT old_slug, created_at FROM recipe_redirects WHERE recipe_id = ? ORDER BY created_at DESC',
        [recipe.id]
      );

      return NextResponse.json({
        success: true,
        data: {
          recipe,
          redirects: redirectRows,
        },
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}