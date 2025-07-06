import { NextRequest, NextResponse } from 'next/server'
import { RecipeSearchService } from '@/lib/search'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ ingredients: [] })
    }

    const ingredients = await RecipeSearchService.searchIngredients(query)
    
    return NextResponse.json({ ingredients })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search ingredients' },
      { status: 500 }
    )
  }
}