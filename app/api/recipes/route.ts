import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { Recipe } from '@/types'
import { RecipeSearchService } from '@/lib/search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const recipes = await executeQuery(`
      SELECT 
        r.*,
        0 as average_rating,
        0 as total_ratings,
        0 as is_favorited
      FROM recipes r
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `) as Recipe[]

    // Enrich recipes with ingredients
    const enrichedRecipes = await RecipeSearchService.enrichRecipesWithIngredients(recipes)

    const totalResult = await executeQuery(`
      SELECT COUNT(*) as total FROM recipes
    `) as { total: number }[]

    const total_count = totalResult[0]?.total || 0
    const has_more = offset + recipes.length < total_count

    return NextResponse.json({
      recipes: enrichedRecipes,
      total_count,
      has_more,
      almost_matches: []
    })
  } catch (error) {
    console.error('Recipes fetch error:', error)
    // Fallback to sample data if database fails
    const sampleRecipes = [
      {
        id: 1,
        title: 'Korean Beef Rice Bowl',
        slug: 'korean-beef-rice-bowl',
        description: 'Simple and nutritious Korean-inspired beef and rice bowl perfect for toddlers. Mild flavors with tender ground beef and soft vegetables.',
        instructions: '1. Cook rice according to package instructions.\n2. Heat sesame oil in a pan over medium heat.\n3. Add ground beef and cook until browned.\n4. Add minced garlic and ginger, cook for 1 minute.\n5. Add carrots and cook until tender.\n6. Season with a small amount of soy sauce.\n7. Serve over rice and let cool before serving to toddler.',
        prep_time: 15,
        cook_time: 20,
        total_time: 35,
        servings: 4,
        portions_toddler: 8,
        eating_method: 'fork_friendly',
        messiness_level: 'moderate',
        is_freezer_friendly: 1,
        is_food_processor_friendly: 1,
        storage_instructions: 'Store in refrigerator for up to 3 days. Freeze portions for up to 3 months.',
        reheating_instructions: 'Microwave for 30-60 seconds or reheat in pan with a splash of water.',
        image_url: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        meta_description: 'Nutritious Korean-inspired beef and rice bowl for toddlers with mild flavors and tender vegetables.',
        average_rating: 0,
        total_ratings: 0,
        is_favorited: 0
      },
      {
        id: 2,
        title: 'Sweet Potato Chicken Mash',
        slug: 'sweet-potato-chicken-mash',
        description: 'Creamy sweet potato mashed with tender chicken pieces. Perfect finger food that melts in baby\'s mouth.',
        instructions: '1. Peel and cube sweet potatoes.\n2. Steam sweet potatoes until very tender, about 15 minutes.\n3. Cook chicken breast until fully cooked through.\n4. Shred chicken into small pieces.\n5. Mash sweet potatoes until smooth.\n6. Mix in shredded chicken.\n7. Add a tiny amount of sesame oil for flavor.\n8. Let cool and serve in small portions.',
        prep_time: 10,
        cook_time: 25,
        total_time: 35,
        servings: 3,
        portions_toddler: 6,
        eating_method: 'finger_foods',
        messiness_level: 'clean',
        is_freezer_friendly: 1,
        is_food_processor_friendly: 1,
        storage_instructions: 'Refrigerate for up to 4 days. Freeze in ice cube trays for easy portions.',
        reheating_instructions: 'Thaw overnight and microwave for 20-30 seconds.',
        image_url: null,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        meta_description: 'Nutritious sweet potato and chicken mash perfect for baby led weaning and toddler meals.',
        average_rating: 0,
        total_ratings: 0,
        is_favorited: 0
      },
      {
        id: 3,
        title: 'Tofu Vegetable Stir-fry',
        slug: 'tofu-vegetable-stir-fry',
        description: 'Soft tofu with colorful vegetables in a mild sauce. Great for introducing different textures and Asian flavors.',
        instructions: '1. Cut tofu into small cubes.\n2. Steam broccoli and carrots until very tender.\n3. Heat a small amount of sesame oil in pan.\n4. Gently cook tofu until lightly golden.\n5. Add steamed vegetables.\n6. Mix with a tiny amount of soy sauce.\n7. Add green onions at the end.\n8. Serve warm, cut into appropriate sizes for toddler.',
        prep_time: 10,
        cook_time: 15,
        total_time: 25,
        servings: 3,
        portions_toddler: 6,
        eating_method: 'finger_foods',
        messiness_level: 'moderate',
        is_freezer_friendly: 1,
        is_food_processor_friendly: 0,
        storage_instructions: 'Best eaten fresh, can be refrigerated for 2 days.',
        reheating_instructions: 'Reheat gently in microwave or steam to warm through.',
        image_url: null,
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        meta_description: 'Healthy tofu and vegetable stir-fry introducing Asian flavors to toddlers in a mild, toddler-friendly way.',
        average_rating: 0,
        total_ratings: 0,
        is_favorited: 0
      }
    ];

    return NextResponse.json({
      recipes: sampleRecipes,
      total_count: sampleRecipes.length,
      has_more: false,
      almost_matches: []
    })
  }
}