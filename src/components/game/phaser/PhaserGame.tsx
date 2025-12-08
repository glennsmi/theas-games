import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Phaser from 'phaser'

export interface PhaserGameRef {
  game: Phaser.Game | null
  scene: Phaser.Scene | null
}

interface PhaserGameProps {
  config: Phaser.Types.Core.GameConfig
  onGameReady?: (game: Phaser.Game) => void
  className?: string
}

export const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(
  ({ config, onGameReady, className }, ref) => {
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)

    useImperativeHandle(ref, () => ({
      get game() {
        return gameRef.current
      },
      get scene() {
        return gameRef.current?.scene?.scenes[0] || null
      }
    }))

    useEffect(() => {
      if (!gameContainerRef.current) return

      // Create the Phaser game with the container
      const gameConfig: Phaser.Types.Core.GameConfig = {
        ...config,
        parent: gameContainerRef.current,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: config.width || 800,
          height: config.height || 600,
          ...config.scale
        }
      }

      gameRef.current = new Phaser.Game(gameConfig)

      if (onGameReady) {
        gameRef.current.events.once('ready', () => {
          onGameReady(gameRef.current!)
        })
      }

      // Cleanup on unmount
      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true)
          gameRef.current = null
        }
      }
    }, []) // Empty deps - only create once

    return (
      <div 
        ref={gameContainerRef} 
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
)

PhaserGame.displayName = 'PhaserGame'



