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
            <div className="space-y-6 text-gray-600">
              <p>
                Hi, I&apos;m earlyspark — a new mom trying to figure out what to feed my baby now that she can eat almost anything. I want meals and snacks that are nutritious (not overly processed), that I can prep in batches and freeze, because I work full-time, don&apos;t live near family, and definitely can&apos;t afford a personal chef.
              </p>

              <p>
                I built this site in two nights using AI because I was tired of endlessly scrolling Instagram and Pinterest just to figure out what to make with half a zucchini and some leftover rice. Who has time for that??
              </p>

              <p>
                Korean Baby Meals is for busy caregivers who want to feed their kids diverse, healthy food without spending hours researching. It has practical filters I wish every recipe site had. If there&apos;s something else you wish the site could do — send me a message on{' '}
                <a 
                  href="https://www.linkedin.com/in/rayanastanek/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  LinkedIn
                </a>
                . I&apos;ll see if I can build it. If there&apos;s a parenting or meal-prep pain point you think software could solve, I want to hear about it. I&apos;ll try to vibe-code it into existence. I&apos;m here to use AI for good.
              </p>

              <p>
                If you find a recipe helpful, please rate it or use my affiliate links when you shop. That small support helps keep this site alive.
              </p>

              <p>
                Thanks for being here 💛
              </p>
            </div>

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