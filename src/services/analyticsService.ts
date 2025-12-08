import posthog from 'posthog-js'
import { getLocalConsent } from './cookieConsentService'

// Check if analytics tracking is allowed
export function isAnalyticsEnabled(): boolean {
  const consent = getLocalConsent()
  return consent?.analytics === true
}

// Generic track function with consent check
export function track(eventName: string, properties?: Record<string, any>): void {
  if (!isAnalyticsEnabled()) {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Event blocked (no consent): ${eventName}`, properties)
    }
    return
  }
  
  posthog.capture(eventName, properties)
  
  if (import.meta.env.DEV) {
    console.log(`[Analytics] Event tracked: ${eventName}`, properties)
  }
}

// Identify user (for logged-in users)
export function identifyUser(userId: string, traits?: Record<string, any>): void {
  if (!isAnalyticsEnabled()) return
  
  posthog.identify(userId, traits)
  
  if (import.meta.env.DEV) {
    console.log(`[Analytics] User identified: ${userId}`, traits)
  }
}

// Reset user (on logout)
export function resetUser(): void {
  posthog.reset()
  
  if (import.meta.env.DEV) {
    console.log('[Analytics] User reset')
  }
}

// Enable tracking (when user consents)
export function enableTracking(): void {
  posthog.opt_in_capturing()
  
  if (import.meta.env.DEV) {
    console.log('[Analytics] Tracking enabled')
  }
}

// Disable tracking (when user declines or withdraws consent)
export function disableTracking(): void {
  posthog.opt_out_capturing()
  
  if (import.meta.env.DEV) {
    console.log('[Analytics] Tracking disabled')
  }
}

// ============================================
// Page View Events
// ============================================

export function trackPageView(path: string, title?: string): void {
  track('$pageview', {
    $current_url: window.location.href,
    $pathname: path,
    title: title || document.title,
  })
}

// ============================================
// Authentication Events
// ============================================

export type AuthMethod = 'google' | 'email' | 'magic_link'

export function trackSignUp(method: AuthMethod): void {
  track('user_signed_up', { method })
}

export function trackSignIn(method: AuthMethod): void {
  track('user_signed_in', { method })
}

export function trackSignOut(): void {
  track('user_signed_out')
  resetUser()
}

// ============================================
// Game Events
// ============================================

export type GameName = 'ocean_dash' | 'pollution_patrol' | 'simple_match'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameStartProperties {
  game_name: GameName
  difficulty?: Difficulty
  child_id?: string
}

export interface GameEndProperties {
  game_name: GameName
  difficulty?: Difficulty
  score?: number
  distance?: number
  pearls?: number
  babies_reunited?: number
  duration_seconds?: number
  child_id?: string
}

export function trackGameStarted(properties: GameStartProperties): void {
  track('game_started', {
    ...properties,
    timestamp: new Date().toISOString(),
  })
}

export function trackGameEnded(properties: GameEndProperties): void {
  track('game_ended', {
    ...properties,
    timestamp: new Date().toISOString(),
  })
}

export function trackDifficultyChanged(
  gameName: GameName,
  fromDifficulty: Difficulty,
  toDifficulty: Difficulty
): void {
  track('game_difficulty_changed', {
    game_name: gameName,
    from_difficulty: fromDifficulty,
    to_difficulty: toDifficulty,
  })
}

export function trackFullscreenToggled(gameName: GameName, isFullscreen: boolean): void {
  track('game_fullscreen_toggled', {
    game_name: gameName,
    is_fullscreen: isFullscreen,
  })
}

// ============================================
// Subscription Events
// ============================================

export function trackSubscriptionPageViewed(isLoggedIn: boolean): void {
  track('subscription_page_viewed', { is_logged_in: isLoggedIn })
}

export function trackPremiumContentBlocked(featureName: string, fromPage: string): void {
  track('premium_content_blocked', {
    feature_name: featureName,
    from_page: fromPage,
  })
}

export function trackUpgradeCtaClicked(fromPage: string, featureBlocked?: string): void {
  track('upgrade_cta_clicked', {
    from_page: fromPage,
    feature_blocked: featureBlocked,
  })
}

// ============================================
// Character Events
// ============================================

export function trackCharacterCreated(childId?: string): void {
  track('character_created', { child_id: childId })
}

export function trackChildProfileCreated(childId: string): void {
  track('child_profile_created', { child_id: childId })
}

// ============================================
// Cookie Consent Events
// ============================================

export function trackCookieConsentGiven(
  essential: boolean,
  functional: boolean,
  analytics: boolean
): void {
  // This event is tracked regardless of analytics consent
  // since it's about the consent itself
  posthog.capture('cookie_consent_given', {
    essential,
    functional,
    analytics,
  })
}
