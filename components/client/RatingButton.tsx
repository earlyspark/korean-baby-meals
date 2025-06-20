'use client'

import { Star } from 'lucide-react'

interface RatingButtonProps {
  recipeId: number
  currentRating?: number
  showTooltip?: boolean
}

export default function RatingButton({ 
  recipeId, 
  currentRating = 0,
  showTooltip = false 
}: RatingButtonProps) {
  if (showTooltip) {
    return (
      <div className="relative group flex">
        <a
          href="/login"
          className="flex text-gray-300 hover:text-teal-600 transition-colors"
          title="Login to rate recipes"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-5 w-5" />
          ))}
        </a>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Login to rate
        </div>
      </div>
    )
  }

  return (
    <a
      href="/login"
      className="flex text-gray-300 hover:text-teal-600 transition-colors"
      title="Login to rate recipes"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-5 w-5" />
      ))}
    </a>
  )
}