import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '../types';

// This informs TypeScript that the `google` object from the Google Identity Services
// script can exist on the `window` object.
declare global {
  interface Window {
    google?: any;
  }
}

interface AuthContextType {
  user: User | null;
  login: (credential: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to load user from localStorage on initial load
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);


  const login = (credential: string) => {
    try {
      const decodedUser = parseJwt(credential);
      if(decodedUser) {
        const userData: User = {
          name: decodedUser.name,
          email: decodedUser.email,
          picture: decodedUser.picture,
          given_name: decodedUser.given_name,
          family_name: decodedUser.family_name,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
         throw new Error("Invalid credential");
      }
    } catch (error) {
      console.error("Failed to login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Also sign out from Google
    if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};