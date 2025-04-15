import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type UserCredential
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    // First check if there's a redirect result
    const result = await getRedirectResult(auth);
    if (result) {
      return result;
    }
    // Otherwise initiate the redirect
    await signInWithRedirect(auth, googleProvider);
    return null;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Sign in with Apple
export const signInWithApple = async (): Promise<UserCredential | null> => {
  try {
    // First check if there's a redirect result
    const result = await getRedirectResult(auth);
    if (result) {
      return result;
    }
    // Otherwise initiate the redirect
    await signInWithRedirect(auth, appleProvider);
    return null;
  } catch (error) {
    console.error("Apple sign-in error:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Create user with email and password
export const createUserWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign out
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

// Auth state change listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export { auth, firestore };
