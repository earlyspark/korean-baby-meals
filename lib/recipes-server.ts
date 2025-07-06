import { executeQuery } from '@/lib/db'
import { Recipe, SearchFilters, SearchResults } from '@/types'
import { RecipeSearchService } from '@/lib/search'

export class RecipeServerService {
  /**
   * Fetch a single recipe by slug for server-side rendering
   */
  static async getRecipeBySlug(slug: string): Promise<Recipe | null> {
    try {
      const recipes = await executeQuery(`
        SELECT 
          r.*,
          0 as average_rating,
          0 as total_ratings,
          0 as user_rating,
          0 as is_favorited
        FROM recipes r
        WHERE r.slug = ?
      `, [slug]) as Recipe[]

      if (!recipes.length) {
        return null
      }

      const recipe = recipes[0]

      // Fetch ingredients
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
          WHERE ri.recipe_id = ?
          ORDER BY ri.is_optional ASC, 
                   CASE i.ingredient_category 
                     WHEN 'dry' THEN 1 
                     WHEN 'wet' THEN 2 
                     WHEN 'seasoning' THEN 3 
                     ELSE 4 
                   END ASC, 
                   i.display_order ASC, 
                   i.name ASC
        `, [recipe.id]) as any[]

        recipe.ingredients = ingredients
      } catch (error) {
        recipe.ingredients = []
      }

      return recipe
    } catch (error) {
      return null
    }
  }

  /**
   * Get all recipe slugs for static generation
   */
  static async getAllRecipeSlugs(): Promise<string[]> {
    try {
      const results = await executeQuery(`
        SELECT slug FROM recipes WHERE slug IS NOT NULL AND slug != ''
      `) as { slug: string }[]
      
      return results.map(r => r.slug)
    } catch (error) {
      return []
    }
  }

  /**
   * Fetch initial recipes for home page SSR
   */
  static async getInitialRecipes(limit: number = 20): Promise<{
    recipes: Recipe[]
    total_count: number
  }> {
    try {
      const recipes = await executeQuery(`
        SELECT 
          r.*,
          0 as average_rating,
          0 as total_ratings,
          0 as is_favorited
        FROM recipes r
        ORDER BY r.created_at DESC
        LIMIT ?
      `, [limit]) as Recipe[]

      // Enrich recipes with ingredients
      const enrichedRecipes = await RecipeSearchService.enrichRecipesWithIngredients(recipes)

      const totalResult = await executeQuery(`
        SELECT COUNT(*) as total FROM recipes
      `) as { total: number }[]

      const total_count = totalResult[0]?.total || 0

      return {
        recipes: enrichedRecipes,
        total_count
      }
    } catch (error) {
      return { recipes: [], total_count: 0 }
    }
  }

  /**
   * Server-side recipe search for SEO-friendly search pages
   */
  static async searchRecipes(
    ingredients: string[], 
    filters: SearchFilters, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<SearchResults> {
    try {
      // If no ingredients and no filters, return all recipes
      const hasFilters = Object.values(filters).some(value => 
        value !== undefined && value !== null && 
        (Array.isArray(value) ? value.length > 0 : true)
      )
      
      if (ingredients.length === 0 && !hasFilters) {
        return await this.getInitialRecipes(limit).then(result => ({
          recipes: result.recipes,
          almost_matches: [],
          total_count: result.total_count,
          has_more: result.recipes.length < result.total_count
        }))
      }
      
      return await RecipeSearchService.searchRecipes({
        ingredients,
        filters,
        limit,
        offset
      })
    } catch (error) {
      return {
        recipes: [],
        almost_matches: [],
        total_count: 0,
        has_more: false
      }
    }
  }

  /**
   * Get all recipes for sitemap generation
   */
  static async getAllRecipesForSitemap(): Promise<{ slug: string; updated_at: string }[]> {
    try {
      const results = await executeQuery(`
        SELECT slug, updated_at 
        FROM recipes 
        WHERE slug IS NOT NULL AND slug != ''
        ORDER BY updated_at DESC
      `) as { slug: string; updated_at: string }[]
      
      return results
    } catch (error) {
      return []
    }
  }
}