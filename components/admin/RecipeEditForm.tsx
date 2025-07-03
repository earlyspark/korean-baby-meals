'use client';

import { useState } from 'react';
import { Recipe } from '@/types';

interface RecipeEditFormProps {
  recipe: Recipe;
}

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function RecipeEditForm({ recipe }: RecipeEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [customSlug, setCustomSlug] = useState('');
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate what the new slug would be
  const newSlug = useCustomSlug ? customSlug : generateSlug(title);
  const slugChanged = newSlug !== recipe.slug;
  const titleChanged = title !== recipe.title;
  const hasChanges = titleChanged || slugChanged;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      setMessage({ type: 'error', text: 'No changes to save.' });
      return;
    }

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Recipe title is required.' });
      return;
    }

    if (!newSlug.trim()) {
      setMessage({ type: 'error', text: 'Recipe URL slug is required.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/recipes/${recipe.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: newSlug.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update recipe');
      }

      setMessage({ 
        type: 'success', 
        text: `Recipe updated successfully! ${slugChanged ? 'Old URL will redirect to new URL.' : ''}` 
      });
      setIsEditing(false);
      
      // Reload page after successful update to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error updating recipe:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update recipe' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(recipe.title);
    setCustomSlug('');
    setUseCustomSlug(false);
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="px-6 py-4">
      {!isEditing ? (
        // View Mode
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {recipe.title}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-700">
              <span>/recipes/{recipe.slug}</span>
              <span className="mx-2">•</span>
              <span>Last updated: {new Date(recipe.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
            <a
              href={`/recipes/${recipe.slug}`}
              target="_blank"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View
            </a>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-sand-600 hover:bg-sand-700"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`title-${recipe.id}`} className="block text-sm font-medium text-gray-900 mb-1">
              Recipe Title
            </label>
            <input
              type="text"
              id={`title-${recipe.id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-sand-500 focus:border-sand-500 text-gray-900"
              placeholder="Enter recipe title"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-900">
                URL Slug
              </label>
              <label className="flex items-center text-sm text-gray-900 font-medium">
                <input
                  type="checkbox"
                  checked={useCustomSlug}
                  onChange={(e) => setUseCustomSlug(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-sand-600 focus:ring-sand-500"
                />
                Custom slug
              </label>
            </div>
            
            {useCustomSlug ? (
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-sand-500 focus:border-sand-500 text-gray-900"
                placeholder="custom-url-slug"
                pattern="[a-z0-9-]+"
                title="Only lowercase letters, numbers, and hyphens"
              />
            ) : (
              <div className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                {generateSlug(title) || 'auto-generated-from-title'}
              </div>
            )}
            
            <p className="mt-1 text-sm text-gray-700">
              Full URL: /recipes/{newSlug || 'auto-generated-from-title'}
            </p>
          </div>

          {/* Preview Changes */}
          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Preview Changes</h4>
              <div className="text-sm text-blue-700 space-y-1">
                {titleChanged && (
                  <div>
                    <span className="font-medium">Title:</span> "{recipe.title}" → "{title}"
                  </div>
                )}
                {slugChanged && (
                  <div>
                    <span className="font-medium">URL:</span> /recipes/{recipe.slug} → /recipes/{newSlug}
                  </div>
                )}
                {slugChanged && (
                  <div className="mt-2 p-2 bg-blue-100 rounded">
                    <span className="font-medium">🔄 Redirect:</span> The old URL will automatically redirect to the new URL with a 301 redirect to preserve SEO.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`border rounded-md p-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex">
                <svg 
                  className={`w-5 h-5 flex-shrink-0 ${
                    message.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  {message.type === 'success' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                <span className="ml-2 text-sm">{message.text}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sand-600 hover:bg-sand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}