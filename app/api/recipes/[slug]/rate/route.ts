import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = AuthService.verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { rating } = await request.json()
    
    // Get recipe ID from slug
    const recipes = await executeQuery(
      `SELECT id FROM recipes WHERE slug = ?`,
      [params.slug]
    ) as { id: number }[]
    
    if (!recipes.length) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    const recipeId = recipes[0].id

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    await executeQuery(
      `INSERT INTO recipe_ratings (recipe_id, user_id, rating) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [recipeId, user.id, rating]
    )

    return NextResponse.json({ 
      message: 'Rating saved successfully',
      rating 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    )
  }
}