'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Recipes', href: '/admin/recipes', icon: '📝' },
  { name: 'Redirects', href: '/admin/redirects', icon: '🔄' },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-3 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-sand-500 text-sand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2" role="img" aria-label={item.name}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}