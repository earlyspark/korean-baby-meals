'use client'

import { Recipe, SearchResults } from '@/types'
import RecipeCard from './RecipeCard'
import { Grid, List } from 'lucide-react'

interface RecipeGridProps {
  searchResults: SearchResults
  isLoading?: boolean
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onToggleFavorite?: (recipeId: number) => void
  onRate?: (recipeId: number, rating: number) => void
  onLoadMore?: () => void
}

export default function RecipeGrid({
  searchResults,
  isLoading = false,
  viewMode,
  onViewModeChange,
  onToggleFavorite,
  onRate,
  onLoadMore
}: RecipeGridProps) {
  const { recipes = [], almost_matches = [], has_more = false, total_count = 0 } = searchResults || {}
  
  if (isLoading && recipes.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${viewMode === 'grid' ? 'max-w-[800px]' : 'w-full'}`}>
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {(recipes.length + almost_matches.length) > 0 
            ? `${recipes.length + almost_matches.length} recipes found` 
            : 'No recipes found'
          }
        </h2>
        
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${
              viewMode === 'grid' 
                ? 'bg-teal-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${
              viewMode === 'list' 
                ? 'bg-teal-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal line when there are matches */}
      {(recipes.length > 0 || almost_matches.length > 0) && (
        <div className="border-t border-gray-200 -mb-2"></div>
      )}

      {/* Perfect Matches - Now at the top */}
      {recipes.length > 0 && (
        <div className="mb-6">
          {almost_matches.length > 0 && (
            <h3 className="text-lg font-medium text-gray-900 mb-3 pt-4">
              Perfect matches
            </h3>
          )}
          <div className={`${almost_matches.length === 0 ? 'pt-6' : ''} ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2 w-full'
          }`}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={onToggleFavorite}
                onRate={onRate}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Almost Matches - Now below perfect matches */}
      {almost_matches.length > 0 && (
        <div>
          <h3 className={`text-lg font-medium text-gray-900 mb-3 ${recipes.length > 0 ? 'pt-1' : 'pt-4'}`}>
            Almost matches (need 1-2 more ingredients)
          </h3>
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2 w-full'
          }>
            {almost_matches.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={onToggleFavorite}
                onRate={onRate}
                viewMode={viewMode}
                showAlmostMatch={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {recipes.length === 0 && almost_matches.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600">Try adjusting your ingredients or filters</p>
        </div>
      )}

      {/* Load More / Load All */}
      {(has_more && onLoadMore) && (
        <div className="flex justify-center gap-4 pt-4">
          {has_more && onLoadMore && (
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}