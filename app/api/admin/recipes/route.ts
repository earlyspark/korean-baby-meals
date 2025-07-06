import { NextRequest, NextResponse } from 'next/server';
import { RecipeServerService } from '@/lib/recipes-server';

// GET /api/admin/recipes - Get all recipes for admin interface
export async function GET(request: NextRequest) {
  try {
    // Get all recipes for admin interface
    const result = await RecipeServerService.getInitialRecipes(100);
    
    return NextResponse.json({
      recipes: result.recipes,
      total: result.recipes.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}