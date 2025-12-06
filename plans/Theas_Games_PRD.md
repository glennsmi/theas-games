# **Thea's Games**

Product Requirements Document

Version 1.0 | December 2025

# **1\. Product Overview**

Thea's Games is a subscription-based web platform offering simple, engaging match games for girls aged 5-10. The platform features a magical underwater theme with ocean conservation messaging woven throughout the experience.

## **1.1 Target Audience**

* Primary users: Girls aged 5-10 years old  
* Secondary users: Parents/guardians who manage accounts and subscriptions

## **1.2 Product Vision**

Create a safe, delightful gaming environment where young girls can play, learn, and eventually create their own games, all while developing an appreciation for ocean conservation through subtle, positive messaging.

## **1.3 Visual Direction**

* Light, buoyant, and airy aesthetic  
* Teal, navy, and purple colour palette (see Brand Colour Palette below)  
* Underwater theme with ocean characters  
* Logo and background designs already completed

## **1.4 Brand Colour Palette**

The following colours are extracted from the official Thea's Games logo and should be used consistently across all brand touchpoints.

### **Primary Colours**

| Colour | Hex Code | Usage |
| :---: | :---: | ----- |
| **Light Teal** | \#5DD3C3 | Primary brand colour, mermaid hair, text, backgrounds |
| **Medium Teal** | \#40B5A8 | Secondary teal, buttons, interactive elements |
| **Dark Navy** | \#1E3A5F | Headlines, outlines, contrast elements |
| **Medium Purple** | \#8B6BB5 | Mermaid tail, accents, gradients |
| **Deep Purple** | \#6B4D94 | Deep accents, hover states, depth |

### **Secondary Colours**

| Colour | Hex Code | Usage |
| :---: | :---: | ----- |
| **Sandy Coral** | \#F4A460 | Warm accents, call-to-action highlights |
| **Bright Coral** | \#FF9966 | Rewards, celebrations, premium features |
| **Pale Aqua** | \#98E8DC | Light backgrounds, card backs, subtle UI |
| **Ice Aqua** | \#B8F0E8 | Bubbles, highlights, sparkle effects |

### **Gradient Usage**

* Mermaid Tail: Purple (\#8B6BB5) transitioning to Teal (\#5DD3C3)  
* Circular Frame: Navy (\#1E3A5F) transitioning to Teal (\#40B5A8)  
* Background Depth: Ice Aqua (\#B8F0E8) to Pale Aqua (\#98E8DC)

## **1.5 Logo Description**

The Thea's Games logo features an energetic young mermaid character with flowing teal hair, a purple-to-teal gradient tail, and a confident, playful pose. She is framed within a circular badge that transitions from navy to teal. The "THEA'S GAMES" wordmark appears below in a rounded, bubble-style font in teal. The overall impression is adventurous, friendly, and magical — appealing directly to the target demographic of girls aged 5-10.

## **1.6 Brand Personality**

* Adventurous and empowering  
* Friendly and approachable  
* Magical and imaginative  
* Safe and trustworthy (for parents)  
* Ocean-conscious and caring

# **2\. Core Game Mechanics**

The core gameplay centres on match games with two distinct modes, scaled across three difficulty levels to accommodate the full age range.

## **2.1 Game Modes**

### **Simple Match (Classic Memory)**

Standard flip-two-cards gameplay where players find identical pairs. Visual themes include ocean creatures such as tropical fish, shells, coral, seahorses, jellyfish, starfish, whales, and dolphins.

### **Educational Match (Concept Pairing)**

Two cards show different but related items, introducing learning opportunities. Example pairings include:

* Sea creature and name (picture of dolphin paired with "Dolphin")  
* Baby and parent (seal pup paired with adult seal)  
* Creature and habitat (clownfish paired with anemone)  
* Number and quantity (numeral 5 paired with five starfish)  
* Ocean word and first letter ("Whale" paired with "W")  
* Simple sums (3+2 paired with 5 shown as fish)  
* Shadow matching (silhouette paired with coloured creature)

## **2.2 Difficulty Levels**

| Level | Grid | Cards / Pairs | Target Age |
| :---: | :---: | :---: | :---: |
| Easy | 3 × 4 | 12 cards / 6 pairs | 5-6 years |
| Medium | 4 × 5 | 20 cards / 10 pairs | 7-8 years |
| Hard | 5 × 8 | 40 cards / 20 pairs | 9-10 years |

## **2.3 Game Behaviour**

* Unlimited flips with no penalty for wrong matches  
* Wrong matches flip back after 2 seconds  
* No move counters or time pressure  
* Stress-free environment encouraging experimentation

## **2.4 Animations**

### **Card Reveal**

Cards are styled as shells that open to reveal the image inside, rather than traditional card flips. This reinforces the underwater theme and creates a unique, memorable interaction.

### **Win Celebration**

Upon completing a game, a bubble burst celebration animation plays with bubbles rising up the screen. Sound effects accompany the animation to create a satisfying reward moment.

# **3\. Reward System**

## **3.1 Currency**

Pearls serve as the primary in-game currency. Players earn pearls upon completing games, with the amount scaled to difficulty level. Pearls are spent on avatar customisation items.

## **3.2 Future Reward Expansions (Parked)**

The following reward mechanics have been identified for potential future implementation: creature sticker collection book, virtual reef building tied to ocean conservation theme, daily challenges and streak bonuses, and unlockable ocean facts.

# **4\. Avatar System**

Users can create and customise ocean-themed avatars that appear on their profile. Avatar customisation is a key engagement driver and provides meaningful use for earned pearls.

## **4.1 Character Types**

* Mermaids  
* Mer-princes  
* Sea creatures (potential expansion)

## **4.2 Customisation Options**

* Crowns in various styles and colours  
* Tridents in different colours  
* Additional accessories (to be designed)

## **4.3 Technical Implementation**

Avatar configurations are stored as JSON in Firestore. An avatar rendering engine will composite base characters with selected accessories. Generated avatar images may be cached for performance.

# **5\. Subscription Model**

## **5.1 Free Tier**

* Access to limited selection of games  
* Basic avatar customisation  
* Progress tracking and pearl earning

## **5.2 Premium Tier**

* Full game library access  
* All avatar customisation options  
* Access to Creative Layer (game builder)  
* Priority access to new features

## **5.3 Pricing**

Pricing to be determined based on market research. Competitor analysis of similar children's platforms recommended before finalising subscription tiers.

# **6\. Creative Layer (Premium Feature)**

The Creative Layer allows premium subscribers to create their own match games. This feature transforms users from players into creators, significantly increasing engagement and platform stickiness.

## **6.1 Game Builder Concept**

A simplified drag-and-drop interface appropriate for the target age group. Users select backgrounds, choose items to match, and the system generates a playable game from their choices.

## **6.2 Creation Modes**

### **Simple Match Creator**

Users select images to form identical pairs. The same image appears on both matched cards.

### **Educational Match Creator**

Users pair two different but related items, creating learning opportunities. This enables child-created educational content that appeals to the target demographic.

## **6.3 Sharing Capabilities**

Created games can potentially be shared with friends, driving organic growth. All sharing mechanisms must be designed with child safety as the primary consideration.

# **7\. Multiplayer System (Phase 2\)**

Head-to-head gameplay allows users to compete with friends in real-time. This feature is planned for Phase 2 development.

## **7.1 Safety Requirements**

* Friend codes only \- no open matchmaking  
* No text communication between players  
* No voice chat  
* Pre-set emoji reactions only (if any communication)

## **7.2 Technical Approach**

Firebase Realtime Database will handle live game state synchronisation between players. Game sessions will be ephemeral with no persistent history stored.

# **8\. Technical Architecture**

## **8.1 Technology Stack**

* Frontend: React with TypeScript  
* Authentication: Firebase Authentication  
* Database: Cloud Firestore  
* Real-time sync: Firebase Realtime Database (for multiplayer)  
* Hosting: Firebase Hosting

## **8.2 Platform Support**

* Web browsers (desktop, tablet, mobile)  
* Responsive design for all screen sizes  
* Touch-optimised for tablet use  
* Future: Native apps via Capacitor (post-launch)

## **8.3 Data Model Overview**

Key Firestore collections:

* users \- Account data, avatar config, subscription status  
* progress \- Game completion history, pearls earned  
* games \- Game definitions (both system and user-created)  
* friends \- Friend relationships via friend codes

# **9\. Parental Controls**

## **9.1 COPPA Compliance**

As the platform targets users under 13, COPPA (Children's Online Privacy Protection Act) compliance is mandatory. Parental consent flows must be implemented before collecting any personal information from children.

## **9.2 Parent Dashboard**

* Manage subscription and billing  
* View child's progress and activity  
* Set play time limits (optional)  
* Approve friend connections  
* Control access to Creative Layer

# **10\. Ocean Conservation Theme**

A subtle but consistent ocean conservation message runs throughout the platform. The goal is to build positive associations with ocean protection without being preachy or detracting from the fun.

## **10.1 Implementation Ideas**

* Ocean facts unlocked as rewards  
* "Did you know?" snippets between games  
* Virtual reef that grows with play (future feature)  
* Educational match pairs featuring conservation concepts

## **10.2 Tone**

Positive and empowering rather than guilt-inducing. Focus on the wonder and beauty of ocean life, with gentle messages about being a good steward of the sea.

# **11\. Development Phases**

## **Phase 1: MVP Launch**

1. Core match game with Simple Match mode  
2. Three difficulty levels (Easy, Medium, Hard)  
3. Shell-opening card animations  
4. Bubble burst win celebration  
5. User accounts with Firebase Auth  
6. Basic avatar system  
7. Pearl currency and tracking  
8. Responsive web design

## **Phase 2: Feature Expansion**

1. Educational Match mode  
2. Head-to-head multiplayer  
3. Expanded avatar customisation  
4. Subscription implementation  
5. Parent dashboard

## **Phase 3: Creative Platform**

1. Creative Layer game builder  
2. Game sharing between friends  
3. Additional reward mechanics  
4. Native app versions (Capacitor)

# **12\. Success Metrics**

* Daily active users (DAU)  
* Session duration and frequency  
* Games completed per session  
* Free to premium conversion rate  
* Subscriber retention (monthly churn)  
* Creative Layer adoption (games created per user)  
* Friend invites and viral coefficient

*— End of Document —*