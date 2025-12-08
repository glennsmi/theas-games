import Phaser from 'phaser'
import { COLORS } from '../config'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(COLORS.mediumTeal, 0.3)
    progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 15, 320, 30, 10)
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#B8F0E8'
    }).setOrigin(0.5)

    // Update progress bar
    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(COLORS.lightTeal, 1)
      progressBar.fillRoundedRect(width / 2 - 155, height / 2 - 10, 310 * value, 20, 8)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })

    // Load the Thea mermaid character image
    this.load.image('thea', '/thea-mermaid-logo-transparent.png')
    
    // Generate all other game assets programmatically
    this.createGameAssets()
  }

  createGameAssets() {
    // Thea mermaid is loaded from image file in preload()
    
    // Create trash sprites
    this.createPlasticBottleSprite()
    this.createSodaCanSprite()
    
    // Create jellyfish sprite
    this.createJellyfishSprite()
    
    // Create seaweed sprite
    this.createSeaweedSprite()
    
    // Create bubble sprite
    this.createBubbleSprite()
    
    // Create coral formations
    this.createCoralSprite()
    
    // Create shield power-up
    this.createShieldSprite()
  }

  createPlasticBottleSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Plastic Bottle - Blue cylinder
    graphics.fillStyle(COLORS.plasticBlue || 0x4FC3F7)
    graphics.fillRoundedRect(4, 8, 16, 32, 4) // Body
    graphics.fillRect(8, 2, 8, 6) // Neck
    
    // Cap
    graphics.fillStyle(COLORS.white)
    graphics.fillRect(8, 0, 8, 2) 
    
    // Label
    graphics.fillStyle(COLORS.white, 0.7)
    graphics.fillRect(4, 16, 16, 10)
    
    graphics.generateTexture('plasticBottle', 24, 42)
    graphics.destroy()
  }

  createSodaCanSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Soda Can - Red/Silver
    graphics.fillStyle(COLORS.dangerRed || 0xFF5252)
    graphics.fillRoundedRect(4, 4, 16, 26, 2)
    
    // Top/Bottom rim
    graphics.fillStyle(COLORS.trashGray || 0x9E9E9E)
    graphics.fillRect(4, 4, 16, 2)
    graphics.fillRect(4, 28, 16, 2)
    
    // Pull tab
    graphics.fillStyle(COLORS.trashGray || 0x9E9E9E)
    graphics.fillCircle(12, 10, 3)

    graphics.generateTexture('sodaCan', 24, 34)
    graphics.destroy()
  }

  createJellyfishSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Jellyfish - 40x50
    // Bell (dome)
    graphics.fillStyle(COLORS.mediumPurple, 0.7)
    graphics.fillEllipse(20, 15, 32, 24)
    
    // Inner glow
    graphics.fillStyle(COLORS.paleAqua, 0.5)
    graphics.fillEllipse(20, 14, 24, 18)
    
    // Tentacles
    graphics.lineStyle(3, COLORS.mediumPurple, 0.8)
    graphics.beginPath()
    graphics.moveTo(8, 24)
    graphics.lineTo(6, 35)
    graphics.lineTo(10, 45)
    graphics.strokePath()
    
    graphics.beginPath()
    graphics.moveTo(16, 26)
    graphics.lineTo(14, 38)
    graphics.lineTo(18, 48)
    graphics.strokePath()
    
    graphics.beginPath()
    graphics.moveTo(24, 26)
    graphics.lineTo(26, 38)
    graphics.lineTo(22, 48)
    graphics.strokePath()
    
    graphics.beginPath()
    graphics.moveTo(32, 24)
    graphics.lineTo(34, 35)
    graphics.lineTo(30, 45)
    graphics.strokePath()
    
    graphics.generateTexture('jellyfish', 40, 50)
    graphics.destroy()
  }

  createSeaweedSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Seaweed - 30x120 (tall obstacle)
    graphics.fillStyle(0x2D8B57) // Sea green
    
    // Multiple wavy strands
    for (let i = 0; i < 3; i++) {
      const x = 8 + i * 8
      graphics.beginPath()
      graphics.moveTo(x, 120)
      
      for (let y = 120; y > 0; y -= 20) {
        const wave = Math.sin(y * 0.05 + i) * 6
        graphics.lineTo(x + wave, y)
      }
      
      graphics.lineTo(x + 4, 0)
      
      for (let y = 0; y < 120; y += 20) {
        const wave = Math.sin(y * 0.05 + i) * 6
        graphics.lineTo(x + 4 + wave, y)
      }
      
      graphics.closePath()
      graphics.fillPath()
    }
    
    graphics.generateTexture('seaweed', 30, 120)
    graphics.destroy()
  }

  createBubbleSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Bubble - 12x12
    graphics.lineStyle(2, COLORS.iceAqua, 0.8)
    graphics.strokeCircle(6, 6, 5)
    
    // Highlight
    graphics.fillStyle(COLORS.white, 0.6)
    graphics.fillCircle(4, 4, 2)
    
    graphics.generateTexture('bubble', 12, 12)
    graphics.destroy()
  }

  createCoralSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Coral formation - 60x80
    // Main coral body
    graphics.fillStyle(COLORS.brightCoral)
    
    // Branch 1
    graphics.fillRoundedRect(10, 40, 15, 40, 5)
    graphics.fillCircle(17, 35, 12)
    
    // Branch 2
    graphics.fillRoundedRect(30, 30, 12, 50, 4)
    graphics.fillCircle(36, 25, 10)
    
    // Branch 3
    graphics.fillStyle(COLORS.sandyCoral)
    graphics.fillRoundedRect(45, 50, 10, 30, 4)
    graphics.fillCircle(50, 45, 8)
    
    // Details
    graphics.fillStyle(COLORS.mediumPurple, 0.5)
    graphics.fillCircle(17, 35, 5)
    graphics.fillCircle(36, 25, 4)
    
    graphics.generateTexture('coral', 60, 80)
    graphics.destroy()
  }

  createShieldSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Shield bubble - 20x20
    graphics.lineStyle(3, COLORS.lightTeal, 0.9)
    graphics.strokeCircle(10, 10, 8)
    
    graphics.lineStyle(2, COLORS.iceAqua, 0.6)
    graphics.strokeCircle(10, 10, 6)
    
    // Inner sparkle - simple cross pattern instead of star
    graphics.fillStyle(COLORS.white, 0.8)
    graphics.fillRect(8, 6, 4, 8) // vertical
    graphics.fillRect(6, 8, 8, 4) // horizontal
    
    graphics.generateTexture('shield', 20, 20)
    graphics.destroy()
  }

  create() {
    this.scene.start('MenuScene')
  }
}
