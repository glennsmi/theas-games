import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { GameScene } from './scenes/GameScene'
import { GameOverScene } from './scenes/GameOverScene'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameSettings {
  difficulty: Difficulty
  soundEnabled: boolean
}

export const DIFFICULTY_CONFIG = {
  easy: {
    gravity: 800,
    jumpForce: -400,
    doubleJumpForce: -350,
    playerSpeed: 200,
    platformSpeed: 80,
    platformFrequency: 2000,
    collectibleFrequency: 1500,
    babyCreatureFrequency: 8000,
    hazardFrequency: 4000,
    startingLives: 3,
    label: 'Easy (Ages 5-6)'
  },
  medium: {
    gravity: 900,
    jumpForce: -450,
    doubleJumpForce: -380,
    playerSpeed: 250,
    platformSpeed: 120,
    platformFrequency: 1600,
    collectibleFrequency: 1200,
    babyCreatureFrequency: 10000,
    hazardFrequency: 2500,
    startingLives: 3,
    label: 'Medium (Ages 7-8)'
  },
  hard: {
    gravity: 1000,
    jumpForce: -500,
    doubleJumpForce: -420,
    playerSpeed: 300,
    platformSpeed: 160,
    platformFrequency: 1200,
    collectibleFrequency: 1000,
    babyCreatureFrequency: 12000,
    hazardFrequency: 1800,
    startingLives: 3,
    label: 'Hard (Ages 9-10)'
  }
}

// Thea's Games Color Palette
export const COLORS = {
  lightTeal: 0x5DD3C3,
  mediumTeal: 0x40B5A8,
  darkNavy: 0x1E3A5F,
  mediumPurple: 0x8B6BB5,
  deepPurple: 0x6B4D94,
  sandyCoral: 0xF4A460,
  brightCoral: 0xFF9966,
  paleAqua: 0x98E8DC,
  iceAqua: 0xB8F0E8,
  white: 0xFFFFFF
}

export const createGameConfig = (
  onGameOver?: (score: number, pearls: number, babiesReunited: number) => void,
  difficulty: Difficulty = 'easy',
  avatarConfig?: { tint?: number } | null
): Phaser.Types.Core.GameConfig => {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    backgroundColor: COLORS.darkNavy,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: DIFFICULTY_CONFIG[difficulty].gravity },
        debug: false
      }
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    callbacks: {
      preBoot: (game) => {
        game.registry.set('onGameOver', onGameOver)
        game.registry.set('difficulty', difficulty)
        game.registry.set('avatarConfig', avatarConfig)
      }
    }
  }
}

