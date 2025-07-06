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

    await executeQuery(
      `INSERT IGNORE INTO user_favorites (user_id, recipe_id) VALUES (?, ?)`,
      [user.id, recipeId]
    )

    return NextResponse.json({ 
      message: 'Recipe added to favorites',
      is_favorited: true 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await executeQuery(
      `DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?`,
      [user.id, recipeId]
    )

    return NextResponse.json({ 
      message: 'Recipe removed from favorites',
      is_favorited: false 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}