// PostHog Configuration
// https://posthog.com/docs/libraries/react

export const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY || ''
export const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com'

// PostHog initialization options
export const posthogOptions = {
  api_host: POSTHOG_HOST,
  // Disable automatic pageview capture - we'll handle it manually with React Router
  capture_pageview: false,
  // Disable automatic pageleave capture
  capture_pageleave: false,
  // Respect Do Not Track browser setting
  respect_dnt: true,
  // Disable session recording by default (can be enabled if needed)
  disable_session_recording: true,
  // Persistence setting
  persistence: 'localStorage+cookie' as const,
  // Bootstrap with opt-out until consent is given
  opt_out_capturing_by_default: true,
}

// Check if PostHog is properly configured
export const isPostHogConfigured = (): boolean => {
  return Boolean(POSTHOG_KEY && POSTHOG_KEY.startsWith('phc_'))
}
