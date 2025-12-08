import Phaser from 'phaser'
import { COLORS } from '../config'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    
    // Create loading bar
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(COLORS.mediumTeal, 0.3)
    progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 15, 320, 30, 10)
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#B8F0E8'
    }).setOrigin(0.5)

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
    
    // Generate all game assets programmatically
    this.createGameAssets()
  }

  createGameAssets() {
    this.createPlatformSprite()
    this.createShellSprite()
    this.createPearlSprite()
    this.createBabyTurtleSprite()
    this.createBabySeahorseSprite()
    this.createBabyFishSprite()
    this.createParentTurtleSprite()
    this.createParentSeahorseSprite()
    this.createParentFishSprite()
    this.createSpeedBoostSprite()
    this.createBubbleShieldSprite()
    this.createBubbleSprite()
    this.createCoralSprite()
    this.createSeaweedSprite()
    // Hazards
    this.createJellyfishSprite()
    this.createSeaUrchinSprite()
    this.createTrashBottleSprite()
    this.createTrashCanSprite()
    this.createTrashBagSprite()
    this.createHeartSprite()
  }

  createPlatformSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Coral platform - 120x24
    graphics.fillStyle(COLORS.sandyCoral)
    graphics.fillRoundedRect(0, 4, 120, 20, 8)
    
    // Coral texture bumps on top
    graphics.fillStyle(COLORS.brightCoral)
    graphics.fillCircle(20, 8, 8)
    graphics.fillCircle(50, 6, 10)
    graphics.fillCircle(80, 8, 8)
    graphics.fillCircle(100, 7, 6)
    
    // Highlights
    graphics.fillStyle(COLORS.white, 0.3)
    graphics.fillCircle(25, 6, 3)
    graphics.fillCircle(55, 4, 4)
    graphics.fillCircle(85, 6, 3)
    
    graphics.generateTexture('platform', 120, 24)
    graphics.destroy()
  }

  createShellSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Sea shell - 20x18
    graphics.fillStyle(COLORS.paleAqua)
    
    // Shell fan shape
    graphics.beginPath()
    graphics.moveTo(10, 18)
    graphics.lineTo(2, 6)
    graphics.arc(10, 6, 8, Math.PI, 0, false)
    graphics.lineTo(10, 18)
    graphics.closePath()
    graphics.fillPath()
    
    // Shell ridges
    graphics.lineStyle(1, COLORS.mediumTeal)
    graphics.lineBetween(10, 18, 6, 2)
    graphics.lineBetween(10, 18, 10, 0)
    graphics.lineBetween(10, 18, 14, 2)
    
    // Sparkle
    graphics.fillStyle(COLORS.white)
    graphics.fillCircle(7, 5, 2)
    
    graphics.generateTexture('shell', 20, 18)
    graphics.destroy()
  }

  createPearlSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Pearl - 16x16 shimmering orb
    graphics.fillStyle(COLORS.iceAqua)
    graphics.fillCircle(8, 8, 7)
    
    // Inner glow
    graphics.fillStyle(COLORS.white)
    graphics.fillCircle(8, 8, 5)
    
    // Highlight
    graphics.fillStyle(0xFFFFFF)
    graphics.fillCircle(6, 6, 2)
    
    graphics.generateTexture('pearl', 16, 16)
    graphics.destroy()
  }

  createBabyTurtleSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Baby sea turtle - 24x20
    // Shell
    graphics.fillStyle(0x3D8B37) // Green
    graphics.fillEllipse(12, 12, 16, 12)
    
    // Shell pattern
    graphics.fillStyle(0x2D6B27)
    graphics.fillCircle(12, 12, 4)
    graphics.fillCircle(8, 10, 2)
    graphics.fillCircle(16, 10, 2)
    graphics.fillCircle(10, 15, 2)
    graphics.fillCircle(14, 15, 2)
    
    // Head
    graphics.fillStyle(0x5DAA57)
    graphics.fillCircle(20, 10, 4)
    
    // Eye
    graphics.fillStyle(0x000000)
    graphics.fillCircle(21, 9, 1)
    
    // Flippers
    graphics.fillStyle(0x5DAA57)
    graphics.fillEllipse(6, 8, 6, 3)
    graphics.fillEllipse(6, 16, 6, 3)
    
    graphics.generateTexture('babyTurtle', 24, 20)
    graphics.destroy()
  }

  createBabySeahorseSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Baby seahorse - 16x24
    graphics.fillStyle(COLORS.brightCoral)
    
    // Body
    graphics.fillEllipse(8, 14, 8, 12)
    
    // Head
    graphics.fillCircle(8, 5, 5)
    
    // Snout
    graphics.fillStyle(COLORS.sandyCoral)
    graphics.fillEllipse(12, 5, 4, 2)
    
    // Eye
    graphics.fillStyle(0x000000)
    graphics.fillCircle(7, 4, 1.5)
    
    // Dorsal fin
    graphics.fillStyle(COLORS.brightCoral, 0.7)
    graphics.beginPath()
    graphics.moveTo(4, 10)
    graphics.lineTo(2, 8)
    graphics.lineTo(4, 14)
    graphics.closePath()
    graphics.fillPath()
    
    // Tail curl
    graphics.lineStyle(3, COLORS.brightCoral)
    graphics.beginPath()
    graphics.arc(8, 22, 4, 0, Math.PI, true)
    graphics.strokePath()
    
    graphics.generateTexture('babySeahorse', 16, 24)
    graphics.destroy()
  }

  createBabyFishSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Baby clownfish - 20x14
    // Body
    graphics.fillStyle(COLORS.brightCoral)
    graphics.fillEllipse(10, 7, 14, 10)
    
    // White stripes
    graphics.fillStyle(COLORS.white)
    graphics.fillRect(6, 2, 3, 10)
    graphics.fillRect(13, 3, 2, 8)
    
    // Tail
    graphics.fillStyle(COLORS.brightCoral)
    graphics.beginPath()
    graphics.moveTo(18, 7)
    graphics.lineTo(22, 3)
    graphics.lineTo(22, 11)
    graphics.closePath()
    graphics.fillPath()
    
    // Eye
    graphics.fillStyle(0x000000)
    graphics.fillCircle(5, 6, 2)
    graphics.fillStyle(COLORS.white)
    graphics.fillCircle(4.5, 5.5, 0.8)
    
    graphics.generateTexture('babyFish', 24, 14)
    graphics.destroy()
  }

  createParentTurtleSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Parent sea turtle - 48x36
    // Shell
    graphics.fillStyle(0x3D8B37)
    graphics.fillEllipse(24, 20, 36, 24)
    
    // Shell pattern
    graphics.fillStyle(0x2D6B27)
    graphics.fillCircle(24, 20, 10)
    graphics.fillCircle(14, 16, 5)
    graphics.fillCircle(34, 16, 5)
    graphics.fillCircle(18, 26, 5)
    graphics.fillCircle(30, 26, 5)
    
    // Head
    graphics.fillStyle(0x5DAA57)
    graphics.fillCircle(42, 16, 8)
    
    // Eye
    graphics.fillStyle(0x000000)
    graphics.fillCircle(44, 14, 2)
    
    // Smile
    graphics.lineStyle(2, 0x2D6B27)
    graphics.beginPath()
    graphics.arc(42, 18, 3, 0, Math.PI, false)
    graphics.strokePath()
    
    // Flippers
    graphics.fillStyle(0x5DAA57)
    graphics.fillEllipse(10, 12, 12, 6)
    graphics.fillEllipse(10, 28, 12, 6)
    
    graphics.generateTexture('parentTurtle', 48, 36)
    graphics.destroy()
  }

  createParentSeahorseSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Parent seahorse - 28x44
    graphics.fillStyle(COLORS.mediumPurple)
    
    // Body
    graphics.fillEllipse(14, 26, 14, 22)
    
    // Head
    graphics.fillCircle(14, 8, 9)
    
    // Snout
    graphics.fillStyle(COLORS.deepPurple)
    graphics.fillEllipse(22, 8, 8, 4)
    
    // Eye
    graphics.fillStyle(0x000000)
    graphics.fillCircle(12, 6, 2.5)
    
    // Crown/fin on head
    graphics.fillStyle(COLORS.mediumPurple, 0.8)
    graphics.beginPath()
    graphics.moveTo(10, 2)
    graphics.lineTo(8, -2)
    graphics.lineTo(14, 0)
    graphics.lineTo(18, -2)
    graphics.lineTo(16, 2)
    graphics.closePath()
    graphics.fillPath()
    
    // Dorsal fin
    graphics.fillStyle(COLORS.mediumPurple, 0.7)
    graphics.beginPath()
    graphics.moveTo(6, 18)
    graphics.lineTo(2, 14)
    graphics.lineTo(2, 24)
    graphics.lineTo(6, 28)
    graphics.closePath()
    graphics.fillPath()
    
    // Tail curl
    graphics.lineStyle(5, COLORS.mediumPurple)
    graphics.beginPath()
    graphics.arc(14, 40, 8, 0, Math.PI, true)
    graphics.strokePath()
    
    graphics.generateTexture('parentSeahorse', 28, 48)
    graphics.destroy()
  }

  createParentFishSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Parent clownfish - 40x28
    // Body
    graphics.fillStyle(COLORS.brightCoral)
    graphics.fillEllipse(18, 14, 28, 20)
    
    // White stripes
    graphics.fillStyle(COLORS.white)
    graphics.fillRect(10, 4, 5, 20)
    graphics.fillRect(24, 6, 4, 16)
    
    // Tail
    graphics.fillStyle(COLORS.brightCoral)
    graphics.beginPath()
    graphics.moveTo(34, 14)
    graphics.lineTo(42, 4)
    graphics.lineTo(42, 24)
    graphics.closePath()
    graphics.fillPath()
    
    // Fins
    graphics.fillStyle(COLORS.sandyCoral)
    graphics.beginPath()
    graphics.moveTo(18, 4)
    graphics.lineTo(20, 0)
    graphics.lineTo(24, 4)
    graphics.closePath()
    graphics.fillPath()
    
    // Eye
    graphics.fillStyle(0x000000)
    graphics.fillCircle(8, 12, 3)
    graphics.fillStyle(COLORS.white)
    graphics.fillCircle(7, 11, 1.2)
    
    // Smile
    graphics.lineStyle(2, 0xCC6633)
    graphics.beginPath()
    graphics.arc(6, 16, 3, 0, Math.PI * 0.7, false)
    graphics.strokePath()
    
    graphics.generateTexture('parentFish', 44, 28)
    graphics.destroy()
  }

  createSpeedBoostSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Speed boost - Lightning bolt in bubble - 24x24
    // Outer bubble
    graphics.lineStyle(2, COLORS.lightTeal, 0.8)
    graphics.strokeCircle(12, 12, 10)
    
    // Inner glow
    graphics.fillStyle(COLORS.iceAqua, 0.3)
    graphics.fillCircle(12, 12, 9)
    
    // Lightning bolt
    graphics.fillStyle(0xFFD700) // Gold
    graphics.beginPath()
    graphics.moveTo(14, 4)
    graphics.lineTo(10, 12)
    graphics.lineTo(13, 12)
    graphics.lineTo(10, 20)
    graphics.lineTo(16, 10)
    graphics.lineTo(13, 10)
    graphics.lineTo(14, 4)
    graphics.closePath()
    graphics.fillPath()
    
    graphics.generateTexture('speedBoost', 24, 24)
    graphics.destroy()
  }

  createBubbleShieldSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Bubble shield - 24x24
    graphics.lineStyle(3, COLORS.lightTeal, 0.9)
    graphics.strokeCircle(12, 12, 10)
    
    graphics.lineStyle(2, COLORS.iceAqua, 0.6)
    graphics.strokeCircle(12, 12, 7)
    
    // Star/sparkle in center
    graphics.fillStyle(COLORS.white, 0.8)
    graphics.fillRect(10, 8, 4, 8)
    graphics.fillRect(8, 10, 8, 4)
    
    graphics.generateTexture('bubbleShield', 24, 24)
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
    
    // Background coral decoration - 60x80
    graphics.fillStyle(COLORS.brightCoral, 0.6)
    
    // Branch 1
    graphics.fillRoundedRect(10, 40, 12, 40, 4)
    graphics.fillCircle(16, 35, 10)
    
    // Branch 2
    graphics.fillStyle(COLORS.sandyCoral, 0.5)
    graphics.fillRoundedRect(28, 30, 10, 50, 4)
    graphics.fillCircle(33, 25, 8)
    
    // Branch 3
    graphics.fillStyle(COLORS.mediumPurple, 0.4)
    graphics.fillRoundedRect(42, 45, 8, 35, 3)
    graphics.fillCircle(46, 40, 7)
    
    graphics.generateTexture('coralDecor', 60, 80)
    graphics.destroy()
  }

  createSeaweedSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Seaweed decoration - 20x100
    graphics.fillStyle(0x2D8B57, 0.5)
    
    // Wavy strand
    for (let i = 0; i < 2; i++) {
      const x = 6 + i * 8
      graphics.beginPath()
      graphics.moveTo(x, 100)
      
      for (let y = 100; y > 0; y -= 15) {
        const wave = Math.sin(y * 0.08 + i) * 4
        graphics.lineTo(x + wave, y)
      }
      
      graphics.lineTo(x + 3, 0)
      
      for (let y = 0; y < 100; y += 15) {
        const wave = Math.sin(y * 0.08 + i) * 4
        graphics.lineTo(x + 3 + wave, y)
      }
      
      graphics.closePath()
      graphics.fillPath()
    }
    
    graphics.generateTexture('seaweedDecor', 20, 100)
    graphics.destroy()
  }

  createJellyfishSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Jellyfish hazard - 40x50 (dangerous!)
    // Bell (dome) - pinkish purple
    graphics.fillStyle(0xFF69B4, 0.8)
    graphics.fillEllipse(20, 15, 32, 24)
    
    // Inner glow - warning color
    graphics.fillStyle(0xFF1493, 0.5)
    graphics.fillEllipse(20, 14, 24, 18)
    
    // Angry eyes
    graphics.fillStyle(0x000000)
    graphics.fillCircle(14, 12, 3)
    graphics.fillCircle(26, 12, 3)
    
    // Evil eyebrows
    graphics.lineStyle(2, 0x000000)
    graphics.lineBetween(10, 8, 16, 10)
    graphics.lineBetween(30, 8, 24, 10)
    
    // Stinging tentacles
    graphics.lineStyle(3, 0xFF69B4, 0.9)
    graphics.beginPath()
    graphics.moveTo(8, 24)
    graphics.lineTo(4, 35)
    graphics.lineTo(10, 48)
    graphics.strokePath()
    
    graphics.beginPath()
    graphics.moveTo(16, 26)
    graphics.lineTo(12, 38)
    graphics.lineTo(18, 50)
    graphics.strokePath()
    
    graphics.beginPath()
    graphics.moveTo(24, 26)
    graphics.lineTo(28, 38)
    graphics.lineTo(22, 50)
    graphics.strokePath()
    
    graphics.beginPath()
    graphics.moveTo(32, 24)
    graphics.lineTo(36, 35)
    graphics.lineTo(30, 48)
    graphics.strokePath()
    
    graphics.generateTexture('jellyfish', 40, 50)
    graphics.destroy()
  }

  createSeaUrchinSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Sea urchin - 36x36 (spiky danger!)
    const centerX = 18
    const centerY = 18
    
    // Body
    graphics.fillStyle(0x2F1F4C) // Dark purple
    graphics.fillCircle(centerX, centerY, 10)
    
    // Spikes - many sharp points
    graphics.lineStyle(2, 0x1A0F2E)
    const numSpikes = 16
    for (let i = 0; i < numSpikes; i++) {
      const angle = (i / numSpikes) * Math.PI * 2
      const innerRadius = 10
      const outerRadius = 16 + Math.random() * 2
      const startX = centerX + Math.cos(angle) * innerRadius
      const startY = centerY + Math.sin(angle) * innerRadius
      const endX = centerX + Math.cos(angle) * outerRadius
      const endY = centerY + Math.sin(angle) * outerRadius
      graphics.lineBetween(startX, startY, endX, endY)
    }
    
    // Eyes
    graphics.fillStyle(0xFF0000) // Red angry eyes
    graphics.fillCircle(centerX - 3, centerY - 2, 2)
    graphics.fillCircle(centerX + 3, centerY - 2, 2)
    
    graphics.generateTexture('seaUrchin', 36, 36)
    graphics.destroy()
  }

  createTrashBottleSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Plastic bottle - 16x32 (pollution!)
    // Bottle body
    graphics.fillStyle(0x87CEEB, 0.7) // Light blue plastic
    graphics.fillRoundedRect(2, 10, 12, 20, 3)
    
    // Bottle neck
    graphics.fillStyle(0x87CEEB, 0.7)
    graphics.fillRect(5, 4, 6, 8)
    
    // Cap
    graphics.fillStyle(0xFF4444) // Red cap
    graphics.fillRect(4, 0, 8, 5)
    
    // Label
    graphics.fillStyle(0xFFFFFF, 0.5)
    graphics.fillRect(4, 14, 8, 10)
    
    // Crumpled look
    graphics.lineStyle(1, 0x5F9EA0, 0.5)
    graphics.lineBetween(4, 16, 12, 18)
    graphics.lineBetween(3, 22, 13, 20)
    
    graphics.generateTexture('trashBottle', 16, 32)
    graphics.destroy()
  }

  createTrashCanSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Soda can - 14x24 (pollution!)
    // Can body
    graphics.fillStyle(0xCC3333) // Red can
    graphics.fillRoundedRect(1, 4, 12, 18, 2)
    
    // Top rim
    graphics.fillStyle(0xC0C0C0) // Silver
    graphics.fillEllipse(7, 4, 12, 4)
    
    // Tab
    graphics.fillStyle(0xC0C0C0)
    graphics.fillEllipse(7, 2, 4, 2)
    
    // Label stripe
    graphics.fillStyle(0xFFFFFF, 0.3)
    graphics.fillRect(2, 10, 10, 4)
    
    // Dented look
    graphics.lineStyle(1, 0x991111)
    graphics.lineBetween(3, 8, 11, 12)
    
    graphics.generateTexture('trashCan', 14, 24)
    graphics.destroy()
  }

  createTrashBagSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Trash bag - 28x24 (pollution!)
    // Bag body
    graphics.fillStyle(0x333333) // Black bag
    graphics.fillEllipse(14, 14, 24, 18)
    
    // Tied top
    graphics.fillStyle(0x333333)
    graphics.beginPath()
    graphics.moveTo(10, 6)
    graphics.lineTo(14, 0)
    graphics.lineTo(18, 6)
    graphics.closePath()
    graphics.fillPath()
    
    // Wrinkles
    graphics.lineStyle(1, 0x555555)
    graphics.beginPath()
    graphics.arc(10, 12, 6, 0.5, 2, false)
    graphics.strokePath()
    graphics.beginPath()
    graphics.arc(18, 14, 5, 1, 2.5, false)
    graphics.strokePath()
    
    // Highlight
    graphics.fillStyle(0x555555, 0.3)
    graphics.fillEllipse(10, 10, 6, 4)
    
    graphics.generateTexture('trashBag', 28, 24)
    graphics.destroy()
  }

  createHeartSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0 })
    
    // Heart for lives display - 20x18
    graphics.fillStyle(0xFF6B8A) // Pink heart
    
    // Heart shape using two circles and a triangle
    graphics.fillCircle(6, 6, 6)
    graphics.fillCircle(14, 6, 6)
    graphics.beginPath()
    graphics.moveTo(0, 8)
    graphics.lineTo(10, 18)
    graphics.lineTo(20, 8)
    graphics.closePath()
    graphics.fillPath()
    
    // Highlight
    graphics.fillStyle(0xFFB6C1, 0.5)
    graphics.fillCircle(5, 5, 3)
    
    graphics.generateTexture('heart', 20, 18)
    graphics.destroy()
  }

  create() {
    this.scene.start('MenuScene')
  }
}

