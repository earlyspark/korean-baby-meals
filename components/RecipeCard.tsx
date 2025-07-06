'use client'

import { Recipe, FILTER_ICONS } from '@/types'
import { Star, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/components/client/FavoriteButton'
import Tooltip from '@/components/Tooltip'

const hasFreezerInstructions = (recipe: Recipe) => {
  if (!recipe.storage_instructions) {
    return recipe.is_freezer_friendly
  }
  
  const freezeKeywords = ['freeze', 'freezer', 'frozen', 'freezing', 'unfreeze', 'defrost', 'thaw']
  const instructions = recipe.storage_instructions.toLowerCase()
  
  return freezeKeywords.some(keyword => instructions.includes(keyword))
}

const renderEatingMethodIcons = (recipe: Recipe, size: 'sm' | 'md' = 'md') => {
  const icons = []
  const textSize = size === 'sm' ? 'text-sm' : 'text-lg'
  
  if (recipe.is_finger_food) {
    icons.push(
      <span 
        key="finger"
        className={`${textSize} cursor-default`}
        title="Finger food"
      >
        ✋
      </span>
    )
  }
  
  if (recipe.is_utensil_food) {
    icons.push(
      <span 
        key="utensils"
        className={`${textSize} cursor-default`}
        title="Utensils needed"
      >
        🍴
      </span>
    )
  }
  
  return icons.length > 0 ? icons : [
    <span key="fallback" className="text-sm text-gray-400" title="Eating method not specified">
      ?
    </span>
  ]
}

interface RecipeCardProps {
  recipe: Recipe
  onToggleFavorite?: (recipeId: number) => void
  onRate?: (recipeId: number, rating: number) => void
  viewMode?: 'grid' | 'list'
  showAlmostMatch?: boolean
  priority?: boolean // For LCP optimization
}

export default function RecipeCard({ recipe, onToggleFavorite, onRate, viewMode = 'grid', showAlmostMatch = false, priority = false }: RecipeCardProps) {
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
    // Compact list view - responsive layout
    return (
      <div className="bg-sand-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full">
        {/* Desktop and tablet layout */}
        <div className="hidden sm:flex items-center gap-4 px-4 py-3">
          {/* Square thumbnail */}
          <div className="flex-shrink-0 relative">
            <Link href={`/recipes/${recipe.slug}`}>
              <div className="relative w-16 h-16 bg-sand-300 rounded-md overflow-hidden">
                {recipe.image_url ? (
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    sizes="64px"
                    priority={priority}
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link href={`/recipes/${recipe.slug}`} className="flex-1 mr-4">
                <h3 className="font-semibold text-gray-900 hover:text-teal-600 text-base leading-tight">
                  {recipe.title}
                </h3>
              </Link>
              
              {/* Almost Match Badge and Rating */}
              <div className="flex items-center gap-2">
                {showAlmostMatch && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
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

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4 text-sm text-gray-500">
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

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderEatingMethodIcons(recipe, 'sm')}
                </div>
                <span 
                  className="text-sm cursor-default" 
                  title={`Messiness level: ${recipe.messiness_level}`}
                >
                  {FILTER_ICONS.messiness_level[recipe.messiness_level]}
                </span>
                {hasFreezerInstructions(recipe) && (
                  <span 
                    className="text-sm cursor-default" 
                    title="Freezer-friendly"
                  >
                    {FILTER_ICONS.special.freezer_friendly}
                  </span>
                )}
                {Boolean(recipe.is_food_processor_friendly) && (
                  <span 
                    className="text-sm cursor-default" 
                    title="Food processor-friendly"
                  >
                    {FILTER_ICONS.special.food_processor_friendly}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout - stacked vertically */}
        <div className="sm:hidden">
          <div className="flex items-start gap-3 px-3 py-3">
            {/* Thumbnail */}
            <div className="flex-shrink-0 relative">
              <Link href={`/recipes/${recipe.slug}`}>
                <div className="relative w-20 h-20 bg-sand-300 rounded-md overflow-hidden">
                  {recipe.image_url ? (
                    <Image
                      src={recipe.image_url}
                      alt={recipe.title}
                      fill
                      sizes="80px"
                      priority={priority}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  )}
                </div>
              </Link>
              {/* Heart overlay */}
              <div className="absolute top-1 right-1">
                <FavoriteButton 
                  recipeId={recipe.id}
                  size="sm"
                  className="bg-opacity-90 hover:bg-opacity-100 shadow-sm"
                />
              </div>
            </div>

            {/* Content - takes remaining space */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/recipes/${recipe.slug}`} className="flex-1">
                  <h3 className="font-semibold text-gray-900 hover:text-teal-600 text-sm leading-tight">
                    {recipe.title}
                  </h3>
                </Link>
                
                {showAlmostMatch && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    Almost match
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {recipe.ingredients.map(ingredient => 
                      ingredient.ingredient?.name || 'Unknown'
                    ).join(', ')}
                  </p>
                </div>
              )}

              {/* Recipe meta info stacked */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-3 text-xs text-gray-500">
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {recipe.average_rating ? (
                      <>
                        <div className="flex">
                          {renderStars(Math.round(recipe.average_rating))}
                        </div>
                        <span>({recipe.total_ratings})</span>
                      </>
                    ) : (
                      <span>No ratings</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {renderEatingMethodIcons(recipe, 'sm')}
                    <span 
                      className="text-sm cursor-default" 
                      title={`Messiness level: ${recipe.messiness_level}`}
                    >
                      {FILTER_ICONS.messiness_level[recipe.messiness_level]}
                    </span>
                    {hasFreezerInstructions(recipe) && (
                      <span 
                        className="text-sm cursor-default" 
                        title="Freezer-friendly"
                      >
                        {FILTER_ICONS.special.freezer_friendly}
                      </span>
                    )}
                    {Boolean(recipe.is_food_processor_friendly) && (
                      <span 
                        className="text-sm cursor-default" 
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
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
          <div className="flex items-center gap-1">
            {renderEatingMethodIcons(recipe, 'md')}
          </div>
          <span 
            className="text-lg cursor-default" 
            title={`Messiness level: ${recipe.messiness_level}`}
          >
            {FILTER_ICONS.messiness_level[recipe.messiness_level]}
          </span>
          {hasFreezerInstructions(recipe) && (
            <span 
              className="text-lg cursor-default" 
              title="Freezer-friendly"
            >
              {FILTER_ICONS.special.freezer_friendly}
            </span>
          )}
          {Boolean(recipe.is_food_processor_friendly) && (
            <span 
              className="text-lg cursor-default" 
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
            <Tooltip content="Login to rate recipes" position="left">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex text-gray-400 hover:text-teal-600 transition-colors"
                aria-label="Rate recipe"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-3 w-3" />
                ))}
              </button>
            </Tooltip>
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