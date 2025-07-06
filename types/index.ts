export interface User {
  id: number
  email: string
  password_hash: string
  name?: string
  google_id?: string
  created_at: Date
  updated_at: Date
  is_verified: boolean
  verification_token?: string
}

export interface Recipe {
  id: number
  title: string
  slug: string
  description?: string
  instructions: string
  prep_time?: number
  cook_time?: number
  total_time?: number
  servings?: number
  portions_toddler?: number
  is_finger_food: boolean
  is_utensil_food: boolean
  messiness_level: MessinessLevel
  is_freezer_friendly: boolean
  is_food_processor_friendly: boolean
  storage_instructions?: string
  reheating_instructions?: string
  image_url?: string
  created_at: Date
  updated_at: Date
  meta_description?: string
  average_rating?: number
  total_ratings?: number
  ingredients?: RecipeIngredient[]
  user_rating?: number
  is_favorited?: boolean
}

export type IngredientCategory = 'dry' | 'wet' | 'seasoning' | 'other'

export interface Ingredient {
  id: number
  name: string
  aliases: string[]
  ingredient_category?: IngredientCategory
  display_order?: number
  created_at: Date
}

export interface RecipeIngredient {
  id: number
  recipe_id: number
  ingredient_id: number
  ingredient: Ingredient
  ingredient_name?: string
  amount?: string
  unit?: string
  notes?: string
  is_optional: boolean
}

export interface RecipeRating {
  id: number
  recipe_id: number
  user_id: number
  rating: number
  created_at: Date
  updated_at: Date
}

export interface UserFavorite {
  id: number
  user_id: number
  recipe_id: number
  created_at: Date
}

export interface SearchQuery {
  id: number
  query: string
  ingredients_searched: string[]
  filters_used: SearchFilters
  results_count: number
  user_id?: number
  ip_address: string
  created_at: Date
}

export type MessinessLevel = 'clean' | 'moderate' | 'messy'

export interface SearchFilters {
  is_finger_food?: boolean
  is_utensil_food?: boolean
  messiness_level?: MessinessLevel[]
  is_freezer_friendly?: boolean
  is_food_processor_friendly?: boolean
  favorites_only?: boolean
}

export interface SearchParams {
  ingredients: string[]
  filters: SearchFilters
  limit?: number
  offset?: number
  user_id?: number
}

export interface SearchResults {
  recipes: Recipe[]
  almost_matches: Recipe[]
  total_count: number
  has_more: boolean
}

export interface RecipeFormData {
  title: string
  description?: string
  instructions: string
  prep_time?: number
  cook_time?: number
  servings?: number
  portions_toddler?: number
  is_finger_food: boolean
  is_utensil_food: boolean
  messiness_level: MessinessLevel
  is_freezer_friendly: boolean
  is_food_processor_friendly: boolean
  storage_instructions?: string
  reheating_instructions?: string
  image_url?: string
  meta_description?: string
  ingredients: {
    ingredient_name: string
    amount?: string
    unit?: string
    notes?: string
    is_optional: boolean
  }[]
}

export interface FilterIcons {
  messiness_level: {
    clean: string
    moderate: string
    messy: string
  }
  special: {
    freezer_friendly: string
    food_processor_friendly: string
  }
}

export const FILTER_ICONS: FilterIcons = {
  messiness_level: {
    clean: '🧽',
    moderate: '🧽🧽',
    messy: '🧽🧽🧽'
  },
  special: {
    freezer_friendly: '🧊',
    food_processor_friendly: '🥘'
  }
}