'use client'

import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  recipeId: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export default function FavoriteButton({ 
  recipeId, 
  className = '', 
  size = 'md',
  showTooltip = false 
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

  if (showTooltip) {
    return (
      <div className="relative group">
        <a
          href="/login"
          className={`${paddingClasses[size]} bg-sand-200 rounded-full shadow-lg hover:bg-sand-100 block ${className}`}
          title="Login to favorite recipes"
        >
          <Heart className={`${sizeClasses[size]} text-gray-400 hover:text-teal-600`} />
        </a>
        <div className="absolute top-full right-0 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          Login to favorite
        </div>
      </div>
    )
  }

  return (
    <a
      href="/login"
      className={`${paddingClasses[size]} bg-sand-200 rounded-full shadow-lg hover:bg-sand-100 block ${className}`}
      title="Login to favorite recipes"
    >
      <Heart className={`${sizeClasses[size]} text-gray-400 hover:text-teal-600`} />
    </a>
  )
}