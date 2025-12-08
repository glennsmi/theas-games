import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { User } from 'firebase/auth'

export interface CookieConsent {
  essential: boolean // Always true - required for site to function
  functional: boolean
  analytics: boolean
  acceptedAt: Date | null
  version: string
}

const COOKIE_CONSENT_KEY = 'theas_games_cookie_consent'
const COOKIE_CONSENT_VERSION = '1.0'

// Callback type for consent changes
type ConsentChangeCallback = (consent: CookieConsent) => void

// Store consent change listeners
const consentChangeListeners: ConsentChangeCallback[] = []

// Register a callback for consent changes
export function onConsentChange(callback: ConsentChangeCallback): () => void {
  consentChangeListeners.push(callback)
  // Return unsubscribe function
  return () => {
    const index = consentChangeListeners.indexOf(callback)
    if (index > -1) {
      consentChangeListeners.splice(index, 1)
    }
  }
}

// Notify all listeners of consent change
function notifyConsentChange(consent: CookieConsent): void {
  consentChangeListeners.forEach(callback => {
    try {
      callback(consent)
    } catch (error) {
      console.error('Error in consent change callback:', error)
    }
  })
}

// Default consent state
export const defaultConsent: CookieConsent = {
  essential: true,
  functional: false,
  analytics: false,
  acceptedAt: null,
  version: COOKIE_CONSENT_VERSION,
}

// Get consent from localStorage
export function getLocalConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      const consent = JSON.parse(stored) as CookieConsent
      // Convert date string back to Date object
      if (consent.acceptedAt) {
        consent.acceptedAt = new Date(consent.acceptedAt)
      }
      return consent
    }
  } catch (error) {
    console.error('Error reading cookie consent from localStorage:', error)
  }
  return null
}

// Save consent to localStorage
export function saveLocalConsent(consent: CookieConsent): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    // Notify listeners of the change
    notifyConsentChange(consent)
  } catch (error) {
    console.error('Error saving cookie consent to localStorage:', error)
  }
}

// Check if user has made a consent choice
export function hasConsentChoice(): boolean {
  const consent = getLocalConsent()
  return consent !== null && consent.acceptedAt !== null
}

// Accept all cookies
export function acceptAllCookies(): CookieConsent {
  const consent: CookieConsent = {
    essential: true,
    functional: true,
    analytics: true,
    acceptedAt: new Date(),
    version: COOKIE_CONSENT_VERSION,
  }
  saveLocalConsent(consent)
  return consent
}

// Accept only essential cookies
export function acceptEssentialOnly(): CookieConsent {
  const consent: CookieConsent = {
    essential: true,
    functional: false,
    analytics: false,
    acceptedAt: new Date(),
    version: COOKIE_CONSENT_VERSION,
  }
  saveLocalConsent(consent)
  return consent
}

// Custom consent selection
export function saveCustomConsent(functional: boolean, analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    essential: true,
    functional,
    analytics,
    acceptedAt: new Date(),
    version: COOKIE_CONSENT_VERSION,
  }
  saveLocalConsent(consent)
  return consent
}

// Sync consent to Firestore for logged-in users
export async function syncConsentToFirestore(user: User, consent: CookieConsent): Promise<void> {
  if (!user) return

  try {
    const consentRef = doc(db, 'users', user.uid, 'preferences', 'cookieConsent')
    await setDoc(consentRef, {
      essential: consent.essential,
      functional: consent.functional,
      analytics: consent.analytics,
      acceptedAt: serverTimestamp(),
      version: consent.version,
      userAgent: navigator.userAgent,
      updatedAt: serverTimestamp(),
    })
    console.log('Cookie consent synced to Firestore')
  } catch (error) {
    console.error('Error syncing cookie consent to Firestore:', error)
  }
}

// Get consent from Firestore for logged-in users
export async function getFirestoreConsent(user: User): Promise<CookieConsent | null> {
  if (!user) return null

  try {
    const consentRef = doc(db, 'users', user.uid, 'preferences', 'cookieConsent')
    const consentDoc = await getDoc(consentRef)
    
    if (consentDoc.exists()) {
      const data = consentDoc.data()
      return {
        essential: data.essential,
        functional: data.functional,
        analytics: data.analytics,
        acceptedAt: data.acceptedAt?.toDate() || null,
        version: data.version,
      }
    }
  } catch (error) {
    console.error('Error fetching cookie consent from Firestore:', error)
  }
  return null
}

// Accept and sync consent
export async function acceptAndSyncConsent(
  user: User | null,
  acceptAll: boolean
): Promise<CookieConsent> {
  const consent = acceptAll ? acceptAllCookies() : acceptEssentialOnly()
  
  if (user) {
    await syncConsentToFirestore(user, consent)
  }
  
  return consent
}

// Save custom consent and sync
export async function saveAndSyncCustomConsent(
  user: User | null,
  functional: boolean,
  analytics: boolean
): Promise<CookieConsent> {
  const consent = saveCustomConsent(functional, analytics)
  
  if (user) {
    await syncConsentToFirestore(user, consent)
  }
  
  return consent
}
