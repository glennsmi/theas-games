import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShellCard } from '@/components/game/ShellCard'
import confetti from 'canvas-confetti'
import { auth } from '@/config/firebase'
import { updateUserPearls } from '@/services/userService'

// Game Configuration
const LEVELS = {
  easy: { rows: 3, cols: 4, pairs: 6 },
  medium: { rows: 4, cols: 5, pairs: 10 },
  hard: { rows: 5, cols: 8, pairs: 20 },
}

type CardType = {
  id: number
  content: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = ['🐠', '🐡', '🦈', '🐙', '🐚', '🦀', '🐬', '🐳', '🦑', '🦞', '🦐', '🦑', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖']

export default function GamePage() {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [gameMode, setGameMode] = useState<'practice' | 'multiplayer'>('practice')
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [scores, setScores] = useState({ 1: 0, 2: 0 })

  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameWon, setGameWon] = useState<boolean>(false)
  
  // Streak tracking
  const [currentStreak, setCurrentStreak] = useState<number>(0)
  const [showStreakBanner, setShowStreakBanner] = useState<boolean>(false)
  const [bestStreak, setBestStreak] = useState<number>(0)

  // Initialize Game
  useEffect(() => {
    startNewGame(level, gameMode)
  }, [level, gameMode])

  const startNewGame = (selectedLevel: 'easy' | 'medium' | 'hard', mode: 'practice' | 'multiplayer') => {
    const config = LEVELS[selectedLevel]
    const selectedEmojis = EMOJIS.slice(0, config.pairs)
    const gameCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(gameCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setScores({ 1: 0, 2: 0 })
    setCurrentPlayer(1)
    setGameWon(false)
    setCurrentStreak(0)
    setBestStreak(0)
    setShowStreakBanner(false)

    // Use mode to suppress lint if needed, or just for logic
    console.log(`Starting new game: ${selectedLevel} - ${mode}`)
  }

  // 🎉 EPIC CONFETTI CANNON - fires from both sides of the screen!
  const fireStreakCannons = (streakCount: number) => {
    const duration = 2000 + (streakCount * 500) // Longer celebration for bigger streaks
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
    
    // Calculate intensity based on streak
    const particleCount = Math.min(50 + (streakCount * 30), 200)
    const spread = 60 + (streakCount * 10)
    
    // Fire from LEFT side
    const fireLeft = () => {
      confetti({
        particleCount: particleCount,
        angle: 60,
        spread: spread,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        startVelocity: 45 + (streakCount * 5),
        gravity: 0.8,
        scalar: 1.2,
        drift: 1,
        ticks: 300
      })
    }
    
    // Fire from RIGHT side
    const fireRight = () => {
      confetti({
        particleCount: particleCount,
        angle: 120,
        spread: spread,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        startVelocity: 45 + (streakCount * 5),
        gravity: 0.8,
        scalar: 1.2,
        drift: -1,
        ticks: 300
      })
    }
    
    // Initial burst from both sides
    fireLeft()
    fireRight()
    
    // Multiple waves for bigger streaks!
    if (streakCount >= 3) {
      setTimeout(() => { fireLeft(); fireRight(); }, 200)
    }
    if (streakCount >= 4) {
      setTimeout(() => { fireLeft(); fireRight(); }, 400)
    }
    if (streakCount >= 5) {
      // MEGA STREAK! Add center burst too!
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6347'],
          startVelocity: 55,
          gravity: 0.6,
          scalar: 1.5,
          shapes: ['circle', 'square'],
          ticks: 400
        })
      }, 300)
    }
    
    // Continuous celebration for epic streaks
    if (streakCount >= 3) {
      const end = Date.now() + duration
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          return
        }
        confetti({
          particleCount: 10,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: Math.random() * 0.5 + 0.3 },
          colors: colors.slice(0, 4),
          startVelocity: 30,
          gravity: 1.2
        })
        confetti({
          particleCount: 10,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: Math.random() * 0.5 + 0.3 },
          colors: colors.slice(4),
          startVelocity: 30,
          gravity: 1.2
        })
      }, 100)
    }
  }

  const triggerBubbles = () => {
    const scalar = 2
    const bubbleColors = ['#ffffff', '#a5f3fc', '#67e8f9', '#22d3ee']

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: bubbleColors,
      shapes: ['circle'],
      scalar: scalar,
      drift: 0,
      gravity: 0.6,
      ticks: 60
    })
  }

  const handleCardClick = (id: number) => {
    // Prevent clicking if:
    // 1. Two cards already flipped (waiting for check)
    // 2. Card is already flipped
    // 3. Card is already matched (and thus invisible)
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      checkForMatch(newFlipped[0], newFlipped[1])
    }
  }

  const checkForMatch = (id1: number, id2: number) => {
    if (cards[id1].content === cards[id2].content) {
      // Match found - increment streak!
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      
      // Update best streak
      if (newStreak > bestStreak) {
        setBestStreak(newStreak)
      }
      
      // Show streak banner if streak >= 2
      if (newStreak >= 2) {
        setShowStreakBanner(true)
        // Fire the confetti cannons! 🎉
        fireStreakCannons(newStreak)
        // Hide banner after animation
        setTimeout(() => setShowStreakBanner(false), 2500)
      }
      
      setTimeout(() => {
        setCards(prev => prev.map(card =>
          card.id === id1 || card.id === id2
            ? { ...card, isMatched: true, isFlipped: false } // Reset flipped but set matched
            : card
        ))
        setFlippedCards([])
        triggerBubbles()

        // Update Score
        setScores(prev => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + 1
        }))

        // Save pearl to user account if applicable
        // Logic: If practice mode, user gets pearl.
        // If multiplayer, only Player 1 (assumed logged in user) gets pearl.
        const user = auth.currentUser
        if (user && (gameMode === 'practice' || currentPlayer === 1)) {
          updateUserPearls(user.uid, 1)
        }

        // Check Win Condition
        setMatchedPairs(prev => {
          const newPairs = prev + 1
          if (newPairs === LEVELS[level].pairs) {
            setGameWon(true)
            setTimeout(() => {
              // Epic win celebration!
              fireStreakCannons(Math.max(newStreak, 3))
              confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#ffffff', '#a5f3fc'],
                shapes: ['circle', 'square'],
                scalar: 2,
                gravity: 0.5,
                ticks: 300
              })
            }, 500)
          }
          return newPairs
        })

        // In standard memory, matching keeps your turn.
        // We will keep the current player.
      }, 1000) // Longer delay so they can see the match before it disappears
    } else {
      // No match - reset streak!
      setCurrentStreak(0)
      setShowStreakBanner(false)
      
      setTimeout(() => {
        setCards(prev => prev.map(card =>
          card.id === id1 || card.id === id2
            ? { ...card, isFlipped: false }
            : card
        ))
        setFlippedCards([])

        // Switch Turn if Multiplayer
        if (gameMode === 'multiplayer') {
          setCurrentPlayer(prev => prev === 1 ? 2 : 1)
        }
      }, 1500) // Longer delay to see what they missed
    }
  }

  // Get streak message based on count
  const getStreakMessage = (streak: number) => {
    if (streak === 2) return { text: "DOUBLE MATCH! 🔥", emoji: "🔥" }
    if (streak === 3) return { text: "TRIPLE STREAK! 🌟", emoji: "🌟" }
    if (streak === 4) return { text: "QUAD STREAK! 💎", emoji: "💎" }
    if (streak === 5) return { text: "PENTA STREAK! 🚀", emoji: "🚀" }
    if (streak >= 6) return { text: `${streak}x MEGA STREAK! 👑`, emoji: "👑" }
    return { text: "STREAK!", emoji: "⭐" }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Streak Banner - Epic celebration overlay */}
      {showStreakBanner && currentStreak >= 2 && (
        <div className="fixed inset-x-0 top-1/3 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl animate-bounce"
            style={{
              animation: 'streakPulse 0.5s ease-in-out infinite, streakBounce 0.3s ease-out',
              boxShadow: '0 0 60px rgba(255, 165, 0, 0.8), 0 0 100px rgba(255, 69, 0, 0.5)'
            }}
          >
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-white drop-shadow-lg tracking-wider"
                style={{ textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>
                {getStreakMessage(currentStreak).text}
              </div>
              <div className="text-2xl mt-2 animate-pulse">
                {Array(Math.min(currentStreak, 10)).fill(getStreakMessage(currentStreak).emoji).join(' ')}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add streak animation styles */}
      <style>{`
        @keyframes streakPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes streakBounce {
          0% { transform: translateY(-50px) scale(0.5); opacity: 0; }
          50% { transform: translateY(10px) scale(1.1); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes streakShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div className="text-center space-y-6 w-full max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-dark-navy drop-shadow-sm">
            {gameMode === 'multiplayer' ? 'Head-to-Head' : 'Simple Match'}
          </h1>

          <div className="text-dark-navy font-medium bg-white/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
            Moves: {moves} | Pairs: {matchedPairs}/{LEVELS[level].pairs}
            {currentStreak > 0 && (
              <span className="ml-2 text-orange-600 font-bold animate-pulse">
                🔥 {currentStreak}x
              </span>
            )}
          </div>
          <div className="flex gap-2 bg-white/40 p-1 rounded-lg backdrop-blur-sm">
            <Button
              variant={gameMode === 'practice' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGameMode('practice')}
              className={cn(gameMode === 'practice' && "bg-medium-teal text-white")}
            >
              Practice
            </Button>
            <Button
              variant={gameMode === 'multiplayer' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGameMode('multiplayer')}
              className={cn(gameMode === 'multiplayer' && "bg-medium-teal text-white")}
            >
              2 Players
            </Button>
          </div>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
          {/* Player 1 Score */}
          <div className={cn(
            "flex flex-col items-center p-4 rounded-xl transition-all duration-300 border-2",
            gameMode === 'multiplayer' && currentPlayer === 1
              ? "bg-white/80 border-medium-teal shadow-lg scale-105"
              : "bg-white/40 border-transparent"
          )}>
            <span className="text-sm font-semibold text-dark-navy uppercase tracking-wider">Player 1</span>
            <span className="text-3xl font-bold text-medium-teal">{scores[1]}</span>
            <span className="text-xs text-dark-navy/60">Pearls</span>
          </div>

          {/* Game Stats / Middle */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    level === l ? "bg-dark-navy scale-125" : "bg-dark-navy/30 hover:bg-dark-navy/50"
                  )}
                  title={l}
                />
              ))}
            </div>
            <div className="text-sm font-medium text-dark-navy/70">
              {level.toUpperCase()}
            </div>
          </div>

          {/* Player 2 Score (Only in Multiplayer) */}
          {gameMode === 'multiplayer' ? (
            <div className={cn(
              "flex flex-col items-center p-4 rounded-xl transition-all duration-300 border-2",
              currentPlayer === 2
                ? "bg-white/80 border-medium-purple shadow-lg scale-105"
                : "bg-white/40 border-transparent"
            )}>
              <span className="text-sm font-semibold text-dark-navy uppercase tracking-wider">Player 2</span>
              <span className="text-3xl font-bold text-medium-purple">{scores[2]}</span>
              <span className="text-xs text-dark-navy/60">Pearls</span>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/40">
              <span className="text-sm font-semibold text-dark-navy uppercase tracking-wider">Moves</span>
              <span className="text-3xl font-bold text-dark-navy">{moves}</span>
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6 mx-auto p-6 sm:p-8 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl",
          level === 'easy' ? "grid-cols-3 sm:grid-cols-4" : level === 'medium' ? "grid-cols-4 sm:grid-cols-5" : "grid-cols-5 sm:grid-cols-8"
        )}
      >
        {cards.map((card) => (
          <ShellCard
            key={card.id}
            content={card.content}
            isOpen={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center space-y-6 max-w-md mx-4 border-4 border-light-teal">
            <h2 className="text-4xl font-bold text-medium-purple">Splendid! 🎉</h2>
            <p className="text-xl text-dark-navy">You found all the pairs in {moves} moves!</p>
            
            {/* Best Streak Achievement */}
            {bestStreak >= 2 && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border-2 border-yellow-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Best Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{bestStreak}x Combo!</p>
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
              </div>
            )}

            {!auth.currentUser && gameMode === 'practice' && (
              <div className="bg-pale-aqua/30 p-4 rounded-xl border border-medium-teal/20">
                <p className="text-dark-navy mb-3 text-sm">
                  Sign up for a free account to save your pearls and track your progress!
                </p>
                <Button variant="secondary" className="w-full bg-medium-purple hover:bg-deep-purple text-white">
                  Create Free Account
                </Button>
              </div>
            )}

            <Button size="lg" onClick={() => startNewGame(level, gameMode)} className="bg-medium-teal hover:bg-light-teal text-white w-full text-lg py-6 rounded-xl shadow-lg">
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
