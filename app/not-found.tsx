import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">😞</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recipe Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The recipe you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Browse All Recipes
            </Link>
            <p className="text-sm text-gray-500">
              or <Link href="/" className="text-teal-600 hover:text-teal-700">search for something specific</Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}