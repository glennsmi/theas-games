import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { getLocalConsent, onConsentChange } from '@/services/cookieConsentService'
import { User } from 'firebase/auth'

interface AnalyticsConsentManagerProps {
  user?: User | null
  children: React.ReactNode
}

/**
 * Manages PostHog consent based on cookie preferences.
 * Works with the PostHogProvider from posthog-js/react.
 */
export function AnalyticsConsentManager({ user, children }: AnalyticsConsentManagerProps) {
  const posthog = usePostHog()

  // Check initial consent state and subscribe to changes
  useEffect(() => {
    if (!posthog) return

    // Check initial consent state
    const consent = getLocalConsent()
    if (consent?.analytics) {
      posthog.opt_in_capturing()
      if (import.meta.env.DEV) {
        console.log('[PostHog] Tracking enabled (user has analytics consent)')
      }
    } else {
      posthog.opt_out_capturing()
      if (import.meta.env.DEV) {
        console.log('[PostHog] Tracking disabled (no analytics consent)')
      }
    }

    // Listen for consent changes
    const unsubscribe = onConsentChange((newConsent) => {
      if (newConsent.analytics) {
        posthog.opt_in_capturing()
        if (import.meta.env.DEV) {
          console.log('[PostHog] Tracking enabled (consent granted)')
        }
      } else {
        posthog.opt_out_capturing()
        if (import.meta.env.DEV) {
          console.log('[PostHog] Tracking disabled (consent revoked)')
        }
      }
    })

    return unsubscribe
  }, [posthog])

  // Identify user when they log in
  useEffect(() => {
    if (!posthog) return

    const consent = getLocalConsent()
    if (!consent?.analytics) return

    if (user) {
      posthog.identify(user.uid, {
        email: user.email,
        name: user.displayName,
        created_at: user.metadata.creationTime,
      })
      if (import.meta.env.DEV) {
        console.log('[PostHog] User identified:', user.uid)
      }
    } else {
      posthog.reset()
    }
  }, [user, posthog])

  return <>{children}</>
}

// Re-export usePostHog for convenience
export { usePostHog } from 'posthog-js/react'
