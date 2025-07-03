import { Metadata } from 'next';
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

export default function AdminLayout({ children }: AdminLayoutProps) {
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