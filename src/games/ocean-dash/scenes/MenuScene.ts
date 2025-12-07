import Phaser from 'phaser'
import { COLORS, DIFFICULTY_CONFIG, Difficulty } from '../config'

export class MenuScene extends Phaser.Scene {
  private selectedDifficulty: Difficulty = 'easy'
  private startPrompt!: Phaser.GameObjects.Text
  private thea!: Phaser.GameObjects.Sprite
  private bubbles: Phaser.GameObjects.Arc[] = []
  private difficultyButtons: Phaser.GameObjects.Container[] = []

  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    const { width, height } = this.cameras.main
    
    // Get stored difficulty or default
    this.selectedDifficulty = this.registry.get('difficulty') || 'easy'
    
    // Create animated underwater background
    this.createBackground()
    
    // Floating bubbles
    this.createBubbles()
    
    // Title
    this.add.text(width / 2, 80, "Thea's Ocean Dash", {
      fontFamily: 'Georgia, serif',
      fontSize: '42px',
      color: '#B8F0E8',
      stroke: '#1E3A5F',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#1E3A5F',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5)
    
    // Subtitle
    this.add.text(width / 2, 125, 'An Endless Swimming Adventure', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#98E8DC'
    }).setOrigin(0.5)
    
    // Thea preview (animated)
    this.thea = this.add.sprite(width / 2, height / 2 - 20, 'thea')
    this.thea.setScale(0.3125) // Scale down the larger mermaid image (25% bigger)
    
    // Gentle bobbing animation
    this.tweens.add({
      targets: this.thea,
      y: this.thea.y - 15,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Slight rotation
    this.tweens.add({
      targets: this.thea,
      angle: 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Difficulty selector
    this.createDifficultySelector()
    
    // Start prompt (pulsing)
    this.startPrompt = this.add.text(width / 2, height - 70, 'Tap or Press SPACE to Start!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      color: '#FF9966',
      stroke: '#1E3A5F',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: this.startPrompt,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // High score display
    const highScore = this.registry.get('highScore') || 0
    if (highScore > 0) {
      this.add.text(width / 2, height - 35, `🏆 Best: ${highScore}m`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#F4A460'
      }).setOrigin(0.5)
    }
    
    // Input handlers
    this.input.on('pointerdown', this.startGame, this)
    this.input.keyboard?.on('keydown-SPACE', this.startGame, this)
  }

  createBackground() {
    const { width, height } = this.cameras.main
    
    // Gradient background (deep to light)
    const bg = this.add.graphics()
    
    // Create vertical gradient effect
    for (let y = 0; y < height; y += 2) {
      const ratio = y / height
      const r = Math.floor(30 + (93 - 30) * (1 - ratio))
      const g = Math.floor(58 + (213 - 58) * (1 - ratio))
      const b = Math.floor(95 + (195 - 95) * (1 - ratio))
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1)
      bg.fillRect(0, y, width, 2)
    }
    
    // Add some coral silhouettes at bottom
    const coralColors = [0x2D5A5A, 0x3D6A6A, 0x4D7A7A]
    for (let i = 0; i < 6; i++) {
      const coral = this.add.graphics()
      coral.fillStyle(coralColors[i % 3], 0.3)
      const x = i * 150 + Math.random() * 50
      const h = 40 + Math.random() * 60
      coral.fillRoundedRect(x, height - h, 30 + Math.random() * 40, h, 10)
      coral.fillCircle(x + 20, height - h, 15 + Math.random() * 10)
    }
  }

  createBubbles() {
    const { width, height } = this.cameras.main
    
    // Create floating bubbles
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = height + Math.random() * 100
      const size = 4 + Math.random() * 8
      
      const bubble = this.add.circle(x, y, size, COLORS.iceAqua, 0.3)
      this.bubbles.push(bubble)
      
      // Animate bubble rising
      this.tweens.add({
        targets: bubble,
        y: -20,
        x: bubble.x + (Math.random() - 0.5) * 100,
        duration: 4000 + Math.random() * 4000,
        repeat: -1,
        delay: Math.random() * 3000,
        onRepeat: () => {
          bubble.x = Math.random() * width
          bubble.y = height + 20
        }
      })
    }
  }

  createDifficultySelector() {
    const { width, height } = this.cameras.main
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
    const buttonWidth = 100
    const spacing = 20
    const totalWidth = difficulties.length * buttonWidth + (difficulties.length - 1) * spacing
    const startX = (width - totalWidth) / 2 + buttonWidth / 2
    
    this.add.text(width / 2, height / 2 + 70, 'Select Difficulty:', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#98E8DC'
    }).setOrigin(0.5)
    
    difficulties.forEach((diff, index) => {
      const x = startX + index * (buttonWidth + spacing)
      const y = height / 2 + 110
      
      const container = this.add.container(x, y)
      
      // Button background
      const bg = this.add.graphics()
      const isSelected = diff === this.selectedDifficulty
      bg.fillStyle(isSelected ? COLORS.lightTeal : COLORS.darkNavy, isSelected ? 1 : 0.8)
      bg.lineStyle(2, COLORS.lightTeal)
      bg.fillRoundedRect(-buttonWidth / 2, -18, buttonWidth, 36, 8)
      bg.strokeRoundedRect(-buttonWidth / 2, -18, buttonWidth, 36, 8)
      
      // Button text
      const label = diff.charAt(0).toUpperCase() + diff.slice(1)
      const text = this.add.text(0, 0, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: isSelected ? '#1E3A5F' : '#B8F0E8'
      }).setOrigin(0.5)
      
      container.add([bg, text])
      container.setSize(buttonWidth, 36)
      container.setInteractive({ useHandCursor: true })
      
      container.on('pointerover', () => {
        if (diff !== this.selectedDifficulty) {
          bg.clear()
          bg.fillStyle(COLORS.mediumTeal, 0.6)
          bg.lineStyle(2, COLORS.lightTeal)
          bg.fillRoundedRect(-buttonWidth / 2, -18, buttonWidth, 36, 8)
          bg.strokeRoundedRect(-buttonWidth / 2, -18, buttonWidth, 36, 8)
        }
      })
      
      container.on('pointerout', () => {
        if (diff !== this.selectedDifficulty) {
          bg.clear()
          bg.fillStyle(COLORS.darkNavy, 0.8)
          bg.lineStyle(2, COLORS.lightTeal)
          bg.fillRoundedRect(-buttonWidth / 2, -18, buttonWidth, 36, 8)
          bg.strokeRoundedRect(-buttonWidth / 2, -18, buttonWidth, 36, 8)
        }
      })
      
      container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation()
        this.selectDifficulty(diff)
      })
      
      this.difficultyButtons.push(container)
    })
  }

  selectDifficulty(diff: Difficulty) {
    this.selectedDifficulty = diff
    this.registry.set('difficulty', diff)
    
    // Update button visuals
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
    this.difficultyButtons.forEach((container, index) => {
      const bg = container.getAt(0) as Phaser.GameObjects.Graphics
      const text = container.getAt(1) as Phaser.GameObjects.Text
      const isSelected = difficulties[index] === diff
      
      bg.clear()
      bg.fillStyle(isSelected ? COLORS.lightTeal : COLORS.darkNavy, isSelected ? 1 : 0.8)
      bg.lineStyle(2, COLORS.lightTeal)
      bg.fillRoundedRect(-50, -18, 100, 36, 8)
      bg.strokeRoundedRect(-50, -18, 100, 36, 8)
      
      text.setColor(isSelected ? '#1E3A5F' : '#B8F0E8')
    })
  }

  startGame = () => {
    // Store the difficulty for the game scene
    this.registry.set('difficulty', this.selectedDifficulty)
    
    // Update physics gravity based on difficulty
    const config = DIFFICULTY_CONFIG[this.selectedDifficulty]
    this.physics.world.gravity.y = config.gravity
    
    this.scene.start('GameScene')
  }

  update() {
    // Bubbles are animated via tweens
  }
}

