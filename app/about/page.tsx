import Link from 'next/link'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About | Korean Baby Meals',
  description: "Hi, I'm earlyspark — a new mom trying to figure out what to feed my baby now that she can eat almost anything. Korean Baby Meals is for busy caregivers who want to feed their kids diverse, healthy food without spending hours researching.",
  openGraph: {
    type: "website",
    url: "https://koreanbabymeals.com/about",
    title: 'About | Korean Baby Meals',
    description: "Hi, I'm earlyspark — a new mom trying to figure out what to feed my baby now that she can eat almost anything. Korean Baby Meals is for busy caregivers who want to feed their kids diverse, healthy food without spending hours researching.",
    images: [
      {
        url: "/og-logo.png",
        width: 1200,
        height: 630,
        alt: "Korean Baby Meals - About the Creator"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'About | Korean Baby Meals',
    description: "Hi, I'm earlyspark — a new mom trying to figure out what to feed my baby now that she can eat almost anything. Korean Baby Meals is for busy caregivers who want to feed their kids diverse, healthy food without spending hours researching.",
    images: ["/og-logo.png"],
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                I built this site in three nights using AI because I was tired of endlessly scrolling Instagram and Pinterest just to figure out what to make with half a zucchini and some leftover rice. Who has time for that?? Also, I wanted my baby to grow up eating Korean food and being proud of this part of her heritage, never feeling like she has to set it aside to fit in.
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
                If you find a recipe helpful, please rate it when/if I ever build out a Login page; or use my affiliate links below when you shop. That small support helps keep me going.
              </p>

              <p>
                Thanks for being here 💛
              </p>
            </div>

            <section className="bg-sand-100 p-4 rounded-lg mt-6">
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

        {/* Sponsor/Affiliate Content Area */}
        <div className="mt-6 bg-sand-200 rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Recommended Products
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            These are the essential tools I recommend for making baby meals. As an Amazon Associate, I earn from qualifying purchases.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="https://amzn.to/4k7zIYO" 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="mb-3">
                <img 
                  src="https://m.media-amazon.com/images/I/717pxFuArxL._AC_SX522_.jpg" 
                  alt="Souper Cubes Silicone Freezer Molds"
                  className="w-full h-32 object-contain mx-auto"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Souper Cubes Silicone Freezer Molds</h3>
              <p className="text-xs text-gray-600">
                Perfect for freezing soups, sauces, and purees in baby-sized portions. Food-safe silicone makes removal easy.
              </p>
            </a>
            <a 
              href="https://amzn.to/46e8k7U" 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="mb-3">
                <img 
                  src="https://m.media-amazon.com/images/I/61svDANdIoL._AC_SX569_.jpg" 
                  alt="doddl Toddler Utensils"
                  className="w-full h-32 object-contain mx-auto"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2 text-sm">doddl Toddler Utensils</h3>
              <p className="text-xs text-gray-600">
                Ergonomically designed stainless steel silverware perfect for small hands learning to self-feed.
              </p>
            </a>
            <a 
              href="https://amzn.to/3Tp3hu5" 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="mb-3">
                <img 
                  src="https://m.media-amazon.com/images/I/7179+5MT4OL._AC_SX569_.jpg" 
                  alt="KitchenAid 13-Cup Food Processor"
                  className="w-full h-32 object-contain mx-auto"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2 text-sm">KitchenAid 13-Cup Food Processor</h3>
              <p className="text-xs text-gray-600">
                Essential for batch prep and creating toddler-friendly textures. All-in-one storage keeps blades organized.
              </p>
            </a>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="mt-6 bg-sand-200 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Privacy Policy
          </h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Information We Collect</h3>
              <p>
                We use Google Analytics to understand how visitors use our site. This may include your IP address, browser type, pages visited, and time spent on pages. No personally identifiable information is collected unless you choose to contact me.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">How We Use Information</h3>
              <p>
                We use analytics data to improve our website, understand which recipes are most helpful, and create better content for families. We never sell or share your data with third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cookies</h3>
              <p>
                Our site uses cookies from Google Analytics to track site usage. You can disable cookies in your browser settings, though some site features may not work properly.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Affiliate Links</h3>
              <p>
                Korean Baby Meals participates in the Amazon Associates Program. When you click on product links and make a purchase, we may earn a small commission at no extra cost to you. This helps support the site.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Third-Party Services</h3>
              <p>
                We use Google Analytics (Google Inc.) for website analytics. Google's privacy policy applies to their data collection: {' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                  https://policies.google.com/privacy
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Your Rights</h3>
              <p>
                You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on or by enabling "Do Not Track" in your browser.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
              <p>
                If you have questions about this privacy policy, please contact me through{' '}
                <a 
                  href="https://www.linkedin.com/in/rayanastanek/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  LinkedIn
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Policy Updates</h3>
              <p>
                This privacy policy may be updated occasionally. Changes will be posted on this page with the updated date.
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-300">
              Last updated: June 22, 2025
            </p>
          </div>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  )
}