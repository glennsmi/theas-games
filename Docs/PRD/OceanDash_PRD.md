# **Thea's Ocean Dash**

Product Requirements Document

Version 1.0 | December 2025

---

# **1. Product Overview**

Thea's Ocean Dash is an endless swimmer arcade game built with Phaser 3, designed as an expansion to the Thea's Games platform. Players control Thea the mermaid as she swims through an underwater world, collecting pearls while avoiding obstacles.

## **1.1 Game Concept**

An endless side-scrolling swimmer where Thea swims forward automatically. Players tap/click to make Thea swim upward against the ocean current. Gravity naturally pulls her down. The goal is to swim as far as possible while collecting pearls and avoiding obstacles.

## **1.2 Target Audience**

- Primary users: Girls aged 5-10 years old
- Skill level: Casual, accessible to young children
- Platform: Web browser (desktop, tablet, mobile)

## **1.3 Core Experience**

- Simple one-tap/click controls perfect for young children
- Stress-free gameplay with gentle difficulty progression
- Integrated with existing pearl currency system
- Ocean conservation theme through environmental obstacles

---

# **2. Gameplay Mechanics**

## **2.1 Core Controls**

| Input | Action |
|-------|--------|
| Tap / Click / Spacebar | Swim upward (boost against gravity) |
| Release | Natural downward drift (gravity) |

## **2.2 Player Movement**

- **Horizontal**: Thea automatically moves forward (screen scrolls left)
- **Vertical**: Player controls up/down movement
- **Gravity**: Gentle downward pull when not tapping
- **Swim Boost**: Tap to swim upward against the current
- **Boundaries**: Cannot go above water surface or below ocean floor

## **2.3 Collectibles**

### **Pearls** (Primary Currency)
- Small white/pink pearls scattered throughout
- Worth 1 pearl each
- Contribute to player's total pearl balance in Firebase
- Appear in small clusters and single items

### **Golden Shells** (Bonus)
- Rare collectible worth 5 pearls
- Appears occasionally with sparkle effect
- Audio feedback when collected

### **Bubble Shield** (Power-up)
- Temporary invincibility bubble
- Lasts 5 seconds
- Visual bubble effect around Thea
- Allows passing through obstacles safely

## **2.4 Obstacles**

All obstacles fit the ocean theme and are designed to be non-scary for young children:

| Obstacle | Behaviour | Visual |
|----------|-----------|--------|
| **Jellyfish** | Floats up and down gently | Translucent purple/pink |
| **Seaweed Walls** | Stationary, blocks path | Green wavy kelp |
| **Ocean Current** | Pushes Thea in a direction | Swirling water lines |
| **Coral Formations** | Stationary, narrow gaps | Colorful coral reef |
| **Trash Items** | Floating plastic bags, bottles | Conservation message |

### **Obstacle Design Philosophy**
- No scary or aggressive creatures
- Obstacles cause "bonk" not "damage"
- Conservation theme: trash obstacles teach about ocean pollution

## **2.5 Difficulty Progression**

Difficulty increases gradually based on distance travelled:

| Distance | Speed | Obstacle Density | Gap Size |
|----------|-------|------------------|----------|
| 0-500m | Slow | Low | Large |
| 500-1500m | Medium | Medium | Medium |
| 1500m+ | Fast | High | Smaller |

### **Age-Appropriate Settings**

| Difficulty | Target Age | Starting Speed | Obstacle Frequency |
|------------|------------|----------------|-------------------|
| **Easy** | 5-6 years | Very slow | Sparse, large gaps |
| **Medium** | 7-8 years | Moderate | Regular spacing |
| **Hard** | 9-10 years | Faster | Tighter gaps |

---

# **3. Game States**

## **3.1 State Flow**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Title   │────▶│  Ready   │────▶│ Playing  │────▶│ Game Over│
│  Screen  │     │  Screen  │     │          │     │  Screen  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      ▲                                                  │
      └──────────────────────────────────────────────────┘
```

## **3.2 Title Screen**

- Game logo and Thea character preview
- "Tap to Start" prompt with gentle animation
- Difficulty selector (Easy/Medium/Hard)
- High score display
- Background: Animated underwater scene with bubbles

## **3.3 Ready Screen**

- Brief countdown or "Get Ready!" message
- Shows Thea at starting position
- Quick tutorial hint: "Tap to swim up!"

## **3.4 Playing State**

- Active gameplay
- HUD showing:
  - Current distance (metres)
  - Pearls collected this run
  - Current high score indicator
- Pause button (top corner)

## **3.5 Game Over Screen**

- "Splendid!" or encouraging message
- Distance achieved
- Pearls collected
- New high score celebration (if applicable)
- Pearl animation showing earned pearls
- "Play Again" button
- "Return to Games" button

---

# **4. Visual Design**

## **4.1 Art Style**

- Consistent with Thea's Games brand palette
- Bright, cheerful, underwater aesthetic
- Smooth parallax scrolling backgrounds
- Cartoon-style sprites

## **4.2 Colour Palette**

Utilising existing Thea's Games palette:

| Element | Colour | Hex |
|---------|--------|-----|
| Background (far) | Dark Navy | #1E3A5F |
| Background (mid) | Medium Teal | #40B5A8 |
| Background (near) | Light Teal | #5DD3C3 |
| Thea's Hair | Light Teal | #5DD3C3 |
| Thea's Tail | Purple Gradient | #8B6BB5 → #5DD3C3 |
| Pearls | Ice Aqua / White | #B8F0E8 |
| Golden Shells | Sandy Coral | #F4A460 |
| Jellyfish | Medium Purple | #8B6BB5 |
| UI Elements | Bright Coral | #FF9966 |

## **4.3 Parallax Layers**

1. **Far Background**: Deep ocean gradient, slow scroll
2. **Mid Background**: Distant coral reef silhouettes
3. **Near Background**: Kelp forest, medium scroll
4. **Game Layer**: Thea, obstacles, collectibles
5. **Foreground**: Occasional bubbles, particles

## **4.4 Character Animation**

### **Thea the Mermaid**
- Idle swim: Gentle tail swish animation (4-6 frames)
- Swim up: Active swimming motion
- Swim down: Relaxed gliding pose
- Hit reaction: Brief flash/spin, not distressing
- Celebration: Happy pose for game over

## **4.5 Particle Effects**

- **Bubbles**: Constant stream from Thea, rise to surface
- **Pearl Collect**: Sparkle burst + pearl flies to HUD
- **Shield Active**: Bubble sphere effect
- **Hit Reaction**: Small bubble burst

---

# **5. Audio Design**

## **5.1 Music**

- Cheerful, underwater-themed background music
- Looping seamlessly
- Volume control in settings
- Tempo slightly increases with speed

## **5.2 Sound Effects**

| Event | Sound |
|-------|-------|
| Swim/Tap | Gentle "whoosh" water sound |
| Pearl Collect | Magical chime |
| Golden Shell | Special sparkle sound |
| Shield Pickup | Bubble wrap sound |
| Obstacle Hit | Soft "bonk" (not harsh) |
| Game Over | Gentle descending tone |
| New High Score | Celebratory fanfare |

---

# **6. Technical Specifications**

## **6.1 Technology Stack**

| Component | Technology |
|-----------|------------|
| Game Engine | Phaser 3 |
| Framework | React + TypeScript |
| State Management | Phaser Scene system + React context |
| Backend | Firebase (existing) |
| Database | Firestore (existing) |

## **6.2 Phaser Integration**

```typescript
// React wrapper component structure
<PhaserGame
  config={gameConfig}
  onGameOver={handleGameOver}
  onPearlsCollected={handlePearls}
  difficulty={selectedDifficulty}
/>
```

## **6.3 Game Configuration**

```typescript
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene]
}
```

## **6.4 Performance Targets**

- 60 FPS on modern browsers
- < 3 second initial load
- Touch latency < 50ms
- Works on tablets and phones

## **6.5 Responsive Design**

- Canvas scales to fit container
- Maintains aspect ratio (16:9 preferred)
- Touch areas sized for small fingers
- UI elements scale appropriately

---

# **7. Data & Persistence**

## **7.1 Firestore Integration**

### **User Progress Document** (existing users collection)
```typescript
{
  oceanDash: {
    highScore: number,        // Best distance in metres
    totalDistance: number,    // Cumulative distance
    gamesPlayed: number,      // Total games completed
    pearlsEarned: number,     // Pearls from this game
    lastPlayed: Timestamp
  }
}
```

## **7.2 Pearl Integration**

- Pearls collected sync to existing `updateUserPearls()` service
- Real-time pearl counter in game syncs on game over
- Offline play stores pearls locally, syncs when online

## **7.3 Analytics Events**

| Event | Data |
|-------|------|
| `game_start` | difficulty, user_id |
| `game_over` | distance, pearls, difficulty |
| `high_score` | new_score, previous_score |
| `power_up_collected` | type |

---

# **8. User Interface**

## **8.1 In-Game HUD**

```
┌─────────────────────────────────────────────────────────────┐
│  ⏸️                                    🐚 125  |  📏 1,234m  │
│                                                             │
│                                                             │
│                                                             │
│                        [GAME AREA]                          │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- **Pause Button**: Top left
- **Pearl Counter**: Top right with shell icon
- **Distance**: Top right, current run distance

## **8.2 Game Over Modal**

```
┌─────────────────────────────────────┐
│                                     │
│        🧜‍♀️ Splendid! 🧜‍♀️           │
│                                     │
│      You swam 1,234 metres!         │
│                                     │
│      🐚 +25 Pearls Collected        │
│                                     │
│      ⭐ NEW HIGH SCORE! ⭐           │
│                                     │
│    ┌─────────────────────────┐      │
│    │      Play Again         │      │
│    └─────────────────────────┘      │
│                                     │
│         Back to Games               │
│                                     │
└─────────────────────────────────────┘
```

---

# **9. Accessibility**

## **9.1 Controls**

- Single tap/click gameplay (accessible)
- Spacebar alternative for desktop
- Large touch targets (min 44px)
- No rapid multi-tap requirements

## **9.2 Visual**

- High contrast collectibles against background
- No flashing effects that could trigger photosensitivity
- Clear visual feedback for all actions
- Option to reduce motion effects

## **9.3 Audio**

- All audio cues have visual equivalents
- Game fully playable without sound
- Volume controls accessible

---

# **10. Development Phases**

## **Phase 1: Core Game (MVP)**

1. ✅ Create PRD document
2. Set up Phaser 3 with React wrapper
3. Basic Thea sprite with swimming animation
4. Single background layer
5. Tap-to-swim mechanics
6. Basic obstacle (jellyfish)
7. Pearl collectibles
8. Distance counter
9. Game over state
10. Restart functionality

## **Phase 2: Polish**

1. Multiple parallax background layers
2. Additional obstacles (seaweed, coral)
3. Golden shell bonus collectible
4. Bubble shield power-up
5. Sound effects and music
6. Particle effects (bubbles)
7. Difficulty progression
8. High score persistence

## **Phase 3: Integration**

1. Firebase pearl sync
2. User progress tracking
3. Settings (volume, difficulty)
4. Navigation integration with main app
5. Analytics events

---

# **11. Success Metrics**

| Metric | Target |
|--------|--------|
| Average session length | > 5 minutes |
| Games per session | > 3 |
| Return rate (7 day) | > 40% |
| Pearl conversion | Encourages premium upgrades |

---

# **12. Future Enhancements**

- Additional playable characters (different mermaids)
- Themed levels (coral reef, kelp forest, deep sea)
- Daily challenges with bonus pearl rewards
- Seasonal events (holiday themes)
- Leaderboards (friends only, child-safe)
- Achievement system

---

*— End of Document —*

