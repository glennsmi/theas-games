# React - TypeScript - Tailwind v4 Template with Firebase

A modern, full-stack React template with Vite, Firebase, Tailwind CSS v4, and shared TypeScript models.

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd template_w_firestore
npm run install:all

# 2. Start development
npm run dev                    # Frontend (http://localhost:8001)
npm run firebase:emulators    # Firebase services

# 3. Build and deploy
npm run build                 # Build frontend
firebase deploy               # Deploy everything
```

> 📚 **For detailed documentation, see [Docs/Architecture/](Docs/Architecture/)**

## Features

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS v4** with the latest features
- **React Router** for client-side routing
- **Firebase SDK** for authentication and data

### Backend Stack
- **Firebase Functions v2** deployed to Europe West 2
- **Firestore** for real-time database operations
- **TypeScript** for type safety
- **Shared data models** between frontend and backend
- **Zod** for runtime validation
- **CORS** support for cross-origin requests

### Architecture
- **Monorepo** structure with workspaces
- **Shared types** and utilities
- **Modern tooling** with ESLint and TypeScript
- **Firebase emulators** for local development
- **Firestore security rules** configured

## Project Structure

```
template_w_firestore/
├── 📄 package.json              # Root workspace configuration
├── 🔥 firebase.json             # Firebase project configuration
├── 🔐 .firebaserc              # Firebase project settings
├── 📋 firestore.rules          # Firestore security rules
├── 🔍 firestore.indexes.json   # Firestore indexes
├── 📚 Docs/                    # Documentation
│   └── Architecture/           # Architecture documentation
│       ├── README.md           # Architecture overview
│       ├── DataFlow.md         # Data flow diagrams
│       └── Deployment.md       # Deployment guide
├── 🔗 shared/                  # Shared types and models
│   ├── src/
│   │   ├── types/             # TypeScript interfaces
│   │   ├── schemas/           # Zod validation schemas
│   │   └── index.ts           # Shared utilities
│   ├── package.json
│   └── tsconfig.json
├── 🎨 src/                     # React + Vite application (root-level)
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── services/               # API & Firebase services
│   ├── config/                 # Configuration files
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Application entry point
└── ⚡ functions/               # Firebase Functions
    ├── src/
    │   └── index.ts            # Functions entry point with Firestore ops
    ├── package.json
    └── tsconfig.json
```

> 📚 **For detailed architecture documentation, see [Docs/Architecture/](Docs/Architecture/)**

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd template_w_firestore
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Firebase:**
   - Your project is set to: `demo-glenn-dev-template` (for emulators)
   - Get your Firebase configuration from [Firebase Console](https://console.firebase.google.com/)
   - Update `src/config/firebase.ts` with your actual Firebase configuration

4. **Build shared models:**
   ```bash
   npm run build --workspace=shared
   ```

### Development

1. **Start the development servers:**
   ```bash
   # Terminal 1: Start frontend
   npm run dev
   
   # Terminal 2: Start Firebase emulators (optional)
   npm run firebase:emulators
   
   # Terminal 3: Start functions development (optional)
   npm run functions:dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:8001
   - Firebase Emulator UI: http://localhost:4100
   - Functions: http://localhost:5101
   - Firestore: http://localhost:8180
   - Auth: http://localhost:9199

### Available Scripts

#### Root Level
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run firebase:emulators` - Start Firebase emulators
- `npm run firebase:deploy` - Deploy functions to Firebase
- `npm run install:all` - Install all workspace dependencies

#### Frontend
- Frontend lives at the repository root now. Use the root scripts above.

#### Functions
- `npm run build --workspace=functions` - Compile TypeScript
- `npm run dev --workspace=functions` - Watch mode compilation
- `npm run serve --workspace=functions` - Start functions emulator

#### Shared
- `npm run build --workspace=shared` - Compile shared types
- `npm run dev --workspace=shared` - Watch mode compilation

## Firebase Functions

The template includes several example functions demonstrating Firestore integration:

### Available Functions

1. **`helloWorld`** (HTTP) - Basic HTTP function example
2. **`getUsers`** (Callable) - Paginated user retrieval from Firestore
3. **`createUser`** (Callable) - Create new user in Firestore
4. **`getCurrentUser`** (Callable) - Get current authenticated user profile
5. **`updateUser`** (Callable) - Update user profile

### Function Usage Example

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getUsers = httpsCallable(functions, 'getUsers');

// Get paginated users
const result = await getUsers({ page: 1, limit: 10 });
console.log(result.data); // Typed response using shared models
```

## Configuration

### Firebase Configuration

1. **Frontend Configuration** (`src/config/firebase.ts`):
   ```typescript
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:your-app-id"
   }
   ```

2. **Functions Configuration**:
   - Functions are configured to deploy to `europe-west2`
   - Uses Firebase Functions v2 for better performance
   - Includes CORS support for frontend communication
   - Integrated with Firestore for data operations

### Firestore Security Rules

The template includes production-ready security rules in `firestore.rules`:

- Users can read/write their own user documents
- Authenticated users can read other user profiles (display names)
- Example post collection with author-based permissions
- Development rules available (commented out)

### Tailwind CSS v4

This template uses Tailwind CSS v4 with the new Vite plugin. Key features:
- Faster compilation
- Improved tree-shaking
- Better developer experience
- Lightning-fast HMR

### Shared Models

The shared workspace contains:
- **TypeScript interfaces** for type safety
- **Zod schemas** for runtime validation
- **Firestore-specific types** with timestamp handling
- **Collection constants** for consistent naming
- **Utility functions** for API responses

Example usage:
```typescript
import { User, COLLECTIONS, createSuccessResponse } from '@shared';

// Use shared constants
const usersRef = db.collection(COLLECTIONS.USERS);

// Use shared types
const user: User = { /* ... */ };

// Use shared utility functions
const response = createSuccessResponse(user, 'User created successfully');
```

## Deployment

> 🚀 **For comprehensive deployment instructions, see [Docs/Architecture/Deployment.md](Docs/Architecture/Deployment.md)**

### Quick Deployment Commands

```bash
# Build all components
npm run shared:build
npm run functions:build
npm run build

# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore
```

### Production Checklist

- [ ] Update Firebase configuration in `src/config/firebase.ts`
- [ ] Set `useEmulator = false` for production
- [ ] Update `.firebaserc` with your project ID
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all functions are working in production

## Architecture Documentation

This template includes comprehensive architecture documentation in the `Docs/Architecture/` folder:

- **[README.md](Docs/Architecture/README.md)** - Complete architecture overview, design principles, and technology stack
- **[DataFlow.md](Docs/Architecture/DataFlow.md)** - Detailed data flow diagrams and communication patterns
- **[Deployment.md](Docs/Architecture/Deployment.md)** - Production deployment guide with CI/CD setup

## Development Tips

1. **Enable Firestore**: Visit [Firebase Console](https://console.firebase.google.com/) to initialize your database

2. **Authentication**: Set up authentication providers in the [Firebase Console](https://console.firebase.google.com/)

3. **Local Development**: Use Firebase emulators for local development to avoid hitting production services

4. **Security Rules**: Update `firestore.rules` for your specific use case before deploying to production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 