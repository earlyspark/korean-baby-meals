'use client'

import { X } from 'lucide-react'
import Link from 'next/link'

interface AuthPromptProps {
  isOpen: boolean
  onClose: () => void
  action: string // e.g., "favorite this recipe", "rate recipes"
}

export default function AuthPrompt({ isOpen, onClose, action }: AuthPromptProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-sand-200 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Account Required
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-teal-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Please create an account or log in to {action}.
        </p>
        
        <div className="flex gap-3">
          <Link
            href="/login"
            className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 text-center font-medium"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-sand-200 text-center font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}