import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchAndFilter from '@/components/client/SearchAndFilter'
import { RecipeServerService } from '@/lib/recipes-server'
import { parseSearchParams, generateSearchTitle, generateSearchDescription } from '@/lib/search-params'

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const urlParams = new URLSearchParams()
  
  // Convert searchParams to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      const stringValue = Array.isArray(value) ? value.join(',') : value
      urlParams.set(key, stringValue)
    }
  })

  const { ingredients, filters } = parseSearchParams(urlParams)
  
  const title = generateSearchTitle(ingredients, filters)
  const description = generateSearchDescription(ingredients, filters)

  // Build canonical URL
  const canonicalParams = new URLSearchParams()
  if (ingredients.length > 0) {
    canonicalParams.set('ingredients', ingredients.join(','))
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        canonicalParams.set(key, value.join(','))
      } else {
        canonicalParams.set(key, value.toString())
      }
    }
  })
  
  const canonicalUrl = `https://koreanbabymeals.com/search${canonicalParams.toString() ? `?${canonicalParams.toString()}` : ''}`

  return {
    title: `${title} | Korean Baby Meals`,
    description,
    openGraph: {
      title: `${title} | Korean Baby Meals`,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Korean Baby Meals',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Korean Baby Meals`,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams
  const urlParams = new URLSearchParams()
  
  // Convert searchParams to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      const stringValue = Array.isArray(value) ? value.join(',') : value
      urlParams.set(key, stringValue)
    }
  })

  const { ingredients, filters, viewMode, limit, offset } = parseSearchParams(urlParams)
  
  // Server-side search
  const searchResults = await RecipeServerService.searchRecipes(ingredients, filters, limit, offset)
  
  // Generate structured data for search results
  const searchStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: generateSearchTitle(ingredients, filters),
    description: generateSearchDescription(ingredients, filters),
    url: `https://koreanbabymeals.com/search?${urlParams.toString()}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: searchResults.total_count,
      itemListElement: searchResults.recipes.slice(0, 5).map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Recipe',
          name: recipe.title,
          url: `https://koreanbabymeals.com/recipes/${recipe.slug}`,
          description: recipe.description || `Korean baby-friendly recipe: ${recipe.title}`,
        }
      }))
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchStructuredData),
        }}
      />

      <div className="min-h-screen bg-sand-100 flex flex-col">
        <Header />
        
        {/* Breadcrumb */}
        <div className="bg-sand-200 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-teal-600 hover:text-teal-700">
                    Home
                  </Link>
                </li>
                <li className="text-gray-500">›</li>
                <li className="text-gray-900 font-medium">Search Results</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <p className="text-gray-600">
              {generateSearchDescription(ingredients, filters)}
            </p>
          </div>

          <SearchAndFilter 
            initialRecipes={searchResults.recipes}
            initialTotalCount={searchResults.total_count}
            initialAlmostMatches={searchResults.almost_matches}
            initialIngredients={ingredients}
            initialFilters={filters}
            initialViewMode={viewMode}
            isSearchPage={true}
          />
        </main>
        
        <Footer />
      </div>
    </>
  )
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    }>
      <SearchResults {...props} />
    </Suspense>
  )
}