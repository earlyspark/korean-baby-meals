'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search } from 'lucide-react'

interface Ingredient {
  id: number
  name: string
}

interface IngredientSearchProps {
  selectedIngredients: string[]
  onIngredientsChange: (ingredients: string[]) => void
}

export default function IngredientSearch({ selectedIngredients, onIngredientsChange }: IngredientSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Ingredient[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchIngredients = async () => {
      if (query.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search/ingredients?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSuggestions(data.ingredients || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Failed to search ingredients:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchIngredients, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      onIngredientsChange([...selectedIngredients, ingredient])
    }
    setQuery('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(selectedIngredients.filter(i => i !== ingredient))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault()
      addIngredient(suggestions[0].name)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search (e.g., chicken, rice)"
            className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 text-xs"
          />
        </div>

        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-sand-200 border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 text-center text-gray-700">Searching...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((ingredient) => (
                <button
                  key={ingredient.id}
                  onClick={() => addIngredient(ingredient.name)}
                  className="w-full text-left px-4 py-2 hover:bg-sand-200 first:rounded-t-lg last:rounded-b-lg"
                  disabled={selectedIngredients.includes(ingredient.name)}
                >
                  <span className={`text-sm ${selectedIngredients.includes(ingredient.name) ? 'text-gray-500' : 'text-gray-800'}`}>
                    {ingredient.name}
                  </span>
                  {selectedIngredients.includes(ingredient.name) && (
                    <span className="text-xs text-gray-400 ml-2">(already selected)</span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-gray-700 text-sm">No ingredients found</div>
            )}
          </div>
        )}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="ml-2 hover:text-teal-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}