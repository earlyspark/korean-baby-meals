'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import RecipeEditForm from '@/components/admin/RecipeEditForm';

// Admin recipe management page
export default function AdminPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/recipes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
            <p className="mt-2 text-gray-900">Loading recipes...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
            <p className="mt-2 text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
          <p className="mt-2 text-gray-900">
            Manage and update recipe information
          </p>
        </div>
        <div className="text-sm text-gray-900">
          {recipes.length} recipes found
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
              <h3 className="text-sm font-medium text-red-800">Error Loading Recipes</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recipe List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Recipes</h2>
          <p className="text-sm text-gray-700">Click on a recipe to edit its title</p>
        </div>

        {recipes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <RecipeEditForm key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recipes Found</h3>
            <p className="text-gray-700">
              {error ? 'Unable to load recipes due to an error.' : 'No recipes are currently available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}