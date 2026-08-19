import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyApiKeyForPyDataPrayagraj",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pydata-prayagraj.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pydata-prayagraj",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pydata-prayagraj.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export const isFirebaseConfigured = () => {
  return (
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== "your_firebase_api_key" &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

export default app;
