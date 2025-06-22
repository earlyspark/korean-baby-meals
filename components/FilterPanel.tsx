'use client'

import { SearchFilters, EatingMethod, MessinessLevel, FILTER_ICONS } from '@/types'
import { HelpCircle, Hand, Utensils } from 'lucide-react'
import Tooltip from './Tooltip'

interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  selectedIngredients?: string[]
  onClearAll?: () => void
}

export default function FilterPanel({ filters, onFiltersChange, selectedIngredients = [], onClearAll }: FilterPanelProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'eating_method' | 'messiness_level', value: string) => {
    const currentArray = filters[key] || []
    const newArray = currentArray.includes(value as any)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value as any]
    
    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Eating Method</h3>
        <div className="space-y-2">
          <label htmlFor="filter-finger-food" className="flex items-center cursor-pointer">
            <input
              id="filter-finger-food"
              name="finger_food"
              type="checkbox"
              checked={filters.is_finger_food || false}
              onChange={(e) => updateFilter('is_finger_food', e.target.checked ? true : undefined)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <Hand className="ml-2 w-5 h-5 text-gray-600" />
            <span className="ml-2 text-sm text-gray-700">Finger Foods</span>
          </label>

          <label htmlFor="filter-utensil-food" className="flex items-center cursor-pointer">
            <input
              id="filter-utensil-food"
              name="utensil_food"
              type="checkbox"
              checked={filters.is_utensil_food || false}
              onChange={(e) => updateFilter('is_utensil_food', e.target.checked ? true : undefined)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <Utensils className="ml-2 w-5 h-5 text-gray-600" />
            <span className="ml-2 text-sm text-gray-700">Utensils</span>
          </label>
        </div>
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
                onChange={() => toggleArrayFilter('messiness_level', level)}
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
          <label htmlFor="filter-freezer-friendly" className="flex items-center cursor-pointer">
            <input
              id="filter-freezer-friendly"
              name="freezer_friendly"
              type="checkbox"
              checked={filters.is_freezer_friendly || false}
              onChange={(e) => updateFilter('is_freezer_friendly', e.target.checked ? true : undefined)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-lg">{FILTER_ICONS.special.freezer_friendly}</span>
            <span className="ml-2 text-sm text-gray-700">Freezer-Friendly</span>
          </label>

          <label htmlFor="filter-food-processor-friendly" className="flex items-center cursor-pointer">
            <input
              id="filter-food-processor-friendly"
              name="food_processor_friendly"
              type="checkbox"
              checked={filters.is_food_processor_friendly || false}
              onChange={(e) => updateFilter('is_food_processor_friendly', e.target.checked ? true : undefined)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-lg">{FILTER_ICONS.special.food_processor_friendly}</span>
            <span className="ml-2 text-sm text-gray-700">Food Processor-Friendly</span>
          </label>

          <div className="relative group">
            <label htmlFor="filter-favorites-only" className="flex items-center cursor-pointer">
              <input
                id="filter-favorites-only"
                name="favorites_only"
                type="checkbox"
                checked={filters.favorites_only || false}
                onChange={(e) => updateFilter('favorites_only', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-gray-400 focus:ring-gray-400 cursor-not-allowed"
                disabled={true}
              />
              <span className="ml-2 text-lg opacity-50">❤️</span>
              <span className="ml-2 text-sm text-gray-400">My Favorites Only</span>
            </label>
            <div className="absolute left-0 top-full mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
              Login to use favorites
            </div>
          </div>
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