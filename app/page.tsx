import { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchAndFilter from '@/components/client/SearchAndFilter'
import { RecipeServerService } from '@/lib/recipes-server'

// Generate metadata for home page
export const metadata: Metadata = {
  title: 'Korean Baby Meals | Healthy Korean Recipes for Babies & Toddlers',
  description: 'Quick, nutritious meal ideas for babies and toddlers — search ingredients in your pantry, and find batch-friendly recipes and freezer-ready options for busy parents. Vibe-coded by a working mom.',
  keywords: 'Korean baby food, toddler recipes, baby-led weaning, Korean cuisine, healthy baby meals, Korean cooking for kids',
  openGraph: {
    title: 'Korean Baby Meals | Healthy Korean Recipes for Babies & Toddlers',
    description: 'Quick, nutritious meal ideas for babies and toddlers — search ingredients in your pantry, and find batch-friendly recipes and freezer-ready options for busy parents. Vibe-coded by a working mom.',
    type: 'website',
    url: 'https://koreanbabymeals.com',
    siteName: 'Korean Baby Meals',
    images: [
      {
        url: '/og-logo.png',
        width: 1200,
        height: 630,
        alt: 'Korean Baby Meals - Healthy recipes for babies and toddlers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Baby Meals | Healthy Korean Recipes for Babies & Toddlers',
    description: 'Quick, nutritious meal ideas for babies and toddlers — search ingredients in your pantry, and find batch-friendly recipes and freezer-ready options for busy parents. Vibe-coded by a working mom.',
    images: ['/og-logo.png'],
  },
  alternates: {
    canonical: 'https://koreanbabymeals.com',
  },
}

export default async function Home() {
  // Server-side data fetching for initial recipes
  const { recipes: initialRecipes, total_count } = await RecipeServerService.getInitialRecipes(20)

  // Generate structured data for the website
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Korean Baby Meals',
    description: 'Healthy Korean recipes for babies and toddlers',
    url: 'https://koreanbabymeals.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://koreanbabymeals.com/?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Korean Baby Meals',
      description: 'Providing healthy Korean recipes for babies and toddlers'
    }
  }

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Korean Baby Meals',
    description: 'Healthy Korean recipes for babies and toddlers',
    url: 'https://koreanbabymeals.com',
    logo: 'https://koreanbabymeals.com/logo.png',
    sameAs: [
      // Add social media URLs when available
    ]
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />

      <div className="min-h-screen bg-sand-100 flex flex-col">
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Find the Perfect Recipe
            </h2>
            <p className="text-gray-600">
              Search by ingredients you have on hand, or browse by eating method and messiness level.
              {total_count > 0 && ` We have ${total_count} recipes to choose from!`}
            </p>
          </div>

          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
            <SearchAndFilter 
              initialRecipes={initialRecipes}
              initialTotalCount={total_count}
            />
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </>
  )
}