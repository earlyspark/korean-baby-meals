'use client';

import { useState, useRef, useEffect } from 'react';
import { Recipe } from '@/types';

interface RecipeEditFormProps {
  recipe: Recipe;
}

export default function RecipeEditForm({ recipe }: RecipeEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if title has changed
  const titleChanged = title !== recipe.title;
  const hasChanges = titleChanged;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Recipe title is required.' });
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
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update recipe');
      }

      setMessage({ 
        type: 'success', 
        text: 'Recipe title updated successfully!' 
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
    setIsEditing(false);
    setMessage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {!isEditing ? (
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {recipe.title}
            </h3>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-lg font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-sand-500 focus:border-sand-500 w-full max-w-md"
              disabled={isLoading}
            />
          )}
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
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-sand-600 hover:bg-sand-700"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-sand-600 hover:bg-sand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mt-3 border rounded-md p-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            <svg 
              className={`w-4 h-4 flex-shrink-0 ${
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
    </div>
  );
}