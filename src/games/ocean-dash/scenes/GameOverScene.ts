import Phaser from 'phaser'
import { COLORS, Difficulty } from '../config'

interface GameOverData {
  distance: number
  pearls: number
  isNewHighScore: boolean
  difficulty: Difficulty
}

export class GameOverScene extends Phaser.Scene {
  private gameData!: GameOverData

  constructor() {
    super({ key: 'GameOverScene' })
  }

  init(data: GameOverData) {
    this.gameData = data
  }

  create() {
    const { width, height } = this.cameras.main
    
    // Semi-transparent overlay
    const overlay = this.add.graphics()
    overlay.fillStyle(COLORS.darkNavy, 0.85)
    overlay.fillRect(0, 0, width, height)
    
    // Animated bubbles in background
    this.createBubbles()
    
    // Modal container
    const modalWidth = 360
    const modalHeight = 380
    const modalX = (width - modalWidth) / 2
    const modalY = (height - modalHeight) / 2
    
    // Modal background
    const modal = this.add.graphics()
    modal.fillStyle(COLORS.mediumTeal, 0.95)
    modal.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 20)
    modal.lineStyle(4, COLORS.lightTeal)
    modal.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 20)
    
    // Title
    const title = this.gameData.isNewHighScore ? '🌟 New Record! 🌟' : 'Splendid!'
    const titleText = this.add.text(width / 2, modalY + 40, title, {
      fontFamily: 'Georgia, serif',
      fontSize: this.gameData.isNewHighScore ? '32px' : '36px',
      color: this.gameData.isNewHighScore ? '#F4A460' : '#B8F0E8',
      stroke: '#1E3A5F',
      strokeThickness: 3
    }).setOrigin(0.5)
    
    // Animate title if new high score
    if (this.gameData.isNewHighScore) {
      this.tweens.add({
        targets: titleText,
        scale: { from: 1, to: 1.1 },
        duration: 500,
        yoyo: true,
        repeat: -1
      })
    }
    
    // Distance
    this.add.text(width / 2, modalY + 100, 'You swam', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#98E8DC'
    }).setOrigin(0.5)
    
    const distanceText = this.add.text(width / 2, modalY + 135, `${this.gameData.distance}m`, {
      fontFamily: 'Georgia, serif',
      fontSize: '48px',
      color: '#FF9966',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // Animate distance counting up
    this.tweens.addCounter({
      from: 0,
      to: this.gameData.distance,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onUpdate: (tween) => {
        const value = tween.getValue()
        if (value !== null) {
          distanceText.setText(`${Math.floor(value)}m`)
        }
      }
    })
    
    // Pearls collected
    const pearlBg = this.add.graphics()
    pearlBg.fillStyle(COLORS.darkNavy, 0.5)
    pearlBg.fillRoundedRect(width / 2 - 80, modalY + 175, 160, 50, 10)
    
    const pearlIcon = this.add.sprite(width / 2 - 50, modalY + 200, 'pearl')
    pearlIcon.setScale(2)
    
    const pearlText = this.add.text(width / 2 + 10, modalY + 200, `+${this.gameData.pearls}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#B8F0E8',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5)
    
    // Animate pearl counter
    this.tweens.addCounter({
      from: 0,
      to: this.gameData.pearls,
      duration: 800,
      delay: 500,
      ease: 'Cubic.easeOut',
      onUpdate: (tween) => {
        const value = tween.getValue()
        if (value !== null) {
          pearlText.setText(`+${Math.floor(value)}`)
        }
      }
    })
    
    // Play Again button
    this.createButton(
      width / 2,
      modalY + 280,
      'Play Again',
      COLORS.brightCoral,
      () => this.scene.start('GameScene')
    )
    
    // Back to Menu button
    this.createButton(
      width / 2,
      modalY + 340,
      'Back to Menu',
      COLORS.mediumPurple,
      () => this.scene.start('MenuScene'),
      true
    )
    
    // High score display
    const highScore = this.registry.get('highScore') || this.gameData.distance
    this.add.text(width / 2, height - 30, `🏆 Best: ${highScore}m`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#98E8DC'
    }).setOrigin(0.5)
    
    // Input to restart
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
  }

  createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void,
    secondary: boolean = false
  ) {
    const buttonWidth = secondary ? 140 : 180
    const buttonHeight = secondary ? 36 : 44
    
    const container = this.add.container(x, y)
    
    const bg = this.add.graphics()
    bg.fillStyle(color)
    bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10)
    
    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: secondary ? '16px' : '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    container.add([bg, buttonText])
    container.setSize(buttonWidth, buttonHeight)
    container.setInteractive({ useHandCursor: true })
    
    container.on('pointerover', () => {
      bg.clear()
      // Lighten the color by adding to RGB values
      const rgb = Phaser.Display.Color.IntegerToRGB(color)
      const lighterColor = Phaser.Display.Color.GetColor(
        Math.min(255, rgb.r + 30),
        Math.min(255, rgb.g + 30),
        Math.min(255, rgb.b + 30)
      )
      bg.fillStyle(lighterColor)
      bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10)
      container.setScale(1.05)
    })
    
    container.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(color)
      bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10)
      container.setScale(1)
    })
    
    container.on('pointerdown', () => {
      container.setScale(0.95)
    })
    
    container.on('pointerup', callback)
  }

  createBubbles() {
    const { width, height } = this.cameras.main
    
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width
      const y = height + Math.random() * 50
      const size = 4 + Math.random() * 8
      
      const bubble = this.add.circle(x, y, size, COLORS.iceAqua, 0.2)
      
      this.tweens.add({
        targets: bubble,
        y: -20,
        x: bubble.x + (Math.random() - 0.5) * 60,
        duration: 3000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 2000,
        onRepeat: () => {
          bubble.x = Math.random() * width
          bubble.y = height + 20
        }
      })
    }
  }
}

