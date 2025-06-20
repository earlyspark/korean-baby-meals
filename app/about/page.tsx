import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sand-100">
      {/* Header */}
      <header className="bg-sand-500 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            ← Back to search
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-sand-200 rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            About Korean Baby Meals
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-6">
              Making Korean and Asian toddler meals simple, practical, and delicious for busy parents.
            </p>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Our Mission
                </h2>
                <p className="text-gray-600">
                  We believe that introducing toddlers to Korean and Asian flavors should be accessible and stress-free. 
                  Our ingredient-based search helps you create nutritious, age-appropriate meals using what you already 
                  have in your pantry.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Why Korean Baby Meals?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🤏 Practical Filters</h3>
                    <p className="text-gray-600">
                      Filter by eating method, messiness level, and special features like freezer-friendly 
                      and food processor-friendly recipes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🥘 Batch Cooking Focus</h3>
                    <p className="text-gray-600">
                      All recipes are designed with busy parents in mind, emphasizing batch cooking 
                      and easy meal prep.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🔍 Smart Search</h3>
                    <p className="text-gray-600">
                      Find recipes by entering ingredients you have on hand. No more wondering 
                      &quot;what can I make with this?&quot;
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🧊 Storage Guidance</h3>
                    <p className="text-gray-600">
                      Every recipe includes practical storage and reheating instructions for 
                      maximum convenience.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Perfect for Toddlers 12+ Months
                </h2>
                <p className="text-gray-600 mb-3">
                  All our recipes are specifically designed for toddlers 12 months and older, with:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Age-appropriate textures and flavors</li>
                  <li>Reduced sodium and sugar content</li>
                  <li>Finger foods and utensil-friendly options</li>
                  <li>Nutritious ingredients that support growth</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Recipe Sources & Philosophy
                </h2>
                <p className="text-gray-600 mb-3">
                  Our recipes are carefully adapted from traditional Korean and Asian dishes, 
                  modified to be toddler-friendly while maintaining authentic flavors. We focus on:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Simple preparation methods</li>
                  <li>Readily available ingredients</li>
                  <li>Food processor-friendly techniques</li>
                  <li>Practical portion sizes</li>
                </ul>
              </section>

              <section className="bg-sand-100 p-4 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Get Started
                </h2>
                <p className="text-gray-600 mb-3">
                  Ready to discover delicious Korean toddler meals? Start by searching for ingredients 
                  you have in your kitchen, or browse by our practical filters.
                </p>
                <Link 
                  href="/" 
                  className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Start Searching Recipes →
                </Link>
              </section>
            </div>
          </div>
        </div>

        {/* Sponsor/Affiliate Content Area */}
        <div className="mt-6 bg-sand-200 rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Recommended Products
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🥘</div>
              <h3 className="font-medium text-gray-900 mb-2">Food Processor</h3>
              <p className="text-sm text-gray-600">
                Essential for batch prep and toddler-friendly textures
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🧊</div>
              <h3 className="font-medium text-gray-900 mb-2">Freezer Containers</h3>
              <p className="text-sm text-gray-600">
                Perfect for storing batch-cooked meals
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🍽️</div>
              <h3 className="font-medium text-gray-900 mb-2">Toddler Plates</h3>
              <p className="text-sm text-gray-600">
                Sectioned plates for organized meals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}