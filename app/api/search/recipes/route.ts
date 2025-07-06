import { NextRequest, NextResponse } from 'next/server'
import { RecipeSearchService } from '@/lib/search'
import { RecipeServerService } from '@/lib/recipes-server'
import { SearchFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const ingredientsParam = searchParams.get('ingredients')
    const ingredients = ingredientsParam ? ingredientsParam.split(',').filter(Boolean) : []
    
    const filters: SearchFilters = {}
    
    
    // Boolean eating method filters
    if (searchParams.get('is_finger_food') === 'true') {
      filters.is_finger_food = true
    }
    
    if (searchParams.get('is_utensil_food') === 'true') {
      filters.is_utensil_food = true
    }
    
    const messinessParam = searchParams.get('messiness_level')
    if (messinessParam) {
      filters.messiness_level = messinessParam.split(',') as any
    }
    
    if (searchParams.get('is_freezer_friendly') === 'true') {
      filters.is_freezer_friendly = true
    }
    
    if (searchParams.get('is_food_processor_friendly') === 'true') {
      filters.is_food_processor_friendly = true
    }
    
    if (searchParams.get('favorites_only') === 'true') {
      filters.favorites_only = true
    }
    
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const user_id = searchParams.get('user_id') ? parseInt(searchParams.get('user_id')!) : undefined

    // Check if this is an empty search (no ingredients and no active filters)
    const hasActiveFilters = Object.values(filters).some(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    )
    
    if (ingredients.length === 0 && !hasActiveFilters) {
      // Return all recipes when no search criteria
      const result = await RecipeServerService.getInitialRecipes(limit)
      return NextResponse.json({
        recipes: result.recipes,
        almost_matches: [],
        total_count: result.total_count,
        has_more: result.recipes.length < result.total_count
      })
    }

    const results = await RecipeSearchService.searchRecipes({
      ingredients,
      filters,
      limit,
      offset,
      user_id
    })
    
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    )
  }
}