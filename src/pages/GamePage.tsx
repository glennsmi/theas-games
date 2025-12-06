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

    // Use mode to suppress lint if needed, or just for logic
    console.log(`Starting new game: ${selectedLevel} - ${mode}`)
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
      // Match found
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
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ffffff', '#a5f3fc', '#67e8f9'],
                shapes: ['circle'],
                scalar: 2,
                gravity: 0.5,
                ticks: 200
              })
            }, 500)
          }
          return newPairs
        })

        // In standard memory, matching keeps your turn.
        // We will keep the current player.
      }, 1000) // Longer delay so they can see the match before it disappears
    } else {
      // No match
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-6 w-full max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-dark-navy drop-shadow-sm">
            {gameMode === 'multiplayer' ? 'Head-to-Head' : 'Simple Match'}
          </h1>

          <div className="text-dark-navy font-medium bg-white/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
            Moves: {moves} | Pairs: {matchedPairs}/{LEVELS[level].pairs}
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
            <Button size="lg" onClick={() => startNewGame(level, gameMode)} className="bg-medium-teal hover:bg-light-teal text-white w-full text-lg py-6 rounded-xl shadow-lg">
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
