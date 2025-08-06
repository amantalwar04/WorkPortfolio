// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  getAdditionalUserInfo
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-auth-domain.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project-id.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "demo-app-id"
};

// Initialize Firebase
let app;
let auth;
let db;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Request additional scopes for profile information
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
} catch (error) {
  console.warn('Firebase not configured properly, using demo mode');
}
// This allows the app to build without Firebase setup
export class AuthService {
  private isInitialized = false;
  private currentUser: any = null;
  private authStateListeners: ((user: any) => void)[] = [];

  async initialize() {
    try {
      if (auth) {
        // Real Firebase initialization
        this.isInitialized = true;
        
        // Set up auth state listener
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
            };
            this.currentUser = user;
            this.saveUserToStorage(user);
          } else {
            this.currentUser = null;
            this.removeUserFromStorage();
          }
          
          // Notify all listeners
          this.authStateListeners.forEach(listener => listener(this.currentUser));
        });
        
        return true;
      } else {
        // Fallback to localStorage for demo
        console.warn('Firebase not configured, using local storage only');
        this.isInitialized = true;
        this.currentUser = this.loadUserFromStorage();
        return true;
      }
    } catch (error) {
      console.warn('Firebase initialization failed, using local storage only');
      this.isInitialized = true;
      this.currentUser = this.loadUserFromStorage();
      return true;
    }
  }

  private loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('portfolio_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private saveUserToStorage(user: any) {
    try {
      localStorage.setItem('portfolio_user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      if (auth) {
        // Real Firebase email authentication
        const result = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;
        
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          verified: firebaseUser.emailVerified
        };
        
        this.currentUser = user;
        this.saveUserToStorage(user);
        
        return { user };
      } else {
        // Demo mode fallback
        const user = {
          uid: btoa(email).replace(/[^a-zA-Z0-9]/g, ''),
          email,
          displayName: email.split('@')[0],
          photoURL: null,
          createdAt: new Date().toISOString(),
          verified: true
        };
        
        this.currentUser = user;
        this.saveUserToStorage(user);
        
        return { user };
      }
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Sign in failed');
      }
    }
  }

  async signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      if (auth) {
        // Real Firebase email registration
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;
        
        // Update profile with display name
        if (displayName) {
          await updateProfile(firebaseUser, { displayName });
        }
        
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: displayName || email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          verified: firebaseUser.emailVerified
        };
        
        this.currentUser = user;
        this.saveUserToStorage(user);
        
        return { user };
      } else {
        // Demo mode fallback
        const user = {
          uid: btoa(email).replace(/[^a-zA-Z0-9]/g, ''),
          email,
          displayName: displayName || email.split('@')[0],
          photoURL: null,
          createdAt: new Date().toISOString(),
          verified: true
        };
        
        this.currentUser = user;
        this.saveUserToStorage(user);
        
        return { user };
      }
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else {
        throw new Error(error.message || 'Sign up failed');
      }
    }
  }

  async signInWithGoogle() {
    try {
      if (auth && googleProvider) {
        // Real Firebase Google authentication
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        
        // Extract additional profile information from Google
        const additionalUserInfo = getAdditionalUserInfo(result);
        const profile = additionalUserInfo?.profile as any;
        
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          // Additional Google profile data
          firstName: profile?.given_name || firebaseUser.displayName?.split(' ')[0] || '',
          lastName: profile?.family_name || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          locale: profile?.locale || 'en',
          verified: firebaseUser.emailVerified
        };
        
        this.currentUser = user;
        this.saveUserToStorage(user);
        
        return { user };
      } else {
        // Fallback demo mode
        const user = {
          uid: 'google_user_' + Date.now(),
          email: 'demo@gmail.com',
          displayName: 'Demo User',
          photoURL: 'https://via.placeholder.com/150',
          createdAt: new Date().toISOString(),
          firstName: 'Demo',
          lastName: 'User',
          locale: 'en',
          verified: true
        };
        
        this.currentUser = user;
        this.saveUserToStorage(user);
        
        return { user };
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(error.message || 'Google sign-in failed. Please try again.');
      }
    }
  }

  async signOut() {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      this.currentUser = null;
      this.removeUserFromStorage();
      
      // Notify all listeners
      this.authStateListeners.forEach(listener => listener(null));
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Sign out failed');
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  onAuthStateChanged(callback: (user: any) => void) {
    // Add to listeners array
    this.authStateListeners.push(callback);
    
    // Call immediately with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  private removeUserFromStorage() {
    localStorage.removeItem('portfolio_user');
    localStorage.removeItem('portfolio_data');
  }
}

// Database service for portfolio data
export class DatabaseService {
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  async savePortfolio(portfolioData: any) {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      // In production, save to Firestore
      // For demo, save to localStorage with user prefix
      const key = `portfolio_data_${this.userId}`;
      localStorage.setItem(key, JSON.stringify({
        ...portfolioData,
        lastModified: new Date().toISOString(),
        userId: this.userId,
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw error;
    }
  }

  async loadPortfolio() {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      // In production, load from Firestore
      // For demo, load from localStorage
      const key = `portfolio_data_${this.userId}`;
      const data = localStorage.getItem(key);
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading portfolio:', error);
      return null;
    }
  }

  async deletePortfolio() {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      const key = `portfolio_data_${this.userId}`;
      localStorage.removeItem(key);
      
      return true;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }

  async getUserPortfolios(userId: string) {
    try {
      // In production, query Firestore for user's portfolios
      // For demo, just return the single portfolio
      const key = `portfolio_data_${userId}`;
      const data = localStorage.getItem(key);
      
      return data ? [JSON.parse(data)] : [];
    } catch (error) {
      console.error('Error getting user portfolios:', error);
      return [];
    }
  }
}

// Export service instances
export const authService = new AuthService();
export const dbService = new DatabaseService();

// Initialize services
export const initializeFirebase = async () => {
  try {
    await authService.initialize();
    console.log('Firebase services initialized (demo mode)');
    return true;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return false;
  }
};

export default {
  authService,
  dbService,
  initializeFirebase,
};