import { Recipe } from '@/types'

interface JsonLdProps {
  recipe?: Recipe
  type?: 'website' | 'recipe'
}

export default function JsonLd({ recipe, type = 'website' }: JsonLdProps) {
  if (type === 'recipe' && recipe) {
    const recipeData = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": recipe.title,
      "description": recipe.description || recipe.title,
      "image": recipe.image_url || "/default-recipe-image.jpg",
      "author": {
        "@type": "Organization",
        "name": "Korean Baby Meals"
      },
      "datePublished": recipe.created_at,
      "prepTime": recipe.prep_time ? `PT${recipe.prep_time}M` : undefined,
      "cookTime": recipe.cook_time ? `PT${recipe.cook_time}M` : undefined,
      "totalTime": recipe.total_time ? `PT${recipe.total_time}M` : undefined,
      "recipeYield": recipe.portions_toddler || recipe.servings,
      "recipeCategory": "Toddler Food",
      "recipeCuisine": "Korean",
      "keywords": [
        "korean baby food",
        "toddler recipe",
        recipe.eating_method.replace('_', ' '),
        recipe.is_freezer_friendly ? "freezer friendly" : null,
        recipe.is_food_processor_friendly ? "food processor friendly" : null
      ].filter(Boolean),
      "nutrition": {
        "@type": "NutritionInformation",
        "description": "Suitable for toddlers 12+ months"
      },
      "recipeIngredient": recipe.ingredients?.map(ing => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.ingredient.name}`.trim()
      ) || [],
      "recipeInstructions": recipe.instructions.split('\n').filter(step => step.trim()).map((step, index) => ({
        "@type": "HowToStep",
        "text": step.trim(),
        "position": index + 1
      })),
      "aggregateRating": recipe.average_rating && recipe.total_ratings ? {
        "@type": "AggregateRating",
        "ratingValue": recipe.average_rating,
        "reviewCount": recipe.total_ratings,
        "bestRating": 5,
        "worstRating": 1
      } : undefined
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeData, null, 2)
        }}
      />
    )
  }

  // Website schema for homepage
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Korean Baby Meals",
    "description": "Find Korean and Asian toddler recipes (12+ months) by searching ingredients in your pantry. Practical filters for eating method, messiness level, and batch cooking.",
    "url": "https://koreanbabymeals.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://koreanbabymeals.com/search?ingredients={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Korean Baby Meals",
      "url": "https://koreanbabymeals.com"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData, null, 2)
      }}
    />
  )
}