import { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Star, Search, Bookmark } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Login - Coming Soon | Korean Baby Meals',
  description: 'Login functionality coming soon to save favorites, rate recipes, and more!',
  robots: {
    index: false,
    follow: true,
  }
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background pattern/decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-6xl">🍽️</div>
          <div className="absolute top-40 right-32 text-4xl">👶</div>
          <div className="absolute bottom-40 left-32 text-5xl">🥕</div>
          <div className="absolute bottom-20 right-20 text-4xl">🍚</div>
          <div className="absolute top-60 left-1/2 text-3xl">🥒</div>
          <div className="absolute bottom-60 right-1/3 text-4xl">🐟</div>
        </div>

        <div className="max-w-md w-full mx-4 relative z-10">
          {/* Faded background login form mockup */}
          <div className="bg-white rounded-lg shadow-lg p-8 opacity-40 absolute inset-0 transform rotate-1 scale-105">
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-teal-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>

          {/* Main content */}
          <div className="bg-white rounded-lg shadow-lg p-8 relative z-20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Coming Soon... Maybe 🤔
              </h1>
              <p className="text-gray-600">
                Login functionality is in the works! Here's what you'll be able to do:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-lg">
                <Heart className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <span className="text-gray-700">Save your favorite recipes for easy access</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-lg">
                <Search className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <span className="text-gray-700">Search through your personal recipe collection</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-lg">
                <Star className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <span className="text-gray-700">Rate recipes and see personalized recommendations</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-lg">
                <Bookmark className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <span className="text-gray-700">Access new recipes as they're added to the collection</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                More recipes are coming soon! For now, enjoy browsing our current Korean toddler recipes.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                ← Back to Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}