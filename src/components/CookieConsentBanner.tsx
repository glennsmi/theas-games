import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import {
  hasConsentChoice,
  acceptAndSyncConsent,
  saveAndSyncCustomConsent,
  getLocalConsent,
} from '@/services/cookieConsentService'

interface CookieConsentBannerProps {
  user: User | null
}

export default function CookieConsentBanner({ user }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [functional, setFunctional] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user has already made a consent choice
    if (!hasConsentChoice()) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Load existing preferences for settings panel
      const consent = getLocalConsent()
      if (consent) {
        setFunctional(consent.functional)
        setAnalytics(consent.analytics)
      }
    }
  }, [])

  const handleAcceptAll = async () => {
    setIsSubmitting(true)
    try {
      await acceptAndSyncConsent(user, true)
      setShowBanner(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEssentialOnly = async () => {
    setIsSubmitting(true)
    try {
      await acceptAndSyncConsent(user, false)
      setShowBanner(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSubmitting(true)
    try {
      await saveAndSyncCustomConsent(user, functional, analytics)
      setShowBanner(false)
      setShowSettings(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark-navy/30 backdrop-blur-sm pointer-events-auto"
        onClick={() => {}} // Prevent closing by clicking backdrop
      />
      
      {/* Banner */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border-2 border-pale-aqua overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        {/* Decorative wave top */}
        <div className="h-2 bg-gradient-to-r from-light-teal via-medium-purple to-bright-coral" />
        
        <div className="p-6 md:p-8">
          {!showSettings ? (
            // Main Banner View
            <>
              <div className="flex items-start gap-4 mb-6">
                <span className="text-5xl">🍪</span>
                <div>
                  <h2 className="text-2xl font-bold text-dark-navy mb-2">
                    Ahoy, Ocean Explorer! 🌊
                  </h2>
                  <p className="text-dark-navy/80">
                    Welcome to Thea's Games! We use cookies to make your underwater adventure even better. 
                    They help us remember your preferences and understand how to improve our games.
                    <Link 
                      to="/cookie-policy" 
                      className="text-bright-coral hover:text-sandy-coral font-medium ml-1"
                    >
                      Learn more about our cookies 🦀
                    </Link>
                  </p>
                </div>
              </div>

              {/* Cookie Types Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-light-teal/10 rounded-lg p-3 border border-light-teal/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span>⚓</span>
                    <span className="font-bold text-dark-navy text-sm">Essential</span>
                    <span className="text-xs bg-light-teal/30 text-dark-navy px-2 py-0.5 rounded-full">Always On</span>
                  </div>
                  <p className="text-xs text-dark-navy/70">Required for the website to work properly</p>
                </div>
                <div className="bg-medium-purple/10 rounded-lg p-3 border border-medium-purple/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🐬</span>
                    <span className="font-bold text-dark-navy text-sm">Functional</span>
                  </div>
                  <p className="text-xs text-dark-navy/70">Remembers your game preferences</p>
                </div>
                <div className="bg-sandy-coral/10 rounded-lg p-3 border border-sandy-coral/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🦀</span>
                    <span className="font-bold text-dark-navy text-sm">Analytics</span>
                  </div>
                  <p className="text-xs text-dark-navy/70">Helps us improve our games</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="border-medium-teal text-medium-teal hover:bg-medium-teal hover:text-white"
                >
                  Customize Cookies
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEssentialOnly}
                  disabled={isSubmitting}
                  className="border-dark-navy/30 text-dark-navy/70 hover:bg-dark-navy/10"
                >
                  Essential Only
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  disabled={isSubmitting}
                  className="bg-bright-coral hover:bg-sandy-coral text-white font-bold px-8"
                >
                  {isSubmitting ? '🌊 Saving...' : '🎉 Accept All Cookies'}
                </Button>
              </div>
            </>
          ) : (
            // Settings View
            <>
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-dark-navy hover:text-medium-teal transition-colors"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-dark-navy">Cookie Settings</h2>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential - Always On */}
                <div className="bg-light-teal/10 rounded-xl p-4 border border-light-teal/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚓</span>
                      <div>
                        <h3 className="font-bold text-dark-navy">Essential Cookies</h3>
                        <p className="text-sm text-dark-navy/70">Required for the website to function</p>
                      </div>
                    </div>
                    <div className="bg-light-teal/30 text-dark-navy text-sm px-3 py-1 rounded-full font-medium">
                      Always On
                    </div>
                  </div>
                </div>

                {/* Functional */}
                <div className="bg-medium-purple/10 rounded-xl p-4 border border-medium-purple/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🐬</span>
                      <div>
                        <h3 className="font-bold text-dark-navy">Functional Cookies</h3>
                        <p className="text-sm text-dark-navy/70">Remember your preferences and settings</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functional}
                        onChange={(e) => setFunctional(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medium-purple/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medium-purple"></div>
                    </label>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-sandy-coral/10 rounded-xl p-4 border border-sandy-coral/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🦀</span>
                      <div>
                        <h3 className="font-bold text-dark-navy">Analytics Cookies</h3>
                        <p className="text-sm text-dark-navy/70">Help us understand how you use our games</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sandy-coral/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sandy-coral"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="border-dark-navy/30 text-dark-navy/70"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSubmitting}
                  className="bg-medium-teal hover:bg-light-teal text-white font-bold px-8"
                >
                  {isSubmitting ? '🌊 Saving...' : '💾 Save Preferences'}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Fun footer */}
        <div className="bg-ice-aqua/50 px-6 py-3 border-t border-pale-aqua">
          <p className="text-xs text-dark-navy/60 text-center">
            🐠 We respect your privacy! Read our{' '}
            <Link to="/privacy-policy" className="text-bright-coral hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/cookie-policy" className="text-bright-coral hover:underline">
              Cookie Policy
            </Link>{' '}
            to learn more.
          </p>
        </div>
      </div>
    </div>
  )
}
