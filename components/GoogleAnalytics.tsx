'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

/**
 * WARNING: CRITICAL GDPR COMPLIANCE COMPONENT
 * 
 * This component handles BOTH cookie consent AND Google Analytics loading.
 * DO NOT bypass or remove this component - it is required for legal compliance.
 * 
 * Features:
 * - Shows cookie consent banner on first visit
 * - Stores user consent choice in localStorage
 * - Only loads Google Analytics AFTER user accepts cookies
 * - Prevents any tracking if user declines
 * 
 * NEVER load Google Analytics scripts directly in layout.tsx or elsewhere.
 * All analytics tracking MUST go through this consent component.
 */

const GA_ID = 'G-E084KJ54L3'

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    const storedConsent = localStorage.getItem('ga-consent')
    console.log('GA Debug: Stored consent:', storedConsent)
    console.log('GA Debug: GA_ID:', GA_ID)
    if (storedConsent) {
      setConsent(storedConsent === 'true')
    }
  }, [])

  const handleAccept = () => {
    console.log('GA Debug: User accepted cookies')
    setConsent(true)
    localStorage.setItem('ga-consent', 'true')
  }

  const handleDecline = () => {
    setConsent(false)
    localStorage.setItem('ga-consent', 'false')
  }

  if (!GA_ID) return null

  return (
    <>
      {consent === true && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
            onLoad={() => console.log('GA Debug: Google Analytics script loaded')}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              console.log('GA Debug: Initializing GA with ID: ${GA_ID}');
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
              console.log('GA Debug: GA configured');
            `}
          </Script>
        </>
      )}

      {consent === null && (
        <div className="fixed bottom-4 left-4 right-4 bg-sand-200 border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-3">
            We use cookies to improve your experience and analyze site usage. 
            You can opt out at any time.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1 bg-teal-500 text-white text-sm rounded hover:bg-teal-600">
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded hover:bg-sand-300"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  )
}