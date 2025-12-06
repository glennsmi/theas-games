import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, User } from 'firebase/auth'
import { firebaseConfig } from './config/firebase'
import { createApiResponse } from '@shared'
import HomePage from './pages/HomePage.tsx'
import GamePage from './pages/GamePage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import Header from './components/Header'
import { ParallaxLayout } from './components/layout/ParallaxLayout'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

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

  // Example of using shared utilities
  const apiResponse = createApiResponse(true, { message: 'App initialized' }, undefined, 'Welcome!')

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
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* Debug info */}
        <div className="fixed bottom-4 right-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg text-xs text-dark-navy">
          <p>API Response: {apiResponse.success ? '✅' : '❌'}</p>
          <p>User: {user ? user.email : 'Not logged in'}</p>
        </div>
      </ParallaxLayout>
    </Router>
  )
}

export default App


