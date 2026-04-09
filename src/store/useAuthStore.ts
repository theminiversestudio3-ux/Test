import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Get the JWT token for backend API calls
        const token = await firebaseUser.getIdToken();
        
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          set({ user: userDoc.data() as User, token, loading: false, initialized: true });
        } else {
          // Create new user profile
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'customer',
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newUser);
          set({ user: newUser, token, loading: false, initialized: true });
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        set({ user: null, token: null, loading: false, initialized: true });
      }
    } else {
      set({ user: null, token: null, loading: false, initialized: true });
    }
  });

  return {
    user: null,
    token: null,
    loading: true,
    initialized: false,
    loginWithGoogle: async () => {
      set({ loading: true });
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Login failed:', error);
        set({ loading: false });
      }
    },
    logout: async () => {
      set({ loading: true });
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Logout failed:', error);
        set({ loading: false });
      }
    },
    getToken: async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken(true); // Force refresh
        set({ token });
        return token;
      }
      return null;
    }
  };
});
