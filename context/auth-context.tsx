'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

type User = {
  id: number;
  email: string;
  role: string;
  name?: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CHECK_AUTH_STATUS_START' }
  | { type: 'CHECK_AUTH_STATUS_SUCCESS'; payload: User | null }
  | { type: 'CHECK_AUTH_STATUS_FAILURE' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, loading: false };
    case 'LOGIN_FAILURE':
      return { user: null, loading: false };
    case 'LOGOUT':
      return { user: null, loading: false };
    case 'CHECK_AUTH_STATUS_START':
      return { ...state, loading: true };
    case 'CHECK_AUTH_STATUS_SUCCESS':
      return { user: action.payload, loading: false };
    case 'CHECK_AUTH_STATUS_FAILURE':
      return { user: null, loading: false };
    default:
      return state;
  }
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, loading: true });

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user in localStorage for persistence
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuthStatus = async () => {
    dispatch({ type: 'CHECK_AUTH_STATUS_START' });

    try {
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'CHECK_AUTH_STATUS_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'CHECK_AUTH_STATUS_SUCCESS', payload: null });
      }
    } catch (error) {
      dispatch({ type: 'CHECK_AUTH_STATUS_FAILURE' });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const isAdmin = state.user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        logout,
        checkAuthStatus,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};