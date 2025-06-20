import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { Recipe } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const recipes = await executeQuery(`
      SELECT 
        r.*,
        0 as average_rating,
        0 as total_ratings,
        0 as user_rating,
        0 as is_favorited
      FROM recipes r
      WHERE r.slug = '${params.slug}'
    `) as Recipe[]

    if (!recipes.length) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    const recipe = recipes[0]

    // Try to fetch ingredients
    try {
      const ingredients = await executeQuery(`
        SELECT 
          ri.amount,
          ri.unit,
          ri.notes,
          CASE WHEN ri.is_optional = 1 THEN true ELSE false END as is_optional,
          i.name as ingredient_name
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = ${recipe.id}
        ORDER BY ri.is_optional ASC, i.name ASC
      `) as any[]

      recipe.ingredients = ingredients
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      recipe.ingredients = []
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Recipe fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}