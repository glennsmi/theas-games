#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Cursor Costs Template...\n');

async function setup() {
  try {
    // Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      console.error('❌ Please run this script from the project root directory');
      process.exit(1);
    }

    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('📦 Installing workspace dependencies...');
    execSync('npm install --workspace=shared', { stdio: 'inherit' });
    execSync('npm install --workspace=functions', { stdio: 'inherit' });

    console.log('🔨 Building shared models...');
    execSync('npm run build --workspace=shared', { stdio: 'inherit' });

    console.log('\n✅ Setup complete!\n');
    
    console.log('🎯 Next steps:');
    console.log('1. Update .firebaserc with your Firebase project ID');
    console.log('2. Update src/config/firebase.ts with your Firebase config');
    console.log('3. Run "npm run dev" to start the frontend');
    console.log('4. Run "npm run firebase:emulators" to start Firebase emulators');
    
    console.log('\n📚 Documentation: Check README.md for detailed instructions');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup(); 