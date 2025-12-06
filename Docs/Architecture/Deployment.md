# Deployment Guide

## 🚀 Overview

This guide covers deploying your React + Firebase template to production, including frontend hosting, backend functions, database configuration, and security setup.

## 📋 Prerequisites

### Required Tools
- **Node.js 18+** and **npm 9+**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** for version control
- **Firebase Console** access

### Firebase Project Setup
1. **Create Project**: [Firebase Console](https://console.firebase.google.com/)
2. **Enable Services**:
   - Authentication
   - Firestore Database
   - Functions
   - Hosting
3. **Note Project ID**: You'll need this for configuration

## 🔧 Pre-Deployment Configuration

### 1. Update Firebase Configuration

```typescript
// src/config/firebase.ts
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",           // ← Update this
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}

// Remove emulator configuration for production
export const useEmulator = false
```

### 2. Update .firebaserc

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 3. Environment Variables

Create `.env.production`:
```bash
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_REGION=europe-west2
NODE_ENV=production
```

Create `.env.local` for development:
```bash
VITE_FIREBASE_PROJECT_ID=demo-glenn-dev-template
VITE_FIREBASE_REGION=europe-west2
NODE_ENV=development
```

### 4. Update firebase.json

```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": [
        "npm --prefix \"shared\" run build",
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ],
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

## 🏗️ Build Process

### 1. Build All Components

```bash
# Build shared types
npm run shared:build

# Build functions
npm run functions:build

# Build frontend
npm run build
```

### 2. Verify Build Output

```bash
# Check frontend build
ls -la dist/
# Should contain: index.html, assets/, etc.

# Check functions build
ls -la functions/lib/
# Should contain: index.js, index.js.map

# Check shared build
ls -la shared/dist/
# Should contain: index.js, types/, schemas/
```

### 3. Test Production Build Locally

```bash
# Preview production build
npm run preview

# Test functions locally (without emulators)
npm run functions:serve
```

## 🚀 Deployment Steps

### 1. Deploy Functions

```bash
# Deploy only functions
npm run firebase:deploy --only functions

# Or use Firebase CLI directly
firebase deploy --only functions
```

**Expected Output:**
```
✔  functions[helloWorld(europe-west2)] Successful create operation.
✔  functions[getUsers(europe-west2)] Successful create operation.
✔  functions[createUser(europe-west2)] Successful create operation.
✔  functions[getCurrentUser(europe-west2)] Successful create operation.
✔  functions[updateUser(europe-west2)] Successful create operation.
```

### 2. Deploy Firestore Rules & Indexes

```bash
# Deploy database configuration
firebase deploy --only firestore
```

**Expected Output:**
```
✔  firestore: released rules firestore.rules to firebase:your-project
✔  firestore: released indexes firestore.indexes.json to firebase:your-project
```

### 3. Deploy Frontend (Hosting)

```bash
# Deploy hosting
firebase deploy --only hosting
```

**Expected Output:**
```
✔  hosting[your-project]: file upload complete
✔  hosting[your-project]: 1 file(s) uploaded successfully
✔  hosting[your-project]: Deploy complete!
```

### 4. Full Deployment

```bash
# Deploy everything at once
firebase deploy
```

## 🔐 Security Configuration

### 1. Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == userId;
      allow read: if request.auth != null; // Others can read profiles
    }
    
    // Posts with author-based permissions
    match /posts/{postId} {
      allow read: if true; // Public read
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                            request.auth.uid == resource.data.authorId;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
                         request.auth.token.admin == true;
    }
  }
}
```

### 2. Functions Security

```typescript
// functions/src/index.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getAuth } from 'firebase-admin/auth'

export const createUser = onCall<CreateUser>(
  { 
    cors: true,
    region: 'europe-west2'
  },
  async (request) => {
    // Verify authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }
    
    // Verify user permissions
    const user = await getAuth().getUser(request.auth.uid)
    if (!user.customClaims?.canCreateUsers) {
      throw new HttpsError('permission-denied', 'Insufficient permissions')
    }
    
    // Process request...
  }
)
```

### 3. CORS Configuration

```typescript
// functions/src/index.ts
export const helloWorld = onRequest(
  { 
    cors: {
      origin: [
        'https://your-domain.com',
        'https://www.your-domain.com',
        'http://localhost:8001' // Development
      ],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },
  (request, response) => {
    // Function implementation
  }
)
```

## 🌍 Environment-Specific Configuration

### Development Environment

```typescript
// src/config/firebase.ts
const isDevelopment = process.env.NODE_ENV === 'development'

export const firebaseConfig = isDevelopment 
  ? {
      // Development config (emulators)
      apiKey: "demo-api-key",
      projectId: "demo-glenn-dev-template",
      // ... other dev settings
    }
  : {
      // Production config
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      // ... other prod settings
    }

export const useEmulator = isDevelopment
```

### Production Environment

```typescript
// src/services/functionsClient.ts
function initializeFunctions(): Functions {
  if (useEmulator) {
    // Development: Connect to emulators
    const functions = getFunctions(app)
    connectFunctionsEmulator(functions, 'localhost', 5101)
    return functions
  } else {
    // Production: Use europe-west2 region
    console.log('🌍 Using production functions in europe-west2')
    return getFunctions(app, 'europe-west2')
  }
}
```

## 📊 Monitoring & Analytics

### 1. Firebase Console Monitoring

- **Functions**: Monitor execution times, errors, and usage
- **Firestore**: Track read/write operations and performance
- **Hosting**: View traffic and performance metrics
- **Authentication**: Monitor sign-ins and security events

### 2. Custom Logging

```typescript
// functions/src/index.ts
export const helloWorld = onRequest(
  { cors: true },
  async (request, response) => {
    const startTime = Date.now()
    
    try {
      // Function logic
      const result = { message: 'Hello from production!' }
      
      // Log success
      console.log('✅ helloWorld executed successfully', {
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
      
      response.json({ success: true, data: result })
    } catch (error) {
      // Log error
      console.error('❌ helloWorld failed', {
        error: error.message,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
      
      response.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      })
    }
  }
)
```

### 3. Performance Monitoring

```typescript
// functions/src/index.ts
import { onCall } from 'firebase-functions/v2/https'
import { performance } from 'perf_hooks'

export const getUsers = onCall(
  { cors: true },
  async (request) => {
    const startTime = performance.now()
    
    try {
      // Database query
      const users = await fetchUsersFromDatabase()
      
      const executionTime = performance.now() - startTime
      
      // Log performance metrics
      console.log('📊 getUsers performance', {
        executionTime: `${executionTime.toFixed(2)}ms`,
        userCount: users.length,
        timestamp: new Date().toISOString()
      })
      
      return createSuccessResponse(users, 'Users loaded successfully')
    } catch (error) {
      const executionTime = performance.now() - startTime
      
      console.error('❌ getUsers failed', {
        executionTime: `${executionTime.toFixed(2)}ms`,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      
      throw error
    }
  }
)
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run shared:build
      - run: npm run functions:build
      - run: npm run build
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run shared:build
      - run: npm run functions:build
      - run: npm run build
      
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
          channelId: live
```

### 2. Environment Secrets

Set these in GitHub repository settings:
- `FIREBASE_SERVICE_ACCOUNT`: Base64-encoded service account JSON
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Functions Build Failures

```bash
# Check TypeScript compilation
cd functions
npm run build

# Verify shared module is built
cd ../shared
npm run build

# Check for missing dependencies
npm ls
```

#### 2. Hosting Deployment Issues

```bash
# Verify build output exists
ls -la dist/

# Check firebase.json configuration
firebase hosting:channel:list

# Test locally
firebase serve --only hosting
```

#### 3. Firestore Rules Issues

```bash
# Test rules locally
firebase emulators:start --only firestore

# Validate rules syntax
firebase firestore:rules:validate firestore.rules
```

### Debug Commands

```bash
# View deployment logs
firebase functions:log

# Check function status
firebase functions:list

# View hosting status
firebase hosting:channel:list

# Test functions
curl -X POST https://europe-west2-your-project.cloudfunctions.net/helloWorld
```

## 📈 Post-Deployment Verification

### 1. Function Testing

```bash
# Test each function endpoint
curl -X POST https://europe-west2-your-project.cloudfunctions.net/helloWorld
curl -X POST https://europe-west2-your-project.cloudfunctions.net/getUsers
```

### 2. Frontend Verification

- ✅ **Hosting**: Visit your deployed URL
- ✅ **Functions**: Test function calls from the UI
- ✅ **Database**: Verify data persistence
- ✅ **Authentication**: Test sign-in/sign-up flows

### 3. Performance Testing

```bash
# Test function response times
time curl -X POST https://europe-west2-your-project.cloudfunctions.net/helloWorld

# Check bundle sizes
npm run build
ls -lh dist/assets/
```

## 🔄 Rollback Strategy

### 1. Function Rollback

```bash
# List function versions
firebase functions:list --versions

# Rollback to previous version
firebase functions:rollback --version 1
```

### 2. Hosting Rollback

```bash
# List hosting releases
firebase hosting:releases:list

# Rollback to previous release
firebase hosting:rollback --release 1
```

### 3. Database Rollback

```bash
# Export current data
firebase firestore:export backup/

# Restore from backup if needed
firebase firestore:import backup/
```

## 📚 Additional Resources

- [Firebase Deployment Guide](https://firebase.google.com/docs/hosting/deploy-json)
- [Functions v2 Documentation](https://firebase.google.com/docs/functions/v2)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

This deployment guide ensures your React + Firebase template is production-ready with proper security, monitoring, and CI/CD integration.


