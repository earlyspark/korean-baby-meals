'use client'

import { Star } from 'lucide-react'
import Tooltip from '../Tooltip'

interface RatingButtonProps {
  recipeId: number
  currentRating?: number
  showTooltip?: boolean
}

export default function RatingButton({ recipeId, currentRating = 0, showTooltip = false }: RatingButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const stars = (
    <button
      onClick={handleClick}
      className="flex text-gray-300 hover:text-teal-600 transition-colors"
      aria-label="Rate recipe"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-5 w-5" />
      ))}
    </button>
  )

  return (
    <Tooltip content="Login to rate recipes">
      {stars}
    </Tooltip>
  )
}