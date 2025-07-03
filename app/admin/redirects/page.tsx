import { getConnection } from '@/lib/db';

interface RedirectData {
  id: number;
  old_slug: string;
  new_slug: string;
  recipe_id: number;
  recipe_title: string;
  created_at: string;
}

// Admin redirects management page
export default async function AdminRedirects() {
  let redirects: RedirectData[] = [];
  let error: string | null = null;

  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    try {
      // Get all redirects with recipe information
      const [redirectRows] = await connection.execute(`
        SELECT 
          rr.id,
          rr.old_slug,
          rr.new_slug,
          rr.recipe_id,
          rr.created_at,
          r.title as recipe_title
        FROM recipe_redirects rr
        JOIN recipes r ON rr.recipe_id = r.id
        ORDER BY rr.created_at DESC
      `);

      redirects = redirectRows as RedirectData[];

    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error loading redirects:', err);
    error = 'Failed to load redirects. Please check the database connection.';
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">URL Redirects</h1>
          <p className="mt-2 text-gray-900">
            Monitor and manage 301 redirects created when recipe URLs change
          </p>
        </div>
        <div className="text-sm text-gray-900">
          {redirects.length} redirects active
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Redirects</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">How Redirects Work</h3>
            <div className="mt-2 text-sm text-gray-900">
              <p className="mb-2">
                When a recipe URL changes, the system automatically creates a 301 redirect to preserve SEO and user bookmarks:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Old URLs continue to work</strong> - Users and search engines are automatically redirected</li>
                <li><strong>SEO rankings preserved</strong> - Search engines transfer authority to the new URL</li>
                <li><strong>Bookmarks remain functional</strong> - Saved links redirect to the correct recipe</li>
                <li><strong>Permanent redirects</strong> - 301 status tells browsers and search engines the move is permanent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Redirects Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Redirects</h2>
          <p className="text-sm text-gray-900">All URL redirects created by recipe updates</p>
        </div>

        {redirects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Old URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    New URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {redirects.map((redirect) => (
                  <tr key={redirect.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {redirect.recipe_title}
                      </div>
                      <div className="text-sm text-gray-700">
                        ID: {redirect.recipe_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-mono">
                        /recipes/{redirect.old_slug}
                      </div>
                      <div className="text-xs text-red-600">
                        ← Old (redirects from here)
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-mono">
                        /recipes/{redirect.new_slug}
                      </div>
                      <div className="text-xs text-green-600">
                        → New (redirects to here)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(redirect.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a
                        href={`/recipes/${redirect.old_slug}`}
                        target="_blank"
                        className="text-turquoise-600 hover:text-turquoise-900"
                        title="Test old URL (should redirect)"
                      >
                        Test
                      </a>
                      <span className="text-gray-600">|</span>
                      <a
                        href={`/recipes/${redirect.new_slug}`}
                        target="_blank"
                        className="text-sand-600 hover:text-sand-900"
                        title="View current recipe"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Redirects Yet</h3>
            <p className="text-gray-600 mb-4">
              Redirects are automatically created when you change recipe titles through the admin interface.
            </p>
            <a
              href="/admin/recipes"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sand-600 hover:bg-sand-700"
            >
              Manage Recipes
            </a>
          </div>
        )}
      </div>

      {/* Statistics */}
      {redirects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-turquoise-100 rounded-lg">
                <svg className="w-6 h-6 text-turquoise-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Total Redirects</p>
                <p className="text-2xl font-bold text-gray-900">{redirects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">SEO Protected</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Latest Redirect</p>
                <p className="text-lg font-bold text-gray-900">
                  {redirects.length > 0 
                    ? new Date(redirects[0].created_at).toLocaleDateString()
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Technical Details</h3>
        <div className="text-sm text-gray-900 space-y-2">
          <p>
            • All redirects use HTTP 301 status code (permanent redirect)
          </p>
          <p>
            • Redirects are handled at the middleware level for optimal performance
          </p>
          <p>
            • Search engines will transfer page authority from old URLs to new URLs
          </p>
          <p>
            • Query parameters are preserved during redirects
          </p>
          <p>
            • Redirects are automatically created when recipe slugs change
          </p>
        </div>
      </div>
    </div>
  );
}