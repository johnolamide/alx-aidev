"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

/**
 * Authentication Context Type Definition
 * Defines the shape of the authentication context provided to components
 */
type AuthContextType = {
  user: User | null;           // Current authenticated user or null
  loading: boolean;           // Loading state during auth operations
  signIn: (email: string, password: string) => Promise<void>;  // Sign in function
  signUp: (email: string, password: string, name: string) => Promise<void>; // Sign up function
  signOut: () => Promise<void>; // Sign out function
};

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Wraps the application to provide authentication context to all child components
 *
 * @param children - React components that need access to authentication
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    /**
     * Initialize authentication state on component mount
     * Fetches the current session and sets up auth state change listener
     */
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    /**
     * Listen for authentication state changes
     * Updates user state when sign in/out events occur
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  /**
   * Sign in user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if authentication fails
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  /**
   * Sign up new user with email, password, and name
   * @param email - User's email address
   * @param password - User's password
   * @param name - User's display name
   * @throws Error if registration fails
   */
  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  /**
   * Sign out current user
   * Clears the authentication session
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Context value object containing auth state and methods
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider component
 *
 * @returns Authentication context with user state and auth methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
