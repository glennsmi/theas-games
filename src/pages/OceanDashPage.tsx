import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhaserGame, PhaserGameRef } from '@/components/game/phaser/PhaserGame'
import { createGameConfig, Difficulty, DIFFICULTY_CONFIG } from '@/games/ocean-dash'
import { Button } from '@/components/ui/button'
import { auth } from '@/config/firebase'
import { updateUserPearls } from '@/services/userService'
import { cn } from '@/lib/utils'

// Check if device supports native fullscreen API
const supportsNativeFullscreen = () => {
  return document.documentElement.requestFullscreen || 
         (document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen
}

// Check if we're on iOS (which doesn't support fullscreen API for non-video elements)
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export default function OceanDashPage() {
  const navigate = useNavigate()
  const gameRef = useRef<PhaserGameRef>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [gameKey, setGameKey] = useState(0)
  const [lastScore, setLastScore] = useState<{ distance: number; pearls: number } | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false) // For iOS fallback

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
      // Lock body scroll and hide overflow
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      // Scroll to top
      window.scrollTo(0, 0)
    } else {
      // Restore body scroll
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
    // Check if we should use pseudo-fullscreen (iOS or no native support)
    if (isIOS() || !supportsNativeFullscreen()) {
      // Use CSS-based pseudo-fullscreen
      setIsPseudoFullscreen(prev => !prev)
      return
    }
    
    // Try native fullscreen API
    try {
      const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> }
      const elem = gameContainerRef.current as HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }
      
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        // Enter fullscreen
        if (elem?.requestFullscreen) {
          await elem.requestFullscreen()
        } else if (elem?.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen()
        } else {
          // Fallback to pseudo-fullscreen
          setIsPseudoFullscreen(true)
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
      // Fallback to pseudo-fullscreen on error
      setIsPseudoFullscreen(prev => !prev)
    }
  }

  // Combined fullscreen state (native or pseudo)
  const isInFullscreen = isFullscreen || isPseudoFullscreen

  const handleGameOver = useCallback(async (distance: number, pearls: number) => {
    setLastScore({ distance, pearls })
    
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
    setGameKey(prev => prev + 1) // Force game restart
  }

  const gameConfig = createGameConfig(handleGameOver, difficulty)

  // If in pseudo-fullscreen mode, render a special fullscreen layout
  if (isPseudoFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-dark-navy flex items-center justify-center">
        {/* Game fills the screen */}
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
        
        {/* Exit button */}
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
        
        {/* Minimal HUD overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full text-white text-sm">
          <span>🧜‍♀️</span>
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
              🧜‍♀️ Ocean Dash
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
            
            {/* Fullscreen Button */}
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
              title={isInFullscreen ? "Exit Fullscreen" : "Fullscreen (works on mobile!)"}
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
              <li>🐠 <strong>Tap, click, or press SPACE</strong> to swim upward</li>
              <li>⬇️ Release to drift down with the current</li>
              <li>🐚 Collect <strong>pearls</strong> to earn currency</li>
              <li>🐚 <strong>Golden shells</strong> are worth 5 pearls!</li>
              <li>🛡️ <strong>Bubble shields</strong> give temporary invincibility</li>
              <li>🪼 Avoid <strong>jellyfish, seaweed, and coral</strong></li>
              <li>📏 Swim as far as you can!</li>
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
        
        {/* Fullscreen Exit Button - shown in native fullscreen mode */}
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
            Last run: <strong className="text-bright-coral">{lastScore.distance}m</strong>
          </span>
          <span className="text-sm">
            Pearls: <strong className="text-medium-teal">+{lastScore.pearls}</strong>
          </span>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-6 text-center text-xs text-dark-navy/50 max-w-md">
        <p>💡 Tip: The game gets faster the further you swim!</p>
      </div>
    </div>
  )
}

