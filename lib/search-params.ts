import { SearchFilters } from '@/types'

export interface ParsedSearchParams {
  ingredients: string[]
  filters: SearchFilters
  viewMode: 'grid' | 'list'
  limit: number
  offset: number
}

export function parseSearchParams(searchParams: URLSearchParams): ParsedSearchParams {
  // Parse ingredients
  const ingredientsParam = searchParams.get('ingredients')
  const ingredients = ingredientsParam 
    ? ingredientsParam.split(',').map(i => decodeURIComponent(i.trim())).filter(Boolean)
    : []

  // Parse filters
  const filters: SearchFilters = {}

  // Eating method (array)
  const eatingMethodParam = searchParams.get('eating_method')
  if (eatingMethodParam) {
    filters.eating_method = eatingMethodParam.split(',').map(m => m.trim()) as any
  }

  // Messiness level (array)
  const messinessParam = searchParams.get('messiness_level')
  if (messinessParam) {
    filters.messiness_level = messinessParam.split(',').map(m => m.trim()) as any
  }

  // Boolean filters
  if (searchParams.get('is_freezer_friendly') === 'true') {
    filters.is_freezer_friendly = true
  }
  if (searchParams.get('is_food_processor_friendly') === 'true') {
    filters.is_food_processor_friendly = true
  }
  if (searchParams.get('favorites_only') === 'true') {
    filters.favorites_only = true
  }

  // View mode
  const viewMode = searchParams.get('view') === 'list' ? 'list' : 'grid'

  // Pagination
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
  const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

  return {
    ingredients,
    filters,
    viewMode,
    limit,
    offset
  }
}

export function buildSearchParams(params: Partial<ParsedSearchParams>): URLSearchParams {
  const searchParams = new URLSearchParams()

  // Add ingredients
  if (params.ingredients && params.ingredients.length > 0) {
    searchParams.set('ingredients', params.ingredients.map(i => encodeURIComponent(i)).join(','))
  }

  // Add filters
  if (params.filters) {
    const { filters } = params

    if (filters.eating_method && filters.eating_method.length > 0) {
      searchParams.set('eating_method', filters.eating_method.join(','))
    }

    if (filters.messiness_level && filters.messiness_level.length > 0) {
      searchParams.set('messiness_level', filters.messiness_level.join(','))
    }

    if (filters.is_freezer_friendly) {
      searchParams.set('is_freezer_friendly', 'true')
    }

    if (filters.is_food_processor_friendly) {
      searchParams.set('is_food_processor_friendly', 'true')
    }

    if (filters.favorites_only) {
      searchParams.set('favorites_only', 'true')
    }
  }

  // Add view mode (only if list, default is grid)
  if (params.viewMode === 'list') {
    searchParams.set('view', 'list')
  }

  // Add pagination (only if non-default)
  if (params.limit && params.limit !== 20) {
    searchParams.set('limit', params.limit.toString())
  }

  if (params.offset && params.offset > 0) {
    searchParams.set('offset', params.offset.toString())
  }

  return searchParams
}

export function generateSearchTitle(ingredients: string[], filters: SearchFilters): string {
  const parts: string[] = []

  if (ingredients.length > 0) {
    parts.push(ingredients.join(' and '))
  }

  if (filters.eating_method && filters.eating_method.length > 0) {
    parts.push(filters.eating_method.join(' ').replace('_', ' '))
  }

  if (parts.length === 0) {
    return 'Recipe Search'
  }

  return `${parts.join(' ')} Korean Baby Recipes`
}

export function generateSearchDescription(ingredients: string[], filters: SearchFilters): string {
  let description = 'Find Korean baby-friendly recipes'

  if (ingredients.length > 0) {
    description += ` with ${ingredients.join(', ')}`
  }

  if (filters.eating_method && filters.eating_method.length > 0) {
    const methods = filters.eating_method.map(m => m.replace('_', ' ')).join(' and ')
    description += `. Perfect for ${methods}`
  }

  description += '. Easy-to-follow instructions and baby-safe ingredients.'

  return description
}