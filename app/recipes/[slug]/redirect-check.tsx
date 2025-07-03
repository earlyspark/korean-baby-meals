'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectCheckProps {
  currentSlug: string;
}

// Client-side redirect check for production compatibility
export default function RedirectCheck({ currentSlug }: RedirectCheckProps) {
  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const response = await fetch(`/api/redirects/check?slug=${currentSlug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.redirect && data.newSlug) {
            // Use replace to maintain 301-like behavior
            window.location.replace(`/recipes/${data.newSlug}`);
          }
        }
      } catch (error) {
        // Silently fail - page will load normally
        console.error('Redirect check failed:', error);
      }
    };

    // Only run redirect check in production where middleware might fail
    if (process.env.NODE_ENV === 'production') {
      checkRedirect();
    }
  }, [currentSlug, router]);

  return null; // This component renders nothing
}