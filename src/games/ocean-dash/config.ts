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
    gravity: 150,
    swimForce: -280,
    baseSpeed: 120,
    obstacleFrequency: 3000, // ms between obstacles
    gapSize: 200,
    label: 'Easy (Ages 5-6)'
  },
  medium: {
    gravity: 200,
    swimForce: -320,
    baseSpeed: 180,
    obstacleFrequency: 2200,
    gapSize: 160,
    label: 'Medium (Ages 7-8)'
  },
  hard: {
    gravity: 250,
    swimForce: -360,
    baseSpeed: 240,
    obstacleFrequency: 1600,
    gapSize: 130,
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
  onGameOver?: (score: number, pearls: number) => void,
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
        // Store callbacks in registry for scenes to access
        game.registry.set('onGameOver', onGameOver)
        game.registry.set('difficulty', difficulty)
        game.registry.set('avatarConfig', avatarConfig)
      }
    }
  }
}



