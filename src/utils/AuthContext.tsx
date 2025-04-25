import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { auth, logoutUser } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import LoginBottomSheet from '../components/LoginBottomSheet';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<boolean>;
  getUserData: () => User | null;
  handleSuccessfulAuth: (firebaseUser: FirebaseUser, backendUserData?: any) => void;
  showLoginSheet: () => void;
  hideLoginSheet: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  updateUserProfile: async () => false,
  logout: async () => false,
  getUserData: () => null,
  handleSuccessfulAuth: () => {},
  showLoginSheet: () => {},
  hideLoginSheet: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use Firebase's auth state observer
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Check if we have user data in localStorage
        const storedUserData = localStorage.getItem('currentUser');
        
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            // Verify that the stored user matches the current Firebase user
            if (parsedData.user && parsedData.user.id === firebaseUser.uid) {
              setUser(parsedData.user);
            } else {
              // Create a new user profile if IDs don't match
              createNewUserProfile(firebaseUser);
            }
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            createNewUserProfile(firebaseUser);
          }
        } else {
          // Create a new user profile if none exists
          createNewUserProfile(firebaseUser);
        }
      } else {
        // No user is signed in
        setUser(null);
        localStorage.removeItem('currentUser');
      }
      
      setIsLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Create a new user profile from Firebase user
  const createNewUserProfile = (firebaseUser: FirebaseUser) => {
    const newUser: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'User',
      phone: firebaseUser.phoneNumber?.replace('+91', '') || '',
      email: firebaseUser.email || undefined,
      addresses: []
    };
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify({ user: newUser }));
  };
  
  // Function to update the current user
  const updateCurrentUser = (userData: User | null) => {
    setUser(userData);
    
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify({ user: userData }));
    } else {
      localStorage.removeItem('currentUser');
    }
  };
  
  // Update user profile data
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!firebaseUser) return false;
      
      const updatedUser = { ...user, ...userData } as User;
      updateCurrentUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };
  
  // Get current user data
  const getUserData = (): User | null => {
    return user;
  };
  
  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      const result = await logoutUser();
      if (result.success) {
        // Auth state change listener will handle clearing the user state
        return true;
      }
      return false;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };
  
  // Function to handle successful authentication
  const handleSuccessfulAuth = (firebaseUser: FirebaseUser, backendUserData?: any) => {
    // Create a user object from Firebase user and backend data
    const newUser: User = {
      id: backendUserData?.id || firebaseUser.uid,
      name: backendUserData?.name || '',
      phone: backendUserData?.phone?.replace('+91', '') || firebaseUser.phoneNumber?.replace('+91', '') || '',
      email: backendUserData?.email || firebaseUser.email || '',
      addresses: backendUserData?.addresses || []
    };
    
    setFirebaseUser(firebaseUser);
    updateCurrentUser(newUser);
  };
  
  const showLoginSheet = () => {
    setIsLoginSheetOpen(true);
  };

  const hideLoginSheet = () => {
    setIsLoginSheetOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        updateUserProfile,
        logout,
        getUserData,
        handleSuccessfulAuth,
        showLoginSheet,
        hideLoginSheet
      }}
    >
      {children}
      <LoginBottomSheet 
        isOpen={isLoginSheetOpen} 
        onClose={hideLoginSheet} 
      />
    </AuthContext.Provider>
  );
};
