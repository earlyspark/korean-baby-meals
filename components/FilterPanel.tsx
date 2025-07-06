'use client'

import { SearchFilters, MessinessLevel, FILTER_ICONS } from '@/types'
import { HelpCircle } from 'lucide-react'
import Tooltip from './Tooltip'

interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  selectedIngredients?: string[]
  onClearAll?: () => void
}

export default function FilterPanel({ filters, onFiltersChange, selectedIngredients = [], onClearAll }: FilterPanelProps) {
  const updateFilter = (key: keyof SearchFilters, value: boolean | MessinessLevel[] | undefined) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleBooleanFilter = (key: 'is_finger_food' | 'is_utensil_food' | 'is_freezer_friendly' | 'is_food_processor_friendly') => {
    const currentValue = filters[key]
    updateFilter(key, currentValue ? undefined : true)
  }

  const toggleMessinessLevel = (level: MessinessLevel) => {
    const currentLevels = filters.messiness_level || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(item => item !== level)
      : [...currentLevels, level]
    
    updateFilter('messiness_level', newLevels.length > 0 ? newLevels : undefined)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
          Eating Method
          <Tooltip content="How your toddler will eat this food">
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </h3>
        <div className="space-y-2">
          <label htmlFor="filter-finger-food" className="flex items-center cursor-pointer group">
            <input
              id="filter-finger-food"
              name="finger_food"
              type="checkbox"
              checked={filters.is_finger_food || false}
              onChange={() => toggleBooleanFilter('is_finger_food')}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-lg group-hover:scale-110 transition-transform">✋</span>
            <span className="ml-2 text-sm text-gray-700">Finger Foods</span>
            {filters.is_finger_food && (
              <span className="ml-auto text-xs text-teal-600 font-medium">Active</span>
            )}
          </label>

          <label htmlFor="filter-utensil-food" className="flex items-center cursor-pointer group">
            <input
              id="filter-utensil-food"
              name="utensil_food"
              type="checkbox"
              checked={filters.is_utensil_food || false}
              onChange={() => toggleBooleanFilter('is_utensil_food')}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-lg group-hover:scale-110 transition-transform">🍴</span>
            <span className="ml-2 text-sm text-gray-700">Utensils</span>
            {filters.is_utensil_food && (
              <span className="ml-auto text-xs text-teal-600 font-medium">Active</span>
            )}
          </label>
        </div>
        
        {/* Show helpful message when both eating methods are selected */}
        {filters.is_finger_food && filters.is_utensil_food && (
          <div className="mt-2 p-2 bg-teal-50 border border-teal-200 rounded text-xs text-teal-700">
            ✓ Showing recipes that work as both finger foods and with utensils
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
          Messiness Level
          <Tooltip content="Mess factor when eating">
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </h3>
        <div className="space-y-2">
          {Object.entries(FILTER_ICONS.messiness_level).map(([level, icon]) => (
            <label key={level} htmlFor={`filter-messiness-${level}`} className="flex items-center cursor-pointer">
              <input
                id={`filter-messiness-${level}`}
                name={`messiness_${level}`}
                type="checkbox"
                checked={filters.messiness_level?.includes(level as MessinessLevel) || false}
                onChange={() => toggleMessinessLevel(level as MessinessLevel)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2 text-lg">{icon}</span>
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Special Features</h3>
        <div className="space-y-2">
          <label htmlFor="filter-freezer-friendly" className="flex items-center cursor-pointer group">
            <input
              id="filter-freezer-friendly"
              name="freezer_friendly"
              type="checkbox"
              checked={filters.is_freezer_friendly || false}
              onChange={() => toggleBooleanFilter('is_freezer_friendly')}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-lg group-hover:scale-110 transition-transform">{FILTER_ICONS.special.freezer_friendly}</span>
            <span className="ml-2 text-sm text-gray-700">Freezer-Friendly</span>
          </label>

          <label htmlFor="filter-food-processor-friendly" className="flex items-center cursor-pointer group">
            <input
              id="filter-food-processor-friendly"
              name="food_processor_friendly"
              type="checkbox"
              checked={filters.is_food_processor_friendly || false}
              onChange={() => toggleBooleanFilter('is_food_processor_friendly')}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-lg">{FILTER_ICONS.special.food_processor_friendly}</span>
            <span className="ml-2 text-sm text-gray-700">Food Processor-Friendly</span>
          </label>

          <Tooltip content="Login to use favorites">
            <label htmlFor="filter-favorites-only" className="flex items-center cursor-pointer">
              <input
                id="filter-favorites-only"
                name="favorites_only"
                type="checkbox"
                checked={filters.favorites_only || false}
                onChange={(e) => e.preventDefault()}
                className="rounded border-gray-300 text-gray-400 focus:ring-gray-400 cursor-not-allowed"
                disabled={true}
              />
              <span className="ml-2 text-lg opacity-50">❤️</span>
              <span className="ml-2 text-sm text-gray-400">My Favorites Only</span>
            </label>
          </Tooltip>
        </div>
      </div>

      {(Object.values(filters).some(v => v !== undefined) || selectedIngredients.length > 0) && (
        <button
          onClick={onClearAll || (() => onFiltersChange({}))}
          className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-sand-300"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}