import Phaser from 'phaser'
import { COLORS, DIFFICULTY_CONFIG, Difficulty } from '../config'

interface Platform extends Phaser.Physics.Arcade.Sprite {
  passed?: boolean
}

interface BabyCreature extends Phaser.Physics.Arcade.Sprite {
  creatureType: 'turtle' | 'seahorse' | 'fish'
  isFollowing?: boolean
}

interface ParentCreature extends Phaser.Physics.Arcade.Sprite {
  creatureType: 'turtle' | 'seahorse' | 'fish'
}

export class GameScene extends Phaser.Scene {
  private thea!: Phaser.Physics.Arcade.Sprite
  private platforms!: Phaser.Physics.Arcade.Group
  private shells!: Phaser.Physics.Arcade.Group
  private pearls!: Phaser.Physics.Arcade.Group
  private babyCreatures!: Phaser.Physics.Arcade.Group
  private parentCreatures!: Phaser.Physics.Arcade.Group
  private speedBoosts!: Phaser.Physics.Arcade.Group
  private bubbleShields!: Phaser.Physics.Arcade.Group
  private hazards!: Phaser.Physics.Arcade.Group
  
  private score: number = 0
  private shellsCollected: number = 0
  private pearlsCollected: number = 0
  private babiesReunited: number = 0
  private lives: number = 3
  private isGameOver: boolean = false
  private canDoubleJump: boolean = false
  private hasDoubleJumped: boolean = false
  private isShielded: boolean = false
  private isSpeedBoosted: boolean = false
  private isInvincible: boolean = false
  private shieldSprite?: Phaser.GameObjects.Sprite
  private followingBabies: BabyCreature[] = []
  private heartSprites: Phaser.GameObjects.Sprite[] = []
  
  private scoreText!: Phaser.GameObjects.Text
  private shellText!: Phaser.GameObjects.Text
  private babyText!: Phaser.GameObjects.Text
  
  private difficulty!: Difficulty
  private gameSpeed: number = 0
  private platformTimer!: Phaser.Time.TimerEvent
  private collectibleTimer!: Phaser.Time.TimerEvent
  private hazardTimer!: Phaser.Time.TimerEvent
  
  // Parallax backgrounds
  private bgFar!: Phaser.GameObjects.TileSprite
  private bgMid!: Phaser.GameObjects.TileSprite
  
  // Keyboard controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private spaceKey!: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.difficulty = this.registry.get('difficulty') || 'easy'
    const config = DIFFICULTY_CONFIG[this.difficulty]
    this.gameSpeed = config.platformSpeed
    
    // Reset game state
    this.score = 0
    this.shellsCollected = 0
    this.pearlsCollected = 0
    this.babiesReunited = 0
    this.lives = config.startingLives
    this.isGameOver = false
    this.canDoubleJump = false
    this.hasDoubleJumped = false
    this.isShielded = false
    this.isSpeedBoosted = false
    this.isInvincible = false
    this.followingBabies = []
    this.heartSprites = []
    
    // Update physics gravity
    this.physics.world.gravity.y = config.gravity
    
    // Create backgrounds
    this.createBackgrounds()
    
    // Create groups
    this.platforms = this.physics.add.group()
    this.shells = this.physics.add.group()
    this.pearls = this.physics.add.group()
    this.babyCreatures = this.physics.add.group()
    this.parentCreatures = this.physics.add.group()
    this.speedBoosts = this.physics.add.group()
    this.bubbleShields = this.physics.add.group()
    this.hazards = this.physics.add.group()
    
    // Create initial platforms
    this.createInitialPlatforms()
    
    // Create Thea
    this.createThea()
    
    // Create bubble particles
    this.createBubbleParticles()
    
    // Collisions
    this.physics.add.collider(this.thea, this.platforms, this.onPlatformLand, undefined, this)
    this.physics.add.overlap(this.thea, this.shells, this.collectShell as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.pearls, this.collectPearl as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.babyCreatures, this.rescueBaby as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.parentCreatures, this.reuniteFamily as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.speedBoosts, this.collectSpeedBoost as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.bubbleShields, this.collectBubbleShield as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    this.physics.add.overlap(this.thea, this.hazards, this.hitHazard as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)
    
    // HUD
    this.createHUD()
    
    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.input.on('pointerdown', this.jump, this)
    
    // Spawn timers
    this.platformTimer = this.time.addEvent({
      delay: config.platformFrequency,
      callback: this.spawnPlatform,
      callbackScope: this,
      loop: true
    })
    
    this.collectibleTimer = this.time.addEvent({
      delay: config.collectibleFrequency,
      callback: this.spawnCollectible,
      callbackScope: this,
      loop: true
    })
    
    // Spawn baby creatures occasionally
    this.time.addEvent({
      delay: config.babyCreatureFrequency,
      callback: this.spawnBabyCreature,
      callbackScope: this,
      loop: true
    })
    
    // Spawn power-ups
    this.time.addEvent({
      delay: 12000,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true
    })
    
    // Spawn hazards
    this.hazardTimer = this.time.addEvent({
      delay: config.hazardFrequency,
      callback: this.spawnHazard,
      callbackScope: this,
      loop: true
    })
    
    // First hazard after a short delay
    this.time.delayedCall(3000, this.spawnHazard, [], this)
  }

  createBackgrounds() {
    const { width, height } = this.cameras.main
    
    // Far background - gradient ocean
    const bgFarGraphics = this.make.graphics({ x: 0, y: 0 })
    for (let y = 0; y < height; y += 2) {
      const ratio = y / height
      const r = Math.floor(20 + 25 * ratio)
      const g = Math.floor(45 + 35 * ratio)
      const b = Math.floor(80 + 30 * ratio)
      bgFarGraphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1)
      bgFarGraphics.fillRect(0, y, 100, 2)
    }
    bgFarGraphics.generateTexture('bgFar', 100, height)
    bgFarGraphics.destroy()
    
    this.bgFar = this.add.tileSprite(0, 0, width, height, 'bgFar')
    this.bgFar.setOrigin(0, 0)
    
    // Mid background - coral silhouettes
    const bgMidGraphics = this.make.graphics({ x: 0, y: 0 })
    
    for (let x = 0; x < 500; x += 100) {
      bgMidGraphics.fillStyle(0x2D5A5A, 0.35)
      const h = 50 + Math.random() * 70
      bgMidGraphics.fillRoundedRect(x + Math.random() * 30, height - h, 30 + Math.random() * 40, h, 8)
      bgMidGraphics.fillCircle(x + 25, height - h, 15 + Math.random() * 10)
    }
    bgMidGraphics.generateTexture('bgMid', 500, height)
    bgMidGraphics.destroy()
    
    this.bgMid = this.add.tileSprite(0, 0, width, height, 'bgMid')
    this.bgMid.setOrigin(0, 0)
    
    // Ocean floor
    const floor = this.add.graphics()
    floor.fillStyle(COLORS.sandyCoral, 0.5)
    floor.fillRect(0, height - 15, width, 15)
    
    // Sandy texture
    floor.fillStyle(0xE8C078, 0.3)
    for (let x = 0; x < width; x += 30) {
      floor.fillCircle(x + Math.random() * 20, height - 8, 2 + Math.random() * 4)
    }
  }

  createInitialPlatforms() {
    const { height } = this.cameras.main
    
    // Ground platform (starting area)
    const ground = this.platforms.create(150, height - 50, 'platform') as Platform
    ground.setScale(2, 1)
    ground.refreshBody()
    const groundBody = ground.body as Phaser.Physics.Arcade.Body
    groundBody.setImmovable(true)
    groundBody.allowGravity = false
    groundBody.setVelocityX(0) // Starting platform doesn't move
    
    // A few starter platforms
    for (let i = 0; i < 4; i++) {
      const x = 350 + i * 180
      const y = height - 100 - Math.random() * 150
      this.createPlatform(x, y)
    }
  }

  createPlatform(x: number, y: number, hasCollectible: boolean = Math.random() > 0.5): Platform {
    const platform = this.platforms.create(x, y, 'platform') as Platform
    const platformBody = platform.body as Phaser.Physics.Arcade.Body
    platformBody.setImmovable(true)
    platformBody.allowGravity = false
    platformBody.setVelocityX(-this.gameSpeed)
    platform.passed = false
    
    // Sometimes add a collectible on the platform
    if (hasCollectible) {
      const collectibleType = Math.random() > 0.3 ? 'shell' : 'pearl'
      const collectible = collectibleType === 'shell' 
        ? this.shells.create(x, y - 25, 'shell')
        : this.pearls.create(x, y - 25, 'pearl')
      
      const collectibleBody = collectible.body as Phaser.Physics.Arcade.Body
      collectibleBody.allowGravity = false
      collectibleBody.setVelocityX(-this.gameSpeed)
      
      // Bobbing animation
      this.tweens.add({
        targets: collectible,
        y: collectible.y - 8,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
    
    return platform
  }

  createThea() {
    const { height } = this.cameras.main
    
    this.thea = this.physics.add.sprite(120, height - 120, 'thea')
    // Scale down the larger mermaid image to fit the game (same as Ocean Dash)
    this.thea.setScale(0.1875)
    this.thea.setCollideWorldBounds(true)
    this.thea.setDepth(50) // Ensure Thea renders above backgrounds
    
    // Set body size for better collision (adjusted for scaled image)
    this.thea.body?.setSize(350, 400)
    this.thea.body?.setOffset(75, 50)

    // Apply custom avatar config
    const avatarConfig = this.registry.get('avatarConfig')
    if (avatarConfig && avatarConfig.tint) {
      this.thea.setTint(avatarConfig.tint)
    } else {
      this.thea.clearTint()
    }
    
    // Gentle idle animation (same as Ocean Dash)
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
    this.add.particles(0, 0, 'bubble', {
      speed: { min: 15, max: 40 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 1200,
      frequency: 300,
      follow: this.thea,
      followOffset: { x: 0, y: 20 }
    })
  }

  createHUD() {
    const { width } = this.cameras.main
    
    // HUD background
    const hudBg = this.add.graphics()
    hudBg.fillStyle(COLORS.darkNavy, 0.7)
    hudBg.fillRoundedRect(width - 280, 10, 270, 45, 10)
    hudBg.setScrollFactor(0)
    hudBg.setDepth(100)
    
    // Score
    this.add.text(width - 270, 22, '⭐', { fontSize: '18px' }).setScrollFactor(0).setDepth(100)
    this.scoreText = this.add.text(width - 248, 25, '0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#F4A460',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(100)
    
    // Shells
    this.add.text(width - 190, 22, '🐚', { fontSize: '18px' }).setScrollFactor(0).setDepth(100)
    this.shellText = this.add.text(width - 168, 25, '0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#98E8DC',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(100)
    
    // Babies reunited
    this.add.text(width - 110, 22, '🐢', { fontSize: '18px' }).setScrollFactor(0).setDepth(100)
    this.babyText = this.add.text(width - 88, 25, '0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#B8F0E8',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(100)
    
    // Lives (hearts) - top left
    const livesBg = this.add.graphics()
    livesBg.fillStyle(COLORS.darkNavy, 0.7)
    livesBg.fillRoundedRect(15, 10, 100, 40, 10)
    livesBg.setScrollFactor(0)
    livesBg.setDepth(100)
    
    this.add.text(25, 22, '❤️', { fontSize: '16px' }).setScrollFactor(0).setDepth(100)
    
    // Create heart sprites for lives
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.sprite(55 + i * 22, 30, 'heart')
      heart.setScrollFactor(0)
      heart.setDepth(100)
      heart.setScale(0.9)
      this.heartSprites.push(heart)
    }
  }

  jump = () => {
    if (this.isGameOver) return
    
    const config = DIFFICULTY_CONFIG[this.difficulty]
    const theaBody = this.thea.body as Phaser.Physics.Arcade.Body
    
    // Check if on ground/platform
    if (theaBody.touching.down || theaBody.blocked.down) {
      // First jump
      this.thea.setVelocityY(config.jumpForce)
      this.canDoubleJump = true
      this.hasDoubleJumped = false
      
      // Jump animation
      this.tweens.add({
        targets: this.thea,
        angle: -10,
        duration: 150,
        yoyo: true,
        ease: 'Quad.easeOut'
      })
    } else if (this.canDoubleJump && !this.hasDoubleJumped) {
      // Double jump
      this.thea.setVelocityY(config.doubleJumpForce)
      this.hasDoubleJumped = true
      
      // Double jump visual effect
      this.tweens.add({
        targets: this.thea,
        angle: 360,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.thea.setAngle(0)
        }
      })
      
      // Bubble burst effect
      this.createJumpBubbles()
    }
  }

  createJumpBubbles() {
    for (let i = 0; i < 8; i++) {
      const bubble = this.add.circle(
        this.thea.x + (Math.random() - 0.5) * 40,
        this.thea.y + 20,
        3 + Math.random() * 4,
        COLORS.iceAqua,
        0.6
      )
      
      this.tweens.add({
        targets: bubble,
        y: bubble.y + 30,
        alpha: 0,
        scale: 0.5,
        duration: 400,
        onComplete: () => bubble.destroy()
      })
    }
  }

  onPlatformLand = () => {
    this.canDoubleJump = false
    this.hasDoubleJumped = false
  }

  spawnPlatform() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const y = height - 80 - Math.random() * 200
    
    this.createPlatform(width + 60, y)
  }

  spawnCollectible() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const y = height - 100 - Math.random() * 250
    const type = Math.random() > 0.4 ? 'shell' : 'pearl'
    
    const collectible = type === 'shell'
      ? this.shells.create(width + 20, y, 'shell')
      : this.pearls.create(width + 20, y, 'pearl')
    
    const body = collectible.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
    body.setVelocityX(-this.gameSpeed)
    
    // Bobbing
    this.tweens.add({
      targets: collectible,
      y: collectible.y - 10,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  spawnBabyCreature() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const types: Array<'turtle' | 'seahorse' | 'fish'> = ['turtle', 'seahorse', 'fish']
    const type = Phaser.Math.RND.pick(types)
    
    const textureMap = {
      turtle: 'babyTurtle',
      seahorse: 'babySeahorse',
      fish: 'babyFish'
    }
    
    const y = height - 100 - Math.random() * 200
    const baby = this.babyCreatures.create(width + 20, y, textureMap[type]) as BabyCreature
    baby.creatureType = type
    baby.isFollowing = false
    
    const body = baby.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
    body.setVelocityX(-this.gameSpeed * 0.8)
    
    // Gentle bobbing
    this.tweens.add({
      targets: baby,
      y: baby.y - 15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Spawn the parent ahead
    this.time.delayedCall(3000, () => {
      if (!this.isGameOver && !baby.isFollowing) {
        this.spawnParentCreature(type)
      }
    })
  }

  spawnParentCreature(type: 'turtle' | 'seahorse' | 'fish') {
    const { width, height } = this.cameras.main
    
    const textureMap = {
      turtle: 'parentTurtle',
      seahorse: 'parentSeahorse',
      fish: 'parentFish'
    }
    
    const y = height - 120 - Math.random() * 150
    const parent = this.parentCreatures.create(width + 40, y, textureMap[type]) as ParentCreature
    parent.creatureType = type
    
    const body = parent.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
    body.setVelocityX(-this.gameSpeed * 0.6) // Parents move slower
    
    // Gentle movement
    this.tweens.add({
      targets: parent,
      y: parent.y - 20,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  spawnPowerUp() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    const y = height - 150 - Math.random() * 200
    const type = Math.random() > 0.5 ? 'speed' : 'shield'
    
    const powerUp = type === 'speed'
      ? this.speedBoosts.create(width + 20, y, 'speedBoost')
      : this.bubbleShields.create(width + 20, y, 'bubbleShield')
    
    const body = powerUp.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
    body.setVelocityX(-this.gameSpeed)
    
    // Pulsing effect
    this.tweens.add({
      targets: powerUp,
      scale: { from: 1, to: 1.2 },
      alpha: { from: 1, to: 0.7 },
      duration: 400,
      yoyo: true,
      repeat: -1
    })
  }

  spawnHazard() {
    if (this.isGameOver) return
    
    const { width, height } = this.cameras.main
    
    // Choose hazard type
    const hazardTypes = ['jellyfish', 'seaUrchin', 'trashBottle', 'trashCan', 'trashBag']
    const type = Phaser.Math.RND.pick(hazardTypes)
    
    let hazard: Phaser.Physics.Arcade.Sprite
    let y: number
    
    switch (type) {
      case 'jellyfish':
        // Jellyfish float in mid-air
        y = height - 150 - Math.random() * 200
        hazard = this.hazards.create(width + 30, y, 'jellyfish')
        hazard.setScale(1.1)
        
        // Floating animation
        this.tweens.add({
          targets: hazard,
          y: hazard.y - 40,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
        
      case 'seaUrchin':
        // Sea urchins sit on platforms/ground or float slowly
        y = height - 80 - Math.random() * 150
        hazard = this.hazards.create(width + 30, y, 'seaUrchin')
        hazard.setScale(1.2)
        
        // Slow rotation
        this.tweens.add({
          targets: hazard,
          angle: 360,
          duration: 3000,
          repeat: -1
        })
        break
        
      case 'trashBottle':
        // Floating trash
        y = height - 100 - Math.random() * 250
        hazard = this.hazards.create(width + 20, y, 'trashBottle')
        
        // Tumbling
        this.tweens.add({
          targets: hazard,
          angle: { from: -20, to: 20 },
          y: hazard.y - 15,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
        
      case 'trashCan':
        // Floating trash
        y = height - 120 - Math.random() * 200
        hazard = this.hazards.create(width + 20, y, 'trashCan')
        
        // Bobbing
        this.tweens.add({
          targets: hazard,
          y: hazard.y - 20,
          angle: 15,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
        
      case 'trashBag':
        // Sinking trash
        y = height - 80 - Math.random() * 180
        hazard = this.hazards.create(width + 25, y, 'trashBag')
        
        // Slow drift
        this.tweens.add({
          targets: hazard,
          y: hazard.y + 30,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
        
      default:
        y = height - 150
        hazard = this.hazards.create(width + 20, y, 'jellyfish')
    }
    
    const body = hazard.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
    body.setVelocityX(-this.gameSpeed * 1.1) // Hazards move slightly faster
    
    // Set smaller hitbox for fairness
    if (type === 'jellyfish') {
      body.setSize(30, 35)
      body.setOffset(5, 5)
    } else if (type === 'seaUrchin') {
      body.setSize(28, 28)
      body.setOffset(4, 4)
    }
  }

  hitHazard(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, hazard: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const hazardSprite = hazard as Phaser.Physics.Arcade.Sprite
    
    // If shielded, destroy the hazard instead
    if (this.isShielded) {
      this.tweens.add({
        targets: hazardSprite,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        onComplete: () => hazardSprite.destroy()
      })
      return
    }
    
    // If invincible (just got hit), ignore
    if (this.isInvincible) return
    
    // Lose a life
    this.lives--
    
    // Update heart display
    if (this.heartSprites.length > 0) {
      const lostHeart = this.heartSprites.pop()
      if (lostHeart) {
        this.tweens.add({
          targets: lostHeart,
          scale: 0,
          alpha: 0,
          angle: 180,
          duration: 300,
          onComplete: () => lostHeart.destroy()
        })
      }
    }
    
    // Screen shake and flash
    this.cameras.main.shake(200, 0.015)
    this.cameras.main.flash(150, 255, 50, 50, false)
    
    // Show damage text
    const damageText = this.add.text(this.thea.x, this.thea.y - 40, 'OUCH!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#FF4444',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: damageText,
      y: damageText.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => damageText.destroy()
    })
    
    if (this.lives <= 0) {
      // Game over!
      this.gameOver()
    } else {
      // Invincibility frames
      this.isInvincible = true
      
      // Blink effect
      this.tweens.add({
        targets: this.thea,
        alpha: { from: 0.3, to: 1 },
        duration: 100,
        repeat: 15,
        yoyo: true,
        onComplete: () => {
          this.thea.setAlpha(1)
          this.isInvincible = false
        }
      })
      
      // Knockback
      this.thea.setVelocityY(-200)
      this.thea.setVelocityX(-100)
    }
  }

  collectShell(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, shell: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const shellSprite = shell as Phaser.Physics.Arcade.Sprite
    if (!shellSprite.active) return
    
    shellSprite.setActive(false)
    shellSprite.body?.enable && (shellSprite.body.enable = false)
    
    // Collect animation
    this.tweens.add({
      targets: shellSprite,
      y: shellSprite.y - 30,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => shellSprite.destroy()
    })
    
    this.shellsCollected++
    this.score += 10
    this.updateHUD()
  }

  collectPearl(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, pearl: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const pearlSprite = pearl as Phaser.Physics.Arcade.Sprite
    if (!pearlSprite.active) return
    
    pearlSprite.setActive(false)
    pearlSprite.body?.enable && (pearlSprite.body.enable = false)
    
    this.tweens.add({
      targets: pearlSprite,
      y: pearlSprite.y - 30,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => pearlSprite.destroy()
    })
    
    this.pearlsCollected++
    this.score += 5
    this.updateHUD()
  }

  rescueBaby(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, baby: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const babySprite = baby as BabyCreature
    if (!babySprite.active || babySprite.isFollowing) return
    
    babySprite.isFollowing = true
    this.followingBabies.push(babySprite)
    
    // Stop its horizontal movement and make it follow Thea
    const body = babySprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)
    
    // Visual feedback
    this.cameras.main.flash(150, 93, 211, 195, false)
    
    // Show "Rescued!" text
    const rescueText = this.add.text(babySprite.x, babySprite.y - 20, 'Rescued!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#B8F0E8',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: rescueText,
      y: rescueText.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => rescueText.destroy()
    })
  }

  reuniteFamily(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, parent: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const parentSprite = parent as ParentCreature
    if (!parentSprite.active) return
    
    // Find a matching baby
    const matchingBabyIndex = this.followingBabies.findIndex(
      baby => baby.creatureType === parentSprite.creatureType && baby.active
    )
    
    if (matchingBabyIndex === -1) return
    
    const matchingBaby = this.followingBabies[matchingBabyIndex]
    this.followingBabies.splice(matchingBabyIndex, 1)
    
    // Reunite animation
    this.tweens.add({
      targets: matchingBaby,
      x: parentSprite.x,
      y: parentSprite.y,
      duration: 500,
      onComplete: () => {
        matchingBaby.destroy()
      }
    })
    
    // Celebration effect
    this.cameras.main.flash(200, 244, 164, 96, false)
    
    // Hearts and celebration
    for (let i = 0; i < 5; i++) {
      const heart = this.add.text(
        parentSprite.x + (Math.random() - 0.5) * 40,
        parentSprite.y,
        '💕',
        { fontSize: '16px' }
      )
      
      this.tweens.add({
        targets: heart,
        y: heart.y - 50,
        alpha: 0,
        duration: 800,
        delay: i * 100,
        onComplete: () => heart.destroy()
      })
    }
    
    // Show bonus text
    const bonusText = this.add.text(parentSprite.x, parentSprite.y - 30, '+50 Family Reunited!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#FF9966',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: bonusText,
      y: bonusText.y - 40,
      alpha: 0,
      duration: 1200,
      onComplete: () => bonusText.destroy()
    })
    
    // Parent swims away happily
    this.tweens.add({
      targets: parentSprite,
      x: -100,
      duration: 2000,
      onComplete: () => parentSprite.destroy()
    })
    
    this.babiesReunited++
    this.score += 50
    this.updateHUD()
  }

  collectSpeedBoost(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, boost: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const boostSprite = boost as Phaser.Physics.Arcade.Sprite
    if (!boostSprite.active) return
    
    boostSprite.destroy()
    
    if (this.isSpeedBoosted) return
    
    this.isSpeedBoosted = true
    
    // Speed up movement temporarily
    this.cameras.main.flash(150, 255, 215, 0, false)
    
    // Show power-up text
    const powerText = this.add.text(this.thea.x, this.thea.y - 40, '⚡ Speed Boost!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: powerText,
      y: powerText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => powerText.destroy()
    })
    
    // Speed boost duration
    this.time.delayedCall(5000, () => {
      this.isSpeedBoosted = false
    })
  }

  collectBubbleShield(_thea: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, shield: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const shieldSprite = shield as Phaser.Physics.Arcade.Sprite
    if (!shieldSprite.active) return
    
    shieldSprite.destroy()
    
    if (this.isShielded) return
    
    this.isShielded = true
    
    // Create shield visual around Thea
    this.shieldSprite = this.add.sprite(this.thea.x, this.thea.y, 'bubbleShield')
    this.shieldSprite.setScale(4)
    this.shieldSprite.setAlpha(0.5)
    
    this.tweens.add({
      targets: this.shieldSprite,
      alpha: { from: 0.5, to: 0.2 },
      scale: { from: 4, to: 4.5 },
      duration: 300,
      yoyo: true,
      repeat: -1
    })
    
    this.cameras.main.flash(150, 93, 211, 195, false)
    
    // Show power-up text
    const powerText = this.add.text(this.thea.x, this.thea.y - 40, '🛡️ Bubble Shield!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#5DD3C3',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: powerText,
      y: powerText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => powerText.destroy()
    })
    
    // Shield duration
    this.time.delayedCall(6000, () => {
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
  }

  updateHUD() {
    this.scoreText.setText(this.score.toString())
    this.shellText.setText(this.shellsCollected.toString())
    this.babyText.setText(this.babiesReunited.toString())
    
    // Pop animation on update
    this.tweens.add({
      targets: this.scoreText,
      scale: { from: 1.3, to: 1 },
      duration: 150
    })
  }

  gameOver() {
    if (this.isGameOver) return
    this.isGameOver = true
    
    // Stop timers
    this.platformTimer.remove()
    this.collectibleTimer.remove()
    this.hazardTimer.remove()
    
    // Thea falls
    this.tweens.add({
      targets: this.thea,
      angle: 180,
      alpha: 0.7,
      duration: 500,
      onComplete: () => {
        const highScore = this.registry.get('highScore') || 0
        const isNewHighScore = this.score > highScore
        
        if (isNewHighScore) {
          this.registry.set('highScore', this.score)
        }
        
        this.scene.start('GameOverScene', {
          score: this.score,
          shells: this.shellsCollected,
          pearls: this.pearlsCollected,
          babiesReunited: this.babiesReunited,
          livesLost: DIFFICULTY_CONFIG[this.difficulty].startingLives - this.lives,
          isNewHighScore,
          difficulty: this.difficulty
        })
        
        const onGameOver = this.registry.get('onGameOver')
        if (onGameOver) {
          onGameOver(this.score, this.shellsCollected + this.pearlsCollected, this.babiesReunited)
        }
      }
    })
    
    this.cameras.main.shake(300, 0.02)
    this.cameras.main.flash(200, 255, 100, 100, false)
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) return
    
    const config = DIFFICULTY_CONFIG[this.difficulty]
    const { height } = this.cameras.main
    
    // Handle keyboard input
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.jump()
    }
    
    // Horizontal movement (optional - Thea stays mostly in place but can move a bit)
    const speedMultiplier = this.isSpeedBoosted ? 1.5 : 1
    if (this.cursors.left.isDown) {
      this.thea.setVelocityX(-config.playerSpeed * 0.5 * speedMultiplier)
      this.thea.setFlipX(true)
    } else if (this.cursors.right.isDown) {
      this.thea.setVelocityX(config.playerSpeed * 0.5 * speedMultiplier)
      this.thea.setFlipX(false)
    } else {
      this.thea.setVelocityX(0)
    }
    
    // Keep Thea from going too far left
    if (this.thea.x < 50) {
      this.thea.x = 50
    }
    if (this.thea.x > 300) {
      this.thea.x = 300
    }
    
    // Parallax scrolling
    this.bgFar.tilePositionX += this.gameSpeed * 0.15 * delta / 1000
    this.bgMid.tilePositionX += this.gameSpeed * 0.4 * delta / 1000
    
    // Update shield position
    if (this.shieldSprite) {
      this.shieldSprite.x = this.thea.x
      this.shieldSprite.y = this.thea.y
    }
    
    // Update following babies positions
    this.followingBabies.forEach((baby, index) => {
      if (baby.active) {
        const targetX = this.thea.x - 30 - index * 25
        const targetY = this.thea.y + 10
        
        baby.x += (targetX - baby.x) * 0.1
        baby.y += (targetY - baby.y) * 0.1
      }
    })
    
    // Gradual speed increase
    this.gameSpeed = config.platformSpeed + Math.floor(this.score / 100) * 10
    
    // Check if Thea fell off the bottom
    if (this.thea.y > height + 50) {
      this.gameOver()
    }
    
    // Update velocities and clean up off-screen objects
    this.platforms.getChildren().slice().forEach((platform) => {
      const p = platform as Phaser.Physics.Arcade.Sprite
      if (!p.active) return
      if (p.x < -150) {
        p.destroy()
        return
      }
      const body = p.body as Phaser.Physics.Arcade.Body
      if (body.velocity.x !== 0) { // Don't update starting platform
        body.setVelocityX(-this.gameSpeed)
      }
    })
    
    this.shells.getChildren().slice().forEach((shell) => {
      const s = shell as Phaser.Physics.Arcade.Sprite
      if (!s.active) return
      if (s.x < -30) {
        s.destroy()
        return
      }
      const body = s.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(-this.gameSpeed)
    })
    
    this.pearls.getChildren().slice().forEach((pearl) => {
      const p = pearl as Phaser.Physics.Arcade.Sprite
      if (!p.active) return
      if (p.x < -30) {
        p.destroy()
        return
      }
      const body = p.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(-this.gameSpeed)
    })
    
    this.babyCreatures.getChildren().slice().forEach((creature) => {
      const c = creature as BabyCreature
      if (!c.active) return
      if (c.x < -50 && !c.isFollowing) {
        c.destroy()
        return
      }
      if (!c.isFollowing) {
        const body = c.body as Phaser.Physics.Arcade.Body
        body.setVelocityX(-this.gameSpeed * 0.8)
      }
    })
    
    this.parentCreatures.getChildren().slice().forEach((creature) => {
      const c = creature as Phaser.Physics.Arcade.Sprite
      if (!c.active) return
      if (c.x < -100) {
        c.destroy()
        return
      }
      const body = c.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(-this.gameSpeed * 0.6)
    })
    
    this.speedBoosts.getChildren().slice().forEach((boost) => {
      const b = boost as Phaser.Physics.Arcade.Sprite
      if (!b.active) return
      if (b.x < -30) {
        b.destroy()
        return
      }
      const body = b.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(-this.gameSpeed)
    })
    
    this.bubbleShields.getChildren().slice().forEach((shield) => {
      const s = shield as Phaser.Physics.Arcade.Sprite
      if (!s.active) return
      if (s.x < -30) {
        s.destroy()
        return
      }
      const body = s.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(-this.gameSpeed)
    })
    
    this.hazards.getChildren().slice().forEach((hazard) => {
      const h = hazard as Phaser.Physics.Arcade.Sprite
      if (!h.active) return
      if (h.x < -60) {
        h.destroy()
        return
      }
      const body = h.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(-this.gameSpeed * 1.1)
    })
    
    // Score increases over time
    this.score += Math.round(delta / 100)
    this.scoreText.setText(this.score.toString())
  }
}

