'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IngredientSearch from '@/components/IngredientSearch'
import FilterPanel from '@/components/FilterPanel'  
import RecipeGrid from '@/components/RecipeGrid'
import { SearchFilters, Recipe, SearchResults } from '@/types'
import { buildSearchParams } from '@/lib/search-params'

interface SearchAndFilterProps {
  initialRecipes: Recipe[]
  initialTotalCount: number
  initialAlmostMatches?: Recipe[]
  initialIngredients?: string[]
  initialFilters?: SearchFilters
  initialViewMode?: 'grid' | 'list'
  isSearchPage?: boolean
}

export default function SearchAndFilter({ 
  initialRecipes, 
  initialTotalCount, 
  initialAlmostMatches = [],
  initialIngredients = [],
  initialFilters = {},
  initialViewMode = 'grid',
  isSearchPage = false
}: SearchAndFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(initialIngredients)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [searchResults, setSearchResults] = useState<SearchResults>({
    recipes: initialRecipes,
    almost_matches: initialAlmostMatches,
    total_count: initialTotalCount,
    has_more: initialRecipes.length < initialTotalCount
  })
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(initialRecipes)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [offset, setOffset] = useState(initialRecipes.length)
  const [hasSearched, setHasSearched] = useState(initialIngredients.length > 0 || Object.keys(initialFilters).length > 0)

  // Debounced URL update function
  const updateURL = useCallback((
    ingredients: string[], 
    currentFilters: SearchFilters, 
    currentViewMode: 'grid' | 'list'
  ) => {
    const hasActiveSearch = ingredients.length > 0 || Object.values(currentFilters).some(v => v !== undefined)
    
    if (!isSearchPage && hasActiveSearch) {
      // Redirect to search page if on home page and filters are applied
      const params = buildSearchParams({
        ingredients,
        filters: currentFilters,
        viewMode: currentViewMode
      })
      router.push(`/search?${params.toString()}`)
    } else if (isSearchPage) {
      // Update URL on search page
      const params = buildSearchParams({
        ingredients,
        filters: currentFilters,
        viewMode: currentViewMode
      })
      const newUrl = params.toString() ? `/search?${params.toString()}` : '/search'
      router.replace(newUrl)
    }
  }, [router, isSearchPage])


  const loadMoreRecipes = async () => {
    if (isLoading || !searchResults.has_more) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/recipes?limit=20&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to load more recipes')
      
      const data = await response.json()
      setAllRecipes(prev => [...prev, ...data.recipes])
      setSearchResults(prev => ({
        ...prev,
        recipes: [...prev.recipes, ...data.recipes],
        has_more: data.recipes.length === 20
      }))
      setOffset(prev => prev + data.recipes.length)
    } catch (error) {
      console.error('Error loading more recipes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchRecipes = async () => {
    const hasActiveFilters = selectedIngredients.length > 0 || Object.values(filters).some(value => value !== undefined)
    
    if (!hasActiveFilters) {
      // Load all recipes when no filters are active
      setIsLoading(true)
      setHasSearched(false)
      
      try {
        const response = await fetch('/api/recipes?limit=20')
        if (!response.ok) throw new Error('Failed to load recipes')
        
        const data = await response.json()
        setAllRecipes(data.recipes)
        setSearchResults({
          recipes: data.recipes,
          almost_matches: [],
          total_count: data.total_count,
          has_more: data.recipes.length < data.total_count
        })
        setOffset(data.recipes.length)
      } catch (error) {
        console.error('Error loading recipes:', error)
        setSearchResults({
          recipes: [],
          almost_matches: [],
          total_count: 0,
          has_more: false
        })
      } finally {
        setIsLoading(false)
      }
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    
    try {
      const params = new URLSearchParams()
      if (selectedIngredients.length > 0) {
        params.append('ingredients', selectedIngredients.join(','))
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','))
          } else {
            // Map new boolean field names to API parameter names
            const paramName = key === 'is_finger_food' ? 'finger_food' :
                             key === 'is_utensil_food' ? 'utensil_food' : key
            params.append(paramName, value.toString())
          }
        }
      })

      const response = await fetch(`/api/search/recipes?${params.toString()}`)
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults({
        recipes: [],
        almost_matches: [],
        total_count: 0,
        has_more: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search and URL update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRecipes()
      updateURL(selectedIngredients, filters, viewMode)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [selectedIngredients, filters, viewMode, updateURL])

  // Handle view mode changes immediately (no debounce needed)
  const handleViewModeChange = useCallback((newViewMode: 'grid' | 'list') => {
    setViewMode(newViewMode)
    updateURL(selectedIngredients, filters, newViewMode)
  }, [selectedIngredients, filters, updateURL])

  const clearAllFilters = () => {
    setSelectedIngredients([])
    setFilters({})
    // Let the useEffect trigger searchRecipes which will load all recipes
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-sand-200 rounded-lg p-4 sticky top-4">
          <IngredientSearch
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
          />
          
          <div className="mt-6">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              selectedIngredients={selectedIngredients}
              onClearAll={clearAllFilters}
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <RecipeGrid
          searchResults={searchResults}
          isLoading={isLoading}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onLoadMore={hasSearched ? undefined : loadMoreRecipes}
        />
      </div>
    </div>
  )
}