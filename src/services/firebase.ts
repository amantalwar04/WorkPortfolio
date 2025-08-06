// Firebase configuration and initialization
// This is a template - in production, use environment variables for API keys

const firebaseConfig = {
  // These would be loaded from environment variables in production
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-auth-domain.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id"
};

// Simple authentication service without Firebase dependency
// This allows the app to build without Firebase setup
export class AuthService {
  private isInitialized = false;
  private currentUser: any = null;

  async initialize() {
    try {
      // In production, initialize Firebase here
      // For now, we'll use localStorage for demo purposes
      this.isInitialized = true;
      this.currentUser = this.loadUserFromStorage();
      return true;
    } catch (error) {
      console.warn('Firebase not configured, using local storage only');
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
      // In production, use Firebase authentication
      // For demo, create a simple user object
      const user = {
        uid: btoa(email).replace(/[^a-zA-Z0-9]/g, ''),
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        createdAt: new Date().toISOString(),
      };
      
      this.currentUser = user;
      this.saveUserToStorage(user);
      
      return { user };
    } catch (error) {
      throw new Error('Sign in failed');
    }
  }

  async signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      // In production, use Firebase authentication
      const user = {
        uid: btoa(email).replace(/[^a-zA-Z0-9]/g, ''),
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
        createdAt: new Date().toISOString(),
      };
      
      this.currentUser = user;
      this.saveUserToStorage(user);
      
      return { user };
    } catch (error) {
      throw new Error('Sign up failed');
    }
  }

  async signInWithGoogle() {
    try {
      // In production, use Firebase Google auth
      const user = {
        uid: 'google_user_' + Date.now(),
        email: 'demo@gmail.com',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
      };
      
      this.currentUser = user;
      this.saveUserToStorage(user);
      
      return { user };
    } catch (error) {
      throw new Error('Google sign in failed');
    }
  }

  async signOut() {
    try {
      this.currentUser = null;
      localStorage.removeItem('portfolio_user');
      localStorage.removeItem('portfolio_data');
      return true;
    } catch (error) {
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
    // In production, use Firebase auth state listener
    // For demo, just call with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {};
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