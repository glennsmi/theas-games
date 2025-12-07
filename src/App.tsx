import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { auth } from './config/firebase'

import HomePage from './pages/HomePage.tsx'
import GamePage from './pages/GamePage.tsx'
import OceanDashPage from './pages/OceanDashPage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import Header from './components/Header'
import { ParallaxLayout } from './components/layout/ParallaxLayout'

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
    <Router>
      <ParallaxLayout>
        <Header user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/ocean-dash" element={<OceanDashPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </ParallaxLayout>
    </Router>
  )
}

export default App


