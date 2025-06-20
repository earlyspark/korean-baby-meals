'use client'

import { Recipe, FILTER_ICONS } from '@/types'
import { Star, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/components/client/FavoriteButton'

const hasFreezerInstructions = (recipe: Recipe) => {
  if (!recipe.storage_instructions) {
    return recipe.is_freezer_friendly
  }
  
  const freezeKeywords = ['freeze', 'freezer', 'frozen', 'freezing', 'unfreeze', 'defrost', 'thaw']
  const instructions = recipe.storage_instructions.toLowerCase()
  
  return freezeKeywords.some(keyword => instructions.includes(keyword))
}

interface RecipeCardProps {
  recipe: Recipe
  onToggleFavorite?: (recipeId: number) => void
  onRate?: (recipeId: number, rating: number) => void
  viewMode?: 'grid' | 'list'
  showAlmostMatch?: boolean
}

export default function RecipeCard({ recipe, onToggleFavorite, onRate, viewMode = 'grid', showAlmostMatch = false }: RecipeCardProps) {
  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => onRate?.(recipe.id, i + 1) : undefined}
      />
    ))
  }

  if (viewMode === 'list') {
    // Compact list view
    return (
      <div className="bg-sand-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full min-w-[800px]">
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Square thumbnail */}
          <div className="flex-shrink-0 relative">
            <Link href={`/recipes/${recipe.slug}`}>
              <div className="relative w-16 h-16 bg-sand-300 rounded-md overflow-hidden">
                {recipe.image_url ? (
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-2xl">🍽️</span>
                  </div>
                )}
              </div>
            </Link>
            {/* Heart overlay on image */}
            <div className="absolute top-1 right-1">
              <FavoriteButton 
                recipeId={recipe.id}
                size="sm"
                className="bg-opacity-90 hover:bg-opacity-100 shadow-sm"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between w-full">
              <Link href={`/recipes/${recipe.slug}`} className="flex-1 mr-4">
                <h3 className="font-semibold text-gray-900 hover:text-teal-600 text-base leading-tight">
                  {recipe.title}
                </h3>
              </Link>
              
              {/* Almost Match Badge and Rating */}
              <div className="flex items-center gap-2 ml-2">
                {showAlmostMatch && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Almost match
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {recipe.average_rating ? (
                    <>
                      <div className="flex">
                        {renderStars(Math.round(recipe.average_rating))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({recipe.total_ratings})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">No ratings</span>
                  )}
                </div>
              </div>
            </div>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mt-1">
                <p className="text-xs text-gray-600 line-clamp-1">
                  {recipe.ingredients.map(ingredient => 
                    ingredient.ingredient?.name || 'Unknown'
                  ).join(', ')}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 w-full">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                {recipe.total_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{recipe.total_time}min</span>
                  </div>
                )}
                {recipe.portions_toddler && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{recipe.portions_toddler} portions</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span 
                  className="text-sm" 
                  title={`Eating method: ${recipe.eating_method.replace('_', ' ')}`}
                >
                  {FILTER_ICONS.eating_method[recipe.eating_method]}
                </span>
                <span 
                  className="text-sm" 
                  title={`Messiness level: ${recipe.messiness_level}`}
                >
                  {FILTER_ICONS.messiness_level[recipe.messiness_level]}
                </span>
                {hasFreezerInstructions(recipe) && (
                  <span 
                    className="text-sm" 
                    title="Freezer-friendly"
                  >
                    {FILTER_ICONS.special.freezer_friendly}
                  </span>
                )}
                {Boolean(recipe.is_food_processor_friendly) && (
                  <span 
                    className="text-sm" 
                    title="Food processor-friendly"
                  >
                    {FILTER_ICONS.special.food_processor_friendly}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (original layout)
  return (
    <div className="bg-sand-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/recipes/${recipe.slug}`}>
          <div className="relative h-48 bg-sand-300">
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-4xl">🍽️</span>
              </div>
            )}
          </div>
        </Link>
        
        <div className="absolute top-4 right-4">
          <FavoriteButton 
            recipeId={recipe.id}
            size="md"
            showTooltip={true}
          />
        </div>
        
        {showAlmostMatch && (
          <div className="absolute bottom-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Almost match
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <Link href={`/recipes/${recipe.slug}`}>
            <h3 className="font-semibold text-gray-900 hover:text-teal-600 line-clamp-2">
              {recipe.title}
            </h3>
          </Link>
        </div>

        {recipe.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          {recipe.total_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{recipe.total_time}min</span>
            </div>
          )}
          {recipe.portions_toddler && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{recipe.portions_toddler} toddler portions</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <span 
            className="text-lg" 
            title={`Eating method: ${recipe.eating_method.replace('_', ' ')}`}
          >
            {FILTER_ICONS.eating_method[recipe.eating_method]}
          </span>
          <span 
            className="text-lg" 
            title={`Messiness level: ${recipe.messiness_level}`}
          >
            {FILTER_ICONS.messiness_level[recipe.messiness_level]}
          </span>
          {hasFreezerInstructions(recipe) && (
            <span 
              className="text-lg" 
              title="Freezer-friendly"
            >
              {FILTER_ICONS.special.freezer_friendly}
            </span>
          )}
          {Boolean(recipe.is_food_processor_friendly) && (
            <span 
              className="text-lg" 
              title="Food processor-friendly"
            >
              {FILTER_ICONS.special.food_processor_friendly}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {recipe.average_rating ? (
              <>
                <div className="flex">
                  {renderStars(Math.round(recipe.average_rating))}
                </div>
                <span className="text-xs text-gray-500">
                  ({recipe.total_ratings})
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-500">No ratings yet</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Rate:</span>
            <a
              href="/login"
              className="flex text-gray-400 hover:text-teal-600 transition-colors"
              title="Login to rate recipes"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-3 w-3" />
              ))}
            </a>
          </div>
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">
              {recipe.ingredients.map(ingredient => 
                ingredient.ingredient?.name || 'Unknown'
              ).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}