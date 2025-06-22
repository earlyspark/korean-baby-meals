import Fuse from 'fuse.js'
import { executeQuery } from './db'
import { Recipe, Ingredient, SearchParams, SearchResults, SearchFilters } from '@/types'

export class RecipeSearchService {
  private static ingredientFuse: Fuse<Ingredient> | null = null

  static async initializeIngredientSearch() {
    if (this.ingredientFuse) return this.ingredientFuse

    const ingredients = await executeQuery(`
      SELECT id, name, aliases FROM ingredients
    `) as Ingredient[]

    const searchData = ingredients.map(ingredient => ({
      ...ingredient,
      aliases: typeof ingredient.aliases === 'string' 
        ? JSON.parse(ingredient.aliases) 
        : ingredient.aliases || []
    }))

    this.ingredientFuse = new Fuse(searchData, {
      keys: [
        { name: 'name', weight: 1.0 },
        { name: 'aliases', weight: 0.8 }
      ],
      threshold: 0.3,
      includeScore: true
    })

    return this.ingredientFuse
  }

  static async searchIngredients(query: string): Promise<Ingredient[]> {
    const fuse = await this.initializeIngredientSearch()
    const results = fuse.search(query)
    
    return results
      .filter(result => (result.score || 0) < 0.6)
      .slice(0, 10)
      .map(result => result.item)
  }

  static async searchRecipes(params: SearchParams): Promise<SearchResults> {
    const { ingredients, filters, limit = 20, offset = 0, user_id } = params

    let baseQuery = `
      SELECT DISTINCT
        r.id,
        r.title,
        r.slug,
        r.description,
        r.instructions,
        r.prep_time,
        r.cook_time,
        r.total_time,
        r.servings,
        r.portions_toddler,
        r.eating_method,
        r.is_finger_food,
        r.is_utensil_food,
        r.messiness_level,
        r.is_freezer_friendly,
        r.is_food_processor_friendly,
        r.storage_instructions,
        r.reheating_instructions,
        r.image_url,
        r.created_at,
        r.updated_at,
        r.meta_description,
        0 as average_rating,
        0 as total_ratings,
        ${user_id ? `0 as user_rating,` : ''}
        0 as is_favorited
      FROM recipes r
    `

    const joins = []
    const conditions = []
    const params_array: any[] = []

    if (ingredients.length > 0) {
      // Find recipes where you have ALL the ingredients needed for the recipe
      const ingredientSubquery = `
        r.id IN (
          SELECT ri.recipe_id 
          FROM recipe_ingredients ri
          INNER JOIN ingredients i ON ri.ingredient_id = i.id
          WHERE ${ingredients.map(() => `i.name LIKE ?`).join(' OR ')}
          GROUP BY ri.recipe_id
          HAVING COUNT(DISTINCT CASE 
            WHEN ${ingredients.map(() => `i.name LIKE ?`).join(' OR ')} 
            THEN i.id 
          END) = ${ingredients.length}
          AND COUNT(DISTINCT ri.ingredient_id) = COUNT(DISTINCT CASE 
            WHEN ${ingredients.map(() => `i.name LIKE ?`).join(' OR ')} 
            THEN ri.ingredient_id 
          END)
        )
      `
      
      conditions.push(ingredientSubquery)
      
      // Add ingredient parameters three times - for WHERE, first CASE, and second CASE
      ingredients.forEach(ingredient => {
        params_array.push(`%${ingredient}%`)
      })
      ingredients.forEach(ingredient => {
        params_array.push(`%${ingredient}%`)
      })
      ingredients.forEach(ingredient => {
        params_array.push(`%${ingredient}%`)
      })
    }

    // Simplified version without ratings for now

    baseQuery += joins.join(' ')

    // Legacy eating method support (deprecated)
    if (filters.eating_method && filters.eating_method.length > 0) {
      let eating_methods = [...filters.eating_method]
      
      // If multiple eating methods are selected, also include 'combination' recipes
      if (filters.eating_method.length > 1) {
        eating_methods.push('combination' as any)
      }
      
      const placeholders = eating_methods.map(() => '?').join(',')
      conditions.push(`r.eating_method IN (${placeholders})`)
      params_array.push(...eating_methods)
    }
    
    // New boolean eating method filters
    const eatingMethodConditions = []
    if (filters.is_finger_food) {
      eatingMethodConditions.push('r.is_finger_food = 1')
    }
    if (filters.is_utensil_food) {
      eatingMethodConditions.push('r.is_utensil_food = 1')
    }
    
    if (eatingMethodConditions.length > 0) {
      conditions.push(`(${eatingMethodConditions.join(' OR ')})`)
    }

    if (filters.messiness_level && filters.messiness_level.length > 0) {
      const placeholders = filters.messiness_level.map(() => '?').join(',')
      conditions.push(`r.messiness_level IN (${placeholders})`)
      params_array.push(...filters.messiness_level)
    }

    if (filters.is_freezer_friendly) {
      conditions.push(`r.is_freezer_friendly = 1`)
    }

    if (filters.is_food_processor_friendly) {
      conditions.push(`r.is_food_processor_friendly = 1`)
    }

    if (filters.favorites_only && user_id) {
      joins.push(`INNER JOIN user_favorites uf2 ON r.id = uf2.recipe_id AND uf2.user_id = ?`)
      params_array.push(user_id)
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${conditions.join(' AND ')}`
    }

    // User parameters are already added above when building joins

    // No grouping needed for simplified query

    baseQuery += ` ORDER BY r.created_at DESC`

    const countQuery = `
      SELECT COUNT(*) as total FROM (${baseQuery}) as counted_results
    `
    
    baseQuery += ` LIMIT ? OFFSET ?`
    params_array.push(limit, offset)

    // Debug logging
    console.log('Final query:', baseQuery)
    console.log('Parameters:', params_array)
    console.log('Parameter count:', params_array.length)
    
    // Test: Let's see what ingredients exist
    try {
      const allIngredients = await executeQuery('SELECT name FROM ingredients LIMIT 10') as any[]
      console.log('Sample ingredients in DB:', allIngredients.map(i => i.name))
    } catch (error) {
      console.log('Error fetching ingredients:', error)
    }
    
    // Try a much simpler query first
    const simpleQuery = 'SELECT id, title FROM recipes LIMIT 5'
    try {
      const simpleResult = await executeQuery(simpleQuery) as any[]
      console.log('Simple query result:', simpleResult)
    } catch (error) {
      console.log('Simple query error:', error)
    }
    
    const [initialRecipes, countResult] = await Promise.all([
      executeQuery(baseQuery, params_array) as Promise<Recipe[]>,
      executeQuery(countQuery, params_array.slice(0, -2)) as Promise<{total: number}[]>
    ])

    let almost_matches: Recipe[] = []
    let recipes: Recipe[] = initialRecipes

    if (ingredients.length > 1) {
      // Get almost matches first (they have priority)
      almost_matches = await this.findAlmostMatches(ingredients, filters, user_id)
      
      // Filter main results to exclude almost matches
      const almostMatchIds = almost_matches.map(r => r.id)
      recipes = initialRecipes.filter(recipe => !almostMatchIds.includes(recipe.id))
    }

    const total_count = countResult[0]?.total || 0
    const has_more = offset + recipes.length < total_count

    // Enrich recipes and almost_matches with ingredients
    const [enrichedRecipes, enrichedAlmostMatches] = await Promise.all([
      this.enrichRecipesWithIngredients(recipes),
      this.enrichRecipesWithIngredients(almost_matches)
    ])

    return {
      recipes: enrichedRecipes,
      almost_matches: enrichedAlmostMatches,
      total_count,
      has_more
    }
  }

  private static async findAlmostMatches(
    ingredients: string[], 
    filters: SearchFilters, 
    user_id?: number
  ): Promise<Recipe[]> {
    // Find recipes where:
    // 1. You have most of the ingredients they need
    // 2. You're only missing 1-2 ingredients from completing the recipe
    const almostMatchQuery = `
      SELECT DISTINCT 
        r.*,
        0 as average_rating,
        0 as total_ratings,
        ${user_id ? `0 as user_rating,` : ''}
        0 as is_favorited,
        matched_count,
        total_ingredients,
        (total_ingredients - matched_count) as missing_ingredients
      FROM (
        SELECT 
          r.*,
          COUNT(DISTINCT all_ri.ingredient_id) as total_ingredients,
          COUNT(DISTINCT CASE 
            WHEN ${ingredients.map(() => `mi.name LIKE ?`).join(' OR ')} 
            THEN matched_ri.ingredient_id 
          END) as matched_count
        FROM recipes r
        LEFT JOIN recipe_ingredients all_ri ON r.id = all_ri.recipe_id
        LEFT JOIN recipe_ingredients matched_ri ON r.id = matched_ri.recipe_id
        LEFT JOIN ingredients mi ON matched_ri.ingredient_id = mi.id
        GROUP BY r.id
        HAVING 
          total_ingredients > 0 
          AND matched_count >= ${Math.max(1, ingredients.length - 1)}
          AND (total_ingredients - matched_count) BETWEEN 1 AND 2
          AND matched_count < total_ingredients
      ) r
      ORDER BY missing_ingredients ASC, matched_count DESC
      LIMIT 5
    `

    const params_array: any[] = []
    
    // Add ingredient parameters for the LIKE conditions
    ingredients.forEach(ingredient => {
      params_array.push(`%${ingredient}%`)
    })

    return executeQuery(almostMatchQuery, params_array) as Promise<Recipe[]>
  }

  static async getRecipeIngredients(recipeId: number): Promise<any[]> {
    return executeQuery(`
      SELECT 
        ri.*,
        i.name as ingredient_name,
        i.aliases as ingredient_aliases
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = ?
      ORDER BY ri.is_optional ASC, i.name ASC
    `, [recipeId])
  }

  static async enrichRecipesWithIngredients(recipes: Recipe[]): Promise<Recipe[]> {
    if (recipes.length === 0) return recipes

    const recipeIds = recipes.map(r => r.id)
    const placeholders = recipeIds.map(() => '?').join(',')
    
    const ingredients = await executeQuery(`
      SELECT 
        ri.recipe_id,
        ri.amount,
        ri.unit,
        ri.notes,
        ri.is_optional,
        i.id as ingredient_id,
        i.name,
        i.aliases
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id IN (${placeholders})
      ORDER BY ri.recipe_id, ri.is_optional ASC, i.name ASC
    `, recipeIds) as any[]

    // Group ingredients by recipe_id
    const ingredientsByRecipe = ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.recipe_id]) {
        acc[ingredient.recipe_id] = []
      }
      acc[ingredient.recipe_id].push({
        id: ingredient.ingredient_id,
        ingredient_id: ingredient.ingredient_id,
        recipe_id: ingredient.recipe_id,
        amount: ingredient.amount,
        unit: ingredient.unit,
        notes: ingredient.notes,
        is_optional: ingredient.is_optional,
        ingredient: {
          id: ingredient.ingredient_id,
          name: ingredient.name,
          aliases: ingredient.aliases
        }
      })
      return acc
    }, {} as Record<number, any[]>)

    // Attach ingredients to recipes
    return recipes.map(recipe => ({
      ...recipe,
      ingredients: ingredientsByRecipe[recipe.id] || []
    }))
  }
}