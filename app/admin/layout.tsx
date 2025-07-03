import { Metadata } from 'next';
import { headers } from 'next/headers';
import AdminNavigation from '@/components/admin/AdminNavigation';

export const metadata: Metadata = {
  title: 'Admin - Korean Baby Meals',
  description: 'Administrative interface for Korean Baby Meals',
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Validate credentials
  const headersList = headers();
  const authorization = headersList.get('authorization');
  
  // If no authorization header (shouldn't happen due to middleware)
  if (!authorization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Required</h1>
          <p className="text-gray-600">Please refresh and enter your credentials.</p>
        </div>
      </div>
    );
  }
  
  // Process the authorization header
  const [scheme, encoded] = authorization.split(' ') || [];
  
  if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString();
      const colonIndex = decoded.indexOf(':');
      const username = decoded.substring(0, colonIndex);
      const password = decoded.substring(colonIndex + 1);
      
      const validUsername = process.env.ADMIN_USERNAME;
      const validPassword = process.env.ADMIN_PASSWORD;
      
      if (!validUsername || !validPassword || username !== validUsername || password !== validPassword) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
              <p className="text-gray-600">Invalid username or password.</p>
            </div>
          </div>
        );
      }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Korean Baby Meals Admin
              </h1>
              <p className="text-sm text-gray-600">
                Administrative interface for recipe management
              </p>
            </div>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-sand-600 text-white rounded-lg hover:bg-sand-700 transition-colors"
            >
              ← Back to Site
            </a>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <AdminNavigation />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-gray-500 text-center">
            Korean Baby Meals Admin Panel - Protected Area
          </p>
        </div>
      </footer>
    </div>
  );
}