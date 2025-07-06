import { SearchFilters, Recipe } from '@/types'

/**
 * Format eating methods for display based on filters
 * @param filters - Search filters containing eating method flags
 * @returns Array of formatted eating method strings
 */
export function formatEatingMethods(filters: SearchFilters): string[] {
  const eatingMethods: string[] = []
  if (filters.is_finger_food) eatingMethods.push('finger foods')
  if (filters.is_utensil_food) eatingMethods.push('utensil foods')
  return eatingMethods
}

/**
 * Format eating methods for display based on recipe
 * @param recipe - Recipe containing eating method flags
 * @returns Array of formatted eating method strings
 */
export function formatRecipeEatingMethods(recipe: Recipe): string[] {
  const eatingMethods: string[] = []
  if (recipe.is_finger_food) eatingMethods.push('finger foods')
  if (recipe.is_utensil_food) eatingMethods.push('utensil foods')
  return eatingMethods
}

/**
 * Join eating methods with proper grammar
 * @param eatingMethods - Array of eating method strings
 * @returns Formatted string with proper conjunction
 */
export function joinEatingMethods(eatingMethods: string[]): string {
  if (eatingMethods.length === 0) return ''
  if (eatingMethods.length === 1) return eatingMethods[0]
  return eatingMethods.join(' and ')
}