import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type {
  AuthState,
  AuthContextValue,
  AuthUser,
  LoginCredentials,
  ChangePasswordPayload,
  ActivateAccountPayload,
} from '../types/auth.types';

const API_BASE_URL = 'http://localhost:5000/api';

/* ─────────────────────────────────────────────────────────── */
/* Initial Safe State                                          */
/* ─────────────────────────────────────────────────────────── */
const initialAuthState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  mustChangePassword: false,
};

/* ─────────────────────────────────────────────────────────── */
/* AuthProvider Props                                          */
/* ─────────────────────────────────────────────────────────── */
export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  /**
   * Clear any active error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Current User Refresh / Session Restoration
   */
  const refreshCurrentUser = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({
        ...initialAuthState,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Session expired');
      }

      const data = await response.json();
      setState({
        user: data.user,
        role: data.user.role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        mustChangePassword: false,
      });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState({
        ...initialAuthState,
        isLoading: false,
      });
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  /**
   * Login Implementation
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthUser> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed. Please check credentials.');
        }

        // Save token and user details to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setState({
          user: data.user,
          role: data.user.role,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          mustChangePassword: false,
        });

        return data.user;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred during login';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }
    },
    []
  );

  /**
   * Logout Implementation
   */
  const logout = useCallback(async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      ...initialAuthState,
      isLoading: false,
    });
  }, []);

  /**
   * Change Password Integration Point
   */
  const changePassword = useCallback(
    async (_: ChangePasswordPayload): Promise<void> => {
      void _;
      throw new Error('Change password feature will be activated in upcoming update.');
    },
    []
  );

  /**
   * Account Activation Integration Point
   */
  const activateAccount = useCallback(
    async (_: ActivateAccountPayload): Promise<void> => {
      void _;
      throw new Error('Account activation feature will be activated in upcoming update.');
    },
    []
  );

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refreshCurrentUser,
      changePassword,
      activateAccount,
      clearError,
    }),
    [state, login, logout, refreshCurrentUser, changePassword, activateAccount, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
