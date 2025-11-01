'use client'

import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    // Track page views (simple implementation)
    const trackPageView = () => {
      try {
        // You can integrate with analytics services like Google Analytics, Plausible, etc.
        // For now, we'll just log to console for development
        if (process.env.NODE_ENV === 'development') {
          console.log('Page view:', window.location.pathname)
        }

        // Example: Google Analytics 4
        // if (typeof gtag !== 'undefined') {
        //   gtag('config', 'GA_MEASUREMENT_ID', {
        //     page_path: window.location.pathname,
        //   })
        // }

        // Example: Plausible
        // if (typeof plausible !== 'undefined') {
        //   plausible('pageview')
        // }
      } catch (error) {
        console.error('Analytics error:', error)
      }
    }

    // Track initial page view
    trackPageView()

    // Track route changes (for client-side navigation)
    const handleRouteChange = () => {
      setTimeout(trackPageView, 100) // Small delay to ensure navigation is complete
    }

    // Add event listener for client-side navigation
    window.addEventListener('popstate', handleRouteChange)
    
    // Listen for navigation events (Next.js 13+)
    const originalPushState = history.pushState
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      handleRouteChange()
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null // This component doesn't render anything
}