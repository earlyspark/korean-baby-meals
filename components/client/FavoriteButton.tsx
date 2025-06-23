'use client'

import { Heart } from 'lucide-react'
import Tooltip from '../Tooltip'

interface FavoriteButtonProps {
  recipeId: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export default function FavoriteButton({ 
  className = '', 
  size = 'md'
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }

  const paddingClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-2'
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const button = (
    <button
      onClick={handleClick}
      className={`${paddingClasses[size]} bg-sand-200 rounded-full shadow-lg hover:bg-sand-100 block ${className}`}
      aria-label="Add to favorites"
    >
      <Heart className={`${sizeClasses[size]} text-gray-400 hover:text-teal-600`} />
    </button>
  )

  return (
    <Tooltip content="Login to save favorites" position="bottom">
      {button}
    </Tooltip>
  )
}