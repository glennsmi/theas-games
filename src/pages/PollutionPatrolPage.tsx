import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhaserGame, PhaserGameRef } from '@/components/game/phaser/PhaserGame'
import { createGameConfig, Difficulty, DIFFICULTY_CONFIG } from '@/games/platformer'
import { Button } from '@/components/ui/button'
import { auth } from '@/config/firebase'
import { updateUserPearls } from '@/services/userService'
import { getUserSubscription, isPremiumSubscription } from '@/services/subscriptionService'
import { cn } from '@/lib/utils'
import { Lock, Loader2 } from 'lucide-react'

// Check if device supports native fullscreen API
const supportsNativeFullscreen = () => {
  return document.documentElement.requestFullscreen || 
         (document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen
}

// Check if we're on iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

import { useChild } from '@/context/ChildContext'

export default function PollutionPatrolPage() {
  const navigate = useNavigate()
  const gameRef = useRef<PhaserGameRef>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [gameKey, setGameKey] = useState(0)
  const [lastScore, setLastScore] = useState<{ score: number; pearls: number; babies: number } | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  
  const { activeChild } = useChild()
  
  // Check premium access
  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser
      if (!user) {
        navigate('/subscription')
        return
      }
      
      const subscription = await getUserSubscription(user.uid)
      if (isPremiumSubscription(subscription)) {
        setHasAccess(true)
      } else {
        navigate('/subscription')
      }
      setCheckingAccess(false)
    }
    checkAccess()
  }, [navigate])
  
  // Parse avatar config from active child
  const avatarConfig = activeChild?.avatarConfig 
    ? (() => {
        try {
          return JSON.parse(activeChild.avatarConfig)
        } catch (e) {
          console.error('Error parsing avatar config:', e)
          return null
        }
      })()
    : null

  useEffect(() => {
    setGameKey(prev => prev + 1)
  }, [activeChild?.id, activeChild?.avatarConfig])

  // Listen for native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFullscreen = !!(document.fullscreenElement || 
        (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement)
      setIsFullscreen(isNativeFullscreen)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Handle body scroll lock for pseudo-fullscreen
  useEffect(() => {
    if (isPseudoFullscreen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [isPseudoFullscreen])

  const toggleFullscreen = async () => {
    if (isIOS() || !supportsNativeFullscreen()) {
      setIsPseudoFullscreen(prev => !prev)
      return
    }
    
    try {
      const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> }
      const elem = gameContainerRef.current as HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }
      
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        if (elem?.requestFullscreen) {
          await elem.requestFullscreen()
        } else if (elem?.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen()
        } else {
          setIsPseudoFullscreen(true)
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
      setIsPseudoFullscreen(prev => !prev)
    }
  }

  const isInFullscreen = isFullscreen || isPseudoFullscreen

  const handleGameOver = useCallback(async (score: number, pearls: number, babiesReunited: number) => {
    setLastScore({ score, pearls, babies: babiesReunited })
    
    // Save pearls to user account
    const user = auth.currentUser
    if (user && pearls > 0) {
      try {
        await updateUserPearls(user.uid, pearls)
      } catch (error) {
        console.error('Failed to save pearls:', error)
      }
    }
  }, [])

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setGameKey(prev => prev + 1)
  }

  const gameConfig = createGameConfig(handleGameOver, difficulty, avatarConfig)

  // Loading state while checking access
  if (checkingAccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-medium-teal" />
        <p className="mt-4 text-dark-navy/70">Checking access...</p>
      </div>
    )
  }

  // If no access (shouldn't happen as we redirect, but safety check)
  if (!hasAccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <Lock className="w-16 h-16 text-medium-purple mb-4" />
        <h2 className="text-2xl font-bold text-dark-navy mb-2">Premium Content</h2>
        <p className="text-dark-navy/70 mb-6">Subscribe to unlock Pollution Patrol!</p>
        <Button onClick={() => navigate('/subscription')} className="bg-medium-purple hover:bg-deep-purple">
          View Plans
        </Button>
      </div>
    )
  }

  // Pseudo-fullscreen layout
  if (isPseudoFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-dark-navy flex items-center justify-center">
        <div 
          ref={gameContainerRef}
          className="w-full h-full"
        >
          <PhaserGame
            key={gameKey}
            ref={gameRef}
            config={gameConfig}
            className="w-full h-full"
          />
        </div>
        
        <button
          onClick={() => setIsPseudoFullscreen(false)}
          className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80 active:scale-95 transition-all shadow-lg"
          title="Exit Fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20"></polyline>
            <polyline points="20 10 14 10 14 4"></polyline>
            <line x1="14" y1="10" x2="21" y2="3"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
        
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full text-white text-sm">
          <span>🐚</span>
          <span className="font-medium">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-4 px-4">
      {/* Title and Controls */}
      <div className="w-full max-w-4xl mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-dark-navy hover:bg-white/20"
            >
              ← Back
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-navy">
              🧜‍♀️ Coral Reef Quest
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-dark-navy/70">Difficulty:</span>
            <div className="flex gap-1 bg-white/30 p-1 rounded-lg">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <Button
                  key={d}
                  variant={difficulty === d ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleDifficultyChange(d)}
                  className={cn(
                    "text-xs px-3",
                    difficulty === d && "bg-medium-teal text-white"
                  )}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all",
                "border-2 border-medium-teal bg-white/80 text-medium-teal",
                "hover:bg-medium-teal hover:text-white hover:scale-110",
                "shadow-md hover:shadow-lg",
                showInfo && "bg-medium-teal text-white"
              )}
              title="How to Play"
            >
              i
            </button>
            
            <button
              onClick={toggleFullscreen}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-base transition-all",
                "border-2 border-medium-purple bg-white/80 text-medium-purple",
                "hover:bg-medium-purple hover:text-white hover:scale-110",
                "active:scale-95",
                "shadow-md hover:shadow-lg",
                isInFullscreen && "bg-medium-purple text-white"
              )}
              title={isInFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isInFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20"></polyline>
                  <polyline points="20 10 14 10 14 4"></polyline>
                  <line x1="14" y1="10" x2="21" y2="3"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Info Panel */}
        {showInfo && (
          <div className="mt-4 p-4 bg-white/40 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="font-semibold text-dark-navy mb-2">How to Play</h3>
            <ul className="text-sm text-dark-navy/80 space-y-1">
              <li>⬆️ <strong>Press SPACE, UP arrow, or tap</strong> to jump</li>
              <li>🔄 <strong>Jump again in mid-air</strong> for a double-jump!</li>
              <li>⬅️➡️ <strong>Arrow keys</strong> to move left/right</li>
              <li>🐚 Collect <strong>shells</strong> (+10 points) and <strong>pearls</strong> (+5)</li>
              <li>🐢 <strong>Rescue baby sea creatures</strong> - they'll follow you!</li>
              <li>💕 <strong>Reunite babies with their parents</strong> (+50 bonus!)</li>
              <li>⚡ <strong>Speed Boost</strong> makes you faster temporarily</li>
              <li>🛡️ <strong>Bubble Shield</strong> protects you from hazards</li>
              <li>❤️ You have <strong>3 lives</strong> - be careful!</li>
              <li>☠️ <strong>DANGER!</strong> Avoid jellyfish, sea urchins & ocean trash!</li>
              <li>⚠️ Don't fall off the platforms!</li>
            </ul>
            <p className="text-xs text-dark-navy/60 mt-2">
              Difficulty: {DIFFICULTY_CONFIG[difficulty].label}
            </p>
          </div>
        )}
      </div>
      
      {/* Game Container */}
      <div 
        ref={gameContainerRef}
        className={cn(
          "relative bg-dark-navy overflow-hidden shadow-2xl border-4 border-medium-teal/50",
          isInFullscreen 
            ? "w-screen h-screen rounded-none border-0" 
            : "w-full max-w-4xl aspect-[16/10] rounded-2xl"
        )}
      >
        <PhaserGame
          key={gameKey}
          ref={gameRef}
          config={gameConfig}
          className="w-full h-full"
        />
        
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80 active:scale-95 transition-all shadow-lg"
            title="Exit Fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        )}
      </div>
      
      {/* Last Score Display */}
      {lastScore && (
        <div className="mt-4 flex items-center gap-6 text-dark-navy/80">
          <span className="text-sm">
            Score: <strong className="text-bright-coral">{lastScore.score}</strong>
          </span>
          <span className="text-sm">
            Collectibles: <strong className="text-medium-teal">+{lastScore.pearls}</strong>
          </span>
          <span className="text-sm">
            Families: <strong className="text-medium-purple">{lastScore.babies}</strong>
          </span>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-6 text-center text-xs text-dark-navy/50 max-w-md">
        <p>💡 Tip: Double-jump to reach higher platforms and rescue more baby creatures!</p>
      </div>
    </div>
  )
}
