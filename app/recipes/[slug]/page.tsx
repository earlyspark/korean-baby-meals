import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Recipe, FILTER_ICONS } from '@/types'
import { Star, Clock, Users, ChefHat, Hand, Utensils } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FavoriteButton from '@/components/client/FavoriteButton'
import RatingButton from '@/components/client/RatingButton'
import { RecipeServerService } from '@/lib/recipes-server'
import { SEOService } from '@/lib/seo'

// ISR configuration
export const revalidate = 3600 // Revalidate every hour

const hasFreezerInstructions = (recipe: Recipe) => {
  if (!recipe.storage_instructions) {
    return recipe.is_freezer_friendly
  }
  
  const freezeKeywords = ['freeze', 'freezer', 'frozen', 'freezing', 'unfreeze', 'defrost', 'thaw']
  const instructions = recipe.storage_instructions.toLowerCase()
  
  return freezeKeywords.some(keyword => instructions.includes(keyword))
}

const getStorageInstructions = (recipe: Recipe) => {
  if (recipe.storage_instructions) {
    return recipe.storage_instructions
  }
  
  if (recipe.is_freezer_friendly) {
    return "Can be frozen for up to 3 months. Thaw overnight in refrigerator before reheating."
  }
  
  return "Store in refrigerator for up to 3 days."
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${
        i < rating
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
      }`}
    />
  ))
}

const renderEatingMethodIcons = (recipe: Recipe) => {
  const icons = []
  
  if (recipe.is_finger_food) {
    icons.push(
      <span 
        key="finger"
        className="text-2xl cursor-default"
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
        className="text-2xl cursor-default"
        title="Utensils needed"
      >
        🍴
      </span>
    )
  }
  
  // Fallback to old system if new fields are not set
  if (icons.length === 0 && recipe.eating_method) {
    icons.push(
      <span key="fallback" className="text-2xl" title={`Eating method: ${recipe.eating_method.replace('_', ' ')}`}>
        {FILTER_ICONS.eating_method[recipe.eating_method]}
      </span>
    )
  }
  
  return icons
}

// Disable static generation to prevent old slugs from bypassing middleware
// This ensures all recipe requests go through middleware for redirect checking
export async function generateStaticParams() {
  return [] // Return empty array to disable static generation
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const awaitedParams = await params
  const recipe = await RecipeServerService.getRecipeBySlug(awaitedParams.slug)
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found | Korean Baby Meals',
      description: 'The recipe you are looking for could not be found.'
    }
  }

  const openGraphTags = SEOService.generateOpenGraphTags(recipe)
  const metaDescription = SEOService.generateMetaDescription(recipe)

  return {
    title: `${recipe.title} | Korean Baby Meals`,
    description: metaDescription,
    openGraph: {
      title: openGraphTags['og:title'],
      description: openGraphTags['og:description'],
      type: 'article',
      images: [
        {
          url: openGraphTags['og:image'],
          alt: openGraphTags['og:image:alt'],
        },
      ],
      siteName: openGraphTags['og:site_name'],
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTags['twitter:title'],
      description: openGraphTags['twitter:description'],
      images: [openGraphTags['twitter:image']],
    },
  }
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params
  const recipe = await RecipeServerService.getRecipeBySlug(awaitedParams.slug)

  if (!recipe) {
    notFound()
  }

  // Generate structured data
  const recipeStructuredData = SEOService.generateRecipeStructuredData(recipe)
  const breadcrumbStructuredData = SEOService.generateBreadcrumbStructuredData(recipe)

  return (
    <>
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="min-h-screen bg-sand-100 flex flex-col">
        <Header />
        
        {/* Breadcrumb */}
        <div className="bg-sand-200 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-teal-600 hover:text-teal-700">
                    Home
                  </Link>
                </li>
                <li className="text-gray-500">›</li>
                <li>
                  <Link href="/" className="text-teal-600 hover:text-teal-700">
                    Recipes
                  </Link>
                </li>
                <li className="text-gray-500">›</li>
                <li className="text-gray-900 font-medium">{recipe.title}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="bg-sand-200 rounded-lg shadow-sm overflow-hidden">
            {/* Recipe Header */}
            <div className="relative">
              {recipe.image_url ? (
                <div className="h-64 md:h-80 relative">
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-64 md:h-80 bg-sand-300 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <FavoriteButton 
                  recipeId={recipe.id} 
                  size="lg"
                />
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {recipe.title}
                </h1>
                
                {recipe.description && (
                  <p className="text-gray-600 text-lg mb-4">
                    {recipe.description}
                  </p>
                )}

                {/* Recipe Meta */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  {recipe.prep_time && (
                    <div className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      <span>Prep: {recipe.prep_time}min</span>
                    </div>
                  )}
                  {recipe.cook_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Cook: {recipe.cook_time}min</span>
                    </div>
                  )}
                  {recipe.portions_toddler && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.portions_toddler} toddler portions</span>
                    </div>
                  )}
                </div>

                {/* Filter Icons */}
                <div className="flex items-center gap-2 mb-4">
                  {renderEatingMethodIcons(recipe)}
                  <span 
                    className="text-2xl cursor-default" 
                    title={`Messiness level: ${recipe.messiness_level}`}
                  >
                    {FILTER_ICONS.messiness_level[recipe.messiness_level]}
                  </span>
                  {hasFreezerInstructions(recipe) && (
                    <span 
                      className="text-2xl cursor-default" 
                      title="Freezer-friendly"
                    >
                      {FILTER_ICONS.special.freezer_friendly}
                    </span>
                  )}
                  {recipe.is_food_processor_friendly && (
                    <span 
                      className="text-2xl cursor-default" 
                      title="Food processor-friendly"
                    >
                      {FILTER_ICONS.special.food_processor_friendly}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-4 pb-3 border-b">
                  {/* Desktop: side-by-side layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(Math.round(recipe.average_rating || 0))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {recipe.average_rating 
                          ? `${recipe.average_rating.toFixed(1)} (${recipe.total_ratings} reviews)`
                          : 'No ratings yet'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rate this recipe:</span>
                      <RatingButton 
                        recipeId={recipe.id}
                        currentRating={recipe.user_rating || 0}
                        showTooltip={true}
                      />
                    </div>
                  </div>

                  {/* Mobile: side-by-side with wrapping */}
                  <div className="sm:hidden flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-start mb-1">
                        {renderStars(Math.round(recipe.average_rating || 0))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {recipe.average_rating 
                          ? `${recipe.average_rating.toFixed(1)} (${recipe.total_ratings} reviews)`
                          : 'No ratings yet'
                        }
                      </span>
                    </div>
                    
                    <div className="flex-1 text-right">
                      <div className="text-sm text-gray-600 mb-1">Rate this recipe:</div>
                      <div className="flex justify-end">
                        <RatingButton 
                          recipeId={recipe.id}
                          currentRating={recipe.user_rating || 0}
                          showTooltip={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Ingredients */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ingredients
                  </h2>
                  <ul className="space-y-2">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? 
                      recipe.ingredients.map((ingredient, index) => (
                        <li 
                          key={index} 
                          className={`flex items-start gap-2 ${
                            ingredient.is_optional ? 'text-gray-600' : 'text-gray-800'
                          }`}
                        >
                          <span className="text-teal-500 leading-6">•</span>
                          <span className="leading-6">
                            {ingredient.amount && ingredient.unit && (
                              <strong className="text-gray-800">{ingredient.amount} {ingredient.unit} </strong>
                            )}
                            <span className="text-gray-800">
                              {ingredient.ingredient_name || ingredient.ingredient?.name || 'Unknown ingredient'}
                            </span>
                            {Boolean(ingredient.is_optional) && <span className="text-gray-600"> (optional)</span>}
                            {ingredient.notes && (
                              <span className="text-gray-600"> - {ingredient.notes}</span>
                            )}
                          </span>
                        </li>
                      )) : (
                        <li className="text-gray-600">No ingredients listed</li>
                      )
                    }
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Instructions
                  </h2>
                  <ol className="space-y-2">
                    {recipe.instructions.split('\n')
                      .map(step => step.trim())
                      .filter(step => step.length > 0)
                      .map((step, index) => {
                        // Remove existing numbering if present
                        const cleanStep = step.replace(/^\d+\.\s*/, '')
                        
                        return (
                          <li key={index} className="flex items-start gap-2">
                            <span className="font-medium text-teal-600 leading-6">
                              {index + 1}.
                            </span>
                            <span className="text-gray-800 leading-6 flex-1">
                              {cleanStep}
                            </span>
                          </li>
                        )
                      })}
                  </ol>
                </div>
              </div>

              {/* Storage & Reheating */}
              <div className="mt-6 pt-4 border-t">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      🧊 Storage Instructions
                    </h3>
                    <p className="text-gray-600">{getStorageInstructions(recipe)}</p>
                  </div>
                  
                  {recipe.reheating_instructions && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        🔥 Reheating Instructions
                      </h3>
                      <p className="text-gray-600">{recipe.reheating_instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}