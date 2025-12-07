import Phaser from 'phaser'
import { COLORS, DIFFICULTY_CONFIG, Difficulty } from '../config'

interface Obstacle extends Phaser.Physics.Arcade.Sprite {
  passed?: boolean
}

export class GameScene extends Phaser.Scene {
  private thea!: Phaser.Physics.Arcade.Sprite
  private pearls!: Phaser.Physics.Arcade.Group
  private obstacles!: Phaser.Physics.Arcade.Group
  private shields!: Phaser.Physics.Arcade.Group
  private goldenShells!: Phaser.Physics.Arcade.Group
  
  private distance: number = 0
  private pearlsCollected: number = 0
  private isGameOver: boolean = false
  private isShielded: boolean = false
  private shieldSprite?: Phaser.GameObjects.Sprite
  
  private distanceText!: Phaser.GameObjects.Text
  private pearlText!: Phaser.GameObjects.Text
  
  private difficulty!: Difficulty
  private gameSpeed: number = 0
  private obstacleTimer!: Phaser.Time.TimerEvent
  private pearlTimer!: Phaser.Time.TimerEvent
  
  // Parallax backgrounds
  private bgFar!: Phaser.GameObjects.TileSprite
  private bgMid!: Phaser.GameObjects.TileSprite
  private bgNear!: Phaser.GameObjects.TileSprite

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Get difficulty setting
    this.difficulty = this.registry.get('difficulty') || 'easy'
    const config = DIFFICULTY_CONFIG[this.difficulty]
    this.gameSpeed = config.baseSpeed
    
    // Reset game state
    this.distance = 0
    this.pearlsCollected = 0
    this.isGameOver = false
    this.isShielded = false
    
    // Update physics gravity
    this.physics.world.gravity.y = config.gravity
    
    // Create parallax backgrounds
    this.createBackgrounds()
    
    // Create Thea
    this.createThea()
    
    // Create bubble particles
    this.createBubbleParticles()
    
    // Create groups
    this.pearls = this.physics.add.group()
    this.obstacles = this.physics.add.group()
    this.shields = this.physics.add.group()
    this.goldenShells = this.physics.add.group()
    
    // Collisions
    this.physics.add.overlap(this.thea, this.pearls, this.collectPearl as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.goldenShells, this.collectGoldenShell as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.shields, this.collectShield as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.obstacles, this.hitObstacle as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    
    // HUD
    this.createHUD()
    
    // Input
    this.input.on('pointerdown', this.swim, this)
    this.input.keyboard?.on('keydown-SPACE', this.swim, this)
    
    // Spawn timers
    this.obstacleTimer = this.time.addEvent({
      delay: config.obstacleFrequency,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    })
    
    this.pearlTimer = this.time.addEvent({
      delay: 800,
      callback: this.spawnPearl,
      callbackScope: this,
      loop: true
    })
    
    // Occasionally spawn golden shells
    this.time.addEvent({
      delay: 8000,
      callback: this.spawnGoldenShell,
      callbackScope: this,
      loop: true
    })
    
    // Occasionally spawn shield power-ups
    this.time.addEvent({
      delay: 15000,
      callback: this.spawnShield,
      callbackScope: this,
      loop: true
    })
    
    // Initial obstacle after a delay
    this.time.delayedCall(2000, this.spawnObstacle, [], this)
  }

  createBackgrounds() {
    const { width, height } = this.cameras.main
    
    // Create gradient backgrounds as tile sprites
    // Far background (darkest)
    const bgFarGraphics = this.make.graphics({ x: 0, y: 0 })
    for (let y = 0; y < height; y += 2) {
      const ratio = y / height
      const r = Math.floor(20 + 20 * ratio)
      const g = Math.floor(40 + 30 * ratio)
      const b = Math.floor(70 + 40 * ratio)
      bgFarGraphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1)
      bgFarGraphics.fillRect(0, y, 100, 2)
    }
    bgFarGraphics.generateTexture('bgFar', 100, height)
    bgFarGraphics.destroy()
    
    this.bgFar = this.add.tileSprite(0, 0, width, height, 'bgFar')
    this.bgFar.setOrigin(0, 0)
    
    // Mid background - coral silhouettes
    const bgMidGraphics = this.make.graphics({ x: 0, y: 0 })
    bgMidGraphics.fillStyle(0x000000, 0) // Transparent base
    
    // Draw coral silhouettes
    for (let x = 0; x < 400; x += 80) {
      bgMidGraphics.fillStyle(0x2D5A5A, 0.4)
      const h = 60 + Math.random() * 80
      bgMidGraphics.fillRoundedRect(x + Math.random() * 20, height - h, 25 + Math.random() * 30, h, 8)
      bgMidGraphics.fillCircle(x + 20, height - h, 12 + Math.random() * 8)
    }
    bgMidGraphics.generateTexture('bgMid', 400, height)
    bgMidGraphics.destroy()
    
    this.bgMid = this.add.tileSprite(0, 0, width, height, 'bgMid')
    this.bgMid.setOrigin(0, 0)
    
    // Near background - kelp
    const bgNearGraphics = this.make.graphics({ x: 0, y: 0 })
    for (let x = 0; x < 300; x += 60) {
      bgNearGraphics.fillStyle(0x3D7A5A, 0.3)
      const h = 80 + Math.random() * 100
      bgNearGraphics.fillRoundedRect(x + Math.random() * 30, height - h, 12, h, 4)
    }
    bgNearGraphics.generateTexture('bgNear', 300, height)
    bgNearGraphics.destroy()
    
    this.bgNear = this.add.tileSprite(0, 0, width, height, 'bgNear')
    this.bgNear.setOrigin(0, 0)
    
    // Ocean floor
    const floor = this.add.graphics()
    floor.fillStyle(0x1A3050)
    floor.fillRect(0, height - 20, width, 20)
    
    // Sandy texture
    floor.fillStyle(COLORS.sandyCoral, 0.3)
    for (let x = 0; x < width; x += 40) {
      floor.fillCircle(x + Math.random() * 30, height - 10, 3 + Math.random() * 5)
    }
  }

  createThea() {
    const { height } = this.cameras.main
    
    this.thea = this.physics.add.sprite(100, height / 2, 'thea')
    // Scale down the larger mermaid image to fit the game (25% bigger than initial)
    this.thea.setScale(0.1875)
    this.thea.setCollideWorldBounds(true)
    this.thea.setGravityY(0) // We'll handle gravity through the difficulty config
    
    // Set body size for better collision (adjusted for scaled image)
    // The image is ~500px, scaled to 0.15 = ~75px, hitbox should be slightly smaller
    this.thea.body?.setSize(350, 400)
    this.thea.body?.setOffset(75, 50)
    
    // Gentle idle animation
    this.tweens.add({
      targets: this.thea,
      angle: { from: -5, to: 5 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  createBubbleParticles() {
    // Create bubble particle emitter
    this.add.particles(0, 0, 'bubble', {
      speed: { min: 20, max: 50 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.5, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1500,
      frequency: 200,
      follow: this.thea,
      followOffset: { x: 30, y: 0 }
    })
  }

  createHUD() {
    const { width } = this.cameras.main
    
    // Background for HUD
    const hudBg = this.add.graphics()
    hudBg.fillStyle(COLORS.darkNavy, 0.7)
    hudBg.fillRoundedRect(width - 220, 10, 210, 40, 10)
    hudBg.setScrollFactor(0)
    hudBg.setDepth(100)
    
    // Pearl counter
    const pearlIcon = this.add.sprite(width - 200, 30, 'pearl')
    pearlIcon.setScrollFactor(0)
    pearlIcon.setDepth(100)
    pearlIcon.setScale(1.5)
    
    this.pearlText = this.add.text(width - 180, 30, '0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#B8F0E8',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(100)
    
    // Distance counter
    this.distanceText = this.add.text(width - 100, 30, '0m', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#F4A460',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(100)
    
    // Pause button
    const pauseBtn = this.add.text(20, 20, '⏸️', {
      fontSize: '28px'
    }).setScrollFactor(0).setDepth(100).setInteractive({ useHandCursor: true })
    
    pauseBtn.on('pointerdown', () => {
      this.scene.pause()
      // Could show pause menu here
    })
  }

  swim = () => {
    if (this.isGameOver) return
    
    const config = DIFFICULTY_CONFIG[this.difficulty]
    this.thea.setVelocityY(config.swimForce)
    
    // Quick swim animation
    this.tweens.add({
      targets: this.thea,
      angle: -15,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut'
    })
  }

  spawnPearl() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const y = Phaser.Math.Between(60, height - 80)
    
    const pearl = this.pearls.create(width + 20, y, 'pearl') as Phaser.Physics.Arcade.Sprite
    pearl.setVelocityX(-this.gameSpeed)
    const pearlBody = pearl.body as Phaser.Physics.Arcade.Body
    if (pearlBody) pearlBody.allowGravity = false
    
    // Slight bobbing
    this.tweens.add({
      targets: pearl,
      y: pearl.y - 10,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Sometimes spawn in clusters
    if (Math.random() > 0.6) {
      for (let i = 1; i < 4; i++) {
        const clusterPearl = this.pearls.create(width + 20 + i * 25, y + (Math.random() - 0.5) * 40, 'pearl') as Phaser.Physics.Arcade.Sprite
        clusterPearl.setVelocityX(-this.gameSpeed)
        const clusterBody = clusterPearl.body as Phaser.Physics.Arcade.Body
        if (clusterBody) clusterBody.allowGravity = false
      }
    }
  }

  spawnGoldenShell() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const y = Phaser.Math.Between(80, height - 100)
    
    const shell = this.goldenShells.create(width + 20, y, 'goldenShell') as Phaser.Physics.Arcade.Sprite
    shell.setVelocityX(-this.gameSpeed)
    const shellBody = shell.body as Phaser.Physics.Arcade.Body
    if (shellBody) shellBody.allowGravity = false
    shell.setScale(1.5)
    
    // Sparkle effect
    this.tweens.add({
      targets: shell,
      angle: 360,
      duration: 2000,
      repeat: -1
    })
    
    this.tweens.add({
      targets: shell,
      scale: { from: 1.5, to: 1.8 },
      duration: 500,
      yoyo: true,
      repeat: -1
    })
  }

  spawnShield() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const y = Phaser.Math.Between(80, height - 100)
    
    const shield = this.shields.create(width + 20, y, 'shield') as Phaser.Physics.Arcade.Sprite
    shield.setVelocityX(-this.gameSpeed)
    const shieldBody = shield.body as Phaser.Physics.Arcade.Body
    if (shieldBody) shieldBody.allowGravity = false
    shield.setScale(2)
    
    // Pulsing effect
    this.tweens.add({
      targets: shield,
      alpha: { from: 1, to: 0.5 },
      scale: { from: 2, to: 2.3 },
      duration: 400,
      yoyo: true,
      repeat: -1
    })
  }

  spawnObstacle() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    
    // Random obstacle type
    const obstacleTypes = ['jellyfish', 'seaweed', 'coral']
    const type = Phaser.Math.RND.pick(obstacleTypes)
    
    let obstacle: Obstacle
    
    switch (type) {
      case 'jellyfish':
        const jellyfishY = Phaser.Math.Between(60, height - 100)
        obstacle = this.obstacles.create(width + 30, jellyfishY, 'jellyfish') as Obstacle
        obstacle.setScale(1.2)
        
        // Floating up and down
        this.tweens.add({
          targets: obstacle,
          y: obstacle.y - 40,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
        
      case 'seaweed':
        obstacle = this.obstacles.create(width + 30, height - 60, 'seaweed') as Obstacle
        obstacle.setOrigin(0.5, 1)
        
        // Swaying
        this.tweens.add({
          targets: obstacle,
          angle: { from: -5, to: 5 },
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
        
      case 'coral':
        obstacle = this.obstacles.create(width + 40, height - 40, 'coral') as Obstacle
        obstacle.setOrigin(0.5, 1)
        obstacle.setScale(1.2)
        break
        
      default:
        obstacle = this.obstacles.create(width + 30, height / 2, 'jellyfish') as Obstacle
    }
    
    obstacle.setVelocityX(-this.gameSpeed)
    const obstacleBody = obstacle.body as Phaser.Physics.Arcade.Body
    if (obstacleBody) obstacleBody.allowGravity = false
    obstacle.passed = false
    
    // Adjust hitbox
    if (type === 'jellyfish') {
      obstacle.body?.setSize(30, 40)
      obstacle.body?.setOffset(5, 5)
    }
  }

  collectPearl(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, pearl: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const pearlSprite = pearl as Phaser.Physics.Arcade.Sprite
    
    // Prevent double-collection
    if (!pearlSprite.active) return
    
    // Disable immediately to prevent further interactions
    pearlSprite.setActive(false)
    pearlSprite.body?.enable && (pearlSprite.body.enable = false)
    
    // Collect animation - fly to HUD
    this.tweens.add({
      targets: pearlSprite,
      x: this.cameras.main.width - 200,
      y: 30,
      scale: 0.5,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (pearlSprite) pearlSprite.destroy()
      }
    })
    
    this.pearlsCollected++
    this.pearlText.setText(this.pearlsCollected.toString())
    
    // Quick scale pop on counter
    this.tweens.add({
      targets: this.pearlText,
      scale: { from: 1.3, to: 1 },
      duration: 150
    })
  }

  collectGoldenShell(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, shell: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const shellSprite = shell as Phaser.Physics.Arcade.Sprite
    
    // Prevent double-collection
    if (!shellSprite.active) return
    
    // Disable immediately to prevent further interactions
    shellSprite.setActive(false)
    shellSprite.body?.enable && (shellSprite.body.enable = false)
    
    // Collect animation with sparkles
    this.tweens.add({
      targets: shellSprite,
      x: this.cameras.main.width - 200,
      y: 30,
      scale: 0.3,
      alpha: 0,
      duration: 400,
      onComplete: () => {
        if (shellSprite) shellSprite.destroy()
      }
    })
    
    this.pearlsCollected += 5
    this.pearlText.setText(this.pearlsCollected.toString())
    
    // Bigger celebration
    this.tweens.add({
      targets: this.pearlText,
      scale: { from: 1.5, to: 1 },
      duration: 200
    })
    
    // Flash effect
    this.cameras.main.flash(200, 244, 164, 96, false)
  }

  collectShield(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, shield: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const shieldSprite = shield as Phaser.Physics.Arcade.Sprite
    
    // Prevent double-collection
    if (!shieldSprite.active) return
    
    shieldSprite.destroy()
    
    if (this.isShielded) return
    
    this.isShielded = true
    
    // Create shield bubble around Thea
    this.shieldSprite = this.add.sprite(this.thea.x, this.thea.y, 'shield')
    this.shieldSprite.setScale(5)
    this.shieldSprite.setAlpha(0.5)
    
    // Pulsing shield effect
    this.tweens.add({
      targets: this.shieldSprite,
      alpha: { from: 0.5, to: 0.2 },
      scale: { from: 5, to: 5.5 },
      duration: 300,
      yoyo: true,
      repeat: -1
    })
    
    // Shield duration
    this.time.delayedCall(5000, () => {
      if (this.shieldSprite) {
        this.tweens.add({
          targets: this.shieldSprite,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.shieldSprite?.destroy()
            this.shieldSprite = undefined
            this.isShielded = false
          }
        })
      }
    })
    
    // Visual feedback
    this.cameras.main.flash(200, 93, 211, 195, false)
  }

  hitObstacle(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    if (this.isShielded) {
      // Destroy obstacle instead
      const obstacleSprite = obstacle as Phaser.Physics.Arcade.Sprite
      
      this.tweens.add({
        targets: obstacleSprite,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        onComplete: () => {
          obstacleSprite.destroy()
        }
      })
      return
    }
    
    if (this.isGameOver) return
    
    this.gameOver()
  }

  gameOver() {
    this.isGameOver = true
    
    // Stop timers
    this.obstacleTimer.remove()
    this.pearlTimer.remove()
    
    // Stop all movement
    this.pearls.setVelocityX(0)
    this.obstacles.setVelocityX(0)
    this.shields.setVelocityX(0)
    this.goldenShells.setVelocityX(0)
    
    // Thea hit animation
    this.tweens.add({
      targets: this.thea,
      angle: 180,
      alpha: 0.7,
      duration: 500,
      onComplete: () => {
        // Check for high score
        const highScore = this.registry.get('highScore') || 0
        const isNewHighScore = this.distance > highScore
        
        if (isNewHighScore) {
          this.registry.set('highScore', this.distance)
        }
        
        // Pass data to game over scene
        this.scene.start('GameOverScene', {
          distance: this.distance,
          pearls: this.pearlsCollected,
          isNewHighScore,
          difficulty: this.difficulty
        })
        
        // Call the onGameOver callback
        const onGameOver = this.registry.get('onGameOver')
        if (onGameOver) {
          onGameOver(this.distance, this.pearlsCollected)
        }
      }
    })
    
    // Camera shake
    this.cameras.main.shake(300, 0.02)
    
    // Flash
    this.cameras.main.flash(200, 255, 100, 100, false)
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) return
    
    // Update distance
    this.distance += Math.round(this.gameSpeed * delta / 1000)
    this.distanceText.setText(`${this.distance}m`)
    
    // Parallax scrolling
    this.bgFar.tilePositionX += this.gameSpeed * 0.1 * delta / 1000
    this.bgMid.tilePositionX += this.gameSpeed * 0.3 * delta / 1000
    this.bgNear.tilePositionX += this.gameSpeed * 0.6 * delta / 1000
    
    // Update shield position
    if (this.shieldSprite) {
      this.shieldSprite.x = this.thea.x
      this.shieldSprite.y = this.thea.y
    }
    
    // Gradual speed increase
    const config = DIFFICULTY_CONFIG[this.difficulty]
    this.gameSpeed = config.baseSpeed + Math.floor(this.distance / 500) * 20
    
    // Update obstacle timer frequency based on speed (recreate timer with new delay)
    if (this.distance > 0 && this.distance % 500 === 0) {
      const newDelay = Math.max(config.obstacleFrequency - Math.floor(this.distance / 500) * 200, 1000)
      this.obstacleTimer.reset({
        delay: newDelay,
        callback: this.spawnObstacle,
        callbackScope: this,
        loop: true
      })
    }
    
    // Clean up off-screen objects and update velocities
    // Use slice() to avoid modifying array while iterating
    this.pearls.getChildren().slice().forEach((pearl) => {
      const p = pearl as Phaser.Physics.Arcade.Sprite
      if (!p.active) return // Skip if already destroyed
      if (p.x < -50) {
        p.destroy()
        return
      }
      p.setVelocityX(-this.gameSpeed)
    })
    
    this.obstacles.getChildren().slice().forEach((obstacle) => {
      const o = obstacle as Phaser.Physics.Arcade.Sprite
      if (!o.active) return // Skip if already destroyed
      if (o.x < -100) {
        o.destroy()
        return
      }
      o.setVelocityX(-this.gameSpeed)
    })
    
    this.goldenShells.getChildren().slice().forEach((shell) => {
      const s = shell as Phaser.Physics.Arcade.Sprite
      if (!s.active) return // Skip if already destroyed
      if (s.x < -50) {
        s.destroy()
        return
      }
      s.setVelocityX(-this.gameSpeed)
    })
    
    this.shields.getChildren().slice().forEach((shield) => {
      const s = shield as Phaser.Physics.Arcade.Sprite
      if (!s.active) return // Skip if already destroyed
      if (s.x < -50) {
        s.destroy()
        return
      }
      s.setVelocityX(-this.gameSpeed)
    })
  }
}

