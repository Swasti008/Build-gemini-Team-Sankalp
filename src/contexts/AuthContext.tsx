'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  phoneNumber: string;
  name?: string;
  gender?: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sih-2025-fc4t.onrender.com/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('baddi-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('baddi-user');
      }
    }
  }, []);

  const login = async (phoneNumber: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, accept any 6-digit OTP as mentioned in requirements
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return false;
      }

      // Normalize phone number
      const normalizedPhone = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : phoneNumber.startsWith('91') 
        ? `+${phoneNumber}`
        : `+91${phoneNumber}`;

      // Dummy verification - skip API call and allow user to pass through
      // TODO: Implement real OTP verification when needed
      
      // Create user object
      const userData: User = {
        phoneNumber: normalizedPhone,
        name: 'User', // Will be fetched from backend
        isAuthenticated: true,
      };

      setUser(userData);
      localStorage.setItem('baddi-user', JSON.stringify(userData));
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('baddi-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
