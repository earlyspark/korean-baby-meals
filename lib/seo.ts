import { Recipe } from '@/types'

export interface RecipeStructuredData {
  '@context': string
  '@type': string
  name: string
  description?: string
  image?: string[]
  author: {
    '@type': string
    name: string
  }
  datePublished?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  recipeCategory?: string
  recipeCuisine: string
  recipeYield?: string
  nutrition?: {
    '@type': string
    calories?: string
  }
  recipeIngredient?: string[]
  recipeInstructions?: Array<{
    '@type': string
    text: string
  }>
  aggregateRating?: {
    '@type': string
    ratingValue: number
    reviewCount: number
  }
}

export class SEOService {
  /**
   * Generate Recipe JSON-LD structured data for Google rich snippets
   */
  static generateRecipeStructuredData(recipe: Recipe): RecipeStructuredData {
    const structuredData: RecipeStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      description: recipe.description || `Korean baby-friendly recipe: ${recipe.title}`,
      author: {
        '@type': 'Organization',
        name: 'Korean Baby Meals'
      },
      recipeCuisine: 'Korean',
      recipeCategory: 'Baby Food'
    }

    // Add image if available
    if (recipe.image_url) {
      structuredData.image = [recipe.image_url]
    }

    // Add timing information
    if (recipe.prep_time) {
      structuredData.prepTime = `PT${recipe.prep_time}M`
    }
    if (recipe.cook_time) {
      structuredData.cookTime = `PT${recipe.cook_time}M`
    }
    if (recipe.total_time) {
      structuredData.totalTime = `PT${recipe.total_time}M`
    }

    // Add yield/portions
    if (recipe.portions_toddler) {
      structuredData.recipeYield = `${recipe.portions_toddler} toddler portions`
    }

    // Add publication date
    if (recipe.created_at) {
      structuredData.datePublished = new Date(recipe.created_at).toISOString()
    }

    // Add ingredients
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      structuredData.recipeIngredient = recipe.ingredients.map(ingredient => {
        let ingredientText = ''
        if (ingredient.amount && ingredient.unit) {
          ingredientText += `${ingredient.amount} ${ingredient.unit} `
        }
        ingredientText += ingredient.ingredient_name || ingredient.ingredient?.name || 'Unknown ingredient'
        if (ingredient.notes) {
          ingredientText += ` (${ingredient.notes})`
        }
        return ingredientText
      })
    }

    // Add instructions
    if (recipe.instructions) {
      const steps = recipe.instructions.split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 0)
        .map(step => step.replace(/^\d+\.\s*/, ''))

      structuredData.recipeInstructions = steps.map(step => ({
        '@type': 'HowToStep',
        text: step
      }))
    }

    // Add rating if available
    if (recipe.average_rating && recipe.total_ratings && recipe.total_ratings > 0) {
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: recipe.average_rating,
        reviewCount: recipe.total_ratings
      }
    }

    return structuredData
  }

  /**
   * Generate meta description for recipe
   */
  static generateMetaDescription(recipe: Recipe): string {
    if (recipe.description) {
      return recipe.description.length > 155 
        ? recipe.description.substring(0, 152) + '...'
        : recipe.description
    }

    let description = `Korean baby-friendly recipe for ${recipe.title}.`
    
    if (recipe.total_time) {
      description += ` Ready in ${recipe.total_time} minutes.`
    }
    
    if (recipe.eating_method) {
      const method = recipe.eating_method.replace('_', ' ')
      description += ` Perfect for ${method}.`
    }

    return description.length > 155 
      ? description.substring(0, 152) + '...'
      : description
  }

  /**
   * Generate Open Graph tags for social sharing
   */
  static generateOpenGraphTags(recipe: Recipe) {
    const baseUrl = 'https://koreanbabymeals.com'
    const imageUrl = recipe.image_url 
      ? (recipe.image_url.startsWith('http') ? recipe.image_url : `${baseUrl}${recipe.image_url}`)
      : `${baseUrl}/og-logo.png`
    
    return {
      'og:title': `${recipe.title} | Korean Baby Meals`,
      'og:description': this.generateMetaDescription(recipe),
      'og:type': 'article',
      'og:image': imageUrl,
      'og:image:alt': recipe.title,
      'og:site_name': 'Korean Baby Meals',
      'twitter:card': 'summary_large_image',
      'twitter:title': `${recipe.title} | Korean Baby Meals`,
      'twitter:description': this.generateMetaDescription(recipe),
      'twitter:image': imageUrl
    }
  }

  /**
   * Generate breadcrumb structured data
   */
  static generateBreadcrumbStructuredData(recipe: Recipe) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://koreanbabymeals.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Recipes',
          item: 'https://koreanbabymeals.com'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: recipe.title,
          item: `https://koreanbabymeals.com/recipes/${recipe.slug}`
        }
      ]
    }
  }
}