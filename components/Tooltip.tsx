'use client'

import { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({ children, content, className = '', position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [actualPosition, setActualPosition] = useState(position)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current
      const trigger = triggerRef.current
      const triggerRect = trigger.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      
      const padding = 8
      const arrowSize = 8
      
      let top = 0
      let left = 0
      let newPosition = position
      
      // Calculate initial position based on preference
      if (position === 'top') {
        top = triggerRect.top - tooltipRect.height - arrowSize
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      } else if (position === 'bottom') {
        top = triggerRect.bottom + arrowSize
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      } else if (position === 'left') {
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left - tooltipRect.width - arrowSize
      } else if (position === 'right') {
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.right + arrowSize
      }
      
      // Check boundaries and adjust
      if (top < padding) {
        newPosition = 'bottom'
        top = triggerRect.bottom + arrowSize
      } else if (top + tooltipRect.height > window.innerHeight - padding) {
        newPosition = 'top'
        top = triggerRect.top - tooltipRect.height - arrowSize
      }
      
      if (left < padding) {
        left = padding
      } else if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding
      }
      
      // Ensure tooltip doesn't go off screen vertically after horizontal adjustments
      if (top < padding) {
        top = padding
      } else if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding
      }
      
      setCoords({ top, left })
      setActualPosition(newPosition)
    }
  }, [isVisible, position])

  const getArrowClasses = () => {
    const base = "absolute w-2 h-2 bg-gray-800 transform rotate-45"
    switch (actualPosition) {
      case 'top':
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`
      case 'bottom':
        return `${base} -top-1 left-1/2 -translate-x-1/2`
      case 'left':
        return `${base} -right-1 top-1/2 -translate-y-1/2`
      case 'right':
        return `${base} -left-1 top-1/2 -translate-y-1/2`
      default:
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`
    }
  }

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-xs text-white bg-gray-800 rounded-md whitespace-nowrap ${className}`}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  )
}