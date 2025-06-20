'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  return (
    <header className="bg-sand-500 shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="block hover:opacity-90" aria-label="Korean Baby Meals - Home">
            <h1 className="sr-only">Korean Baby Meals</h1>
            <img src="/kbm_logo.svg" alt="" className="h-20 w-auto" aria-hidden="true" />
          </Link>
          <nav className="flex space-x-4">
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}