import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { auth } from './config/firebase'

import HomePage from './pages/HomePage.tsx'
import GamePage from './pages/GamePage.tsx'
import OceanDashPage from './pages/OceanDashPage.tsx'
import PollutionPatrolPage from './pages/PollutionPatrolPage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx'
import CookiePolicyPage from './pages/CookiePolicyPage.tsx'
import TermsPage from './pages/TermsPage.tsx'
import OceanPollutionPage from './pages/OceanPollutionPage.tsx'
import ParentDashboardPage from './pages/ParentDashboardPage.tsx'
import SubscriptionPage from './pages/SubscriptionPage.tsx'
import HelpingTheEnvironmentPage from './pages/HelpingTheEnvironmentPage.tsx'
import CharacterCreationPage from './pages/CharacterCreationPage.tsx'

import Header from './components/Header'
import Footer from './components/Footer'
import CookieConsentBanner from './components/CookieConsentBanner'
import ScrollToTop from './components/ScrollToTop'
import { ParallaxLayout } from './components/layout/ParallaxLayout'

import { ChildProvider } from './context/ChildContext'
import { Toaster } from 'sonner'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <ChildProvider>
      <Router>
        <ScrollToTop />
        <ParallaxLayout>
          <Header user={user} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/ocean-dash" element={<OceanDashPage />} />
              <Route path="/pollution-patrol" element={<PollutionPatrolPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/ocean-pollution" element={<OceanPollutionPage />} />
              <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/helping-the-environment" element={<HelpingTheEnvironmentPage />} />
              <Route path="/character-creation" element={<CharacterCreationPage />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsentBanner user={user} />
          <Toaster />
        </ParallaxLayout>
      </Router>
    </ChildProvider>
  )
}

export default App
