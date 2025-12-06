import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// Replace these with your actual Firebase config values from the Firebase Console
// Go to: https://console.firebase.google.com/ to get your project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { firebaseConfig };

// Firebase emulator configuration for local development
export const useEmulator = process.env.NODE_ENV === 'development'

export const emulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9199
  },
  firestore: {
    host: 'localhost',
    port: 8180
  },
  functions: {
    host: 'localhost',
    port: 5101
  }
}


