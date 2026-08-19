import React, { useState, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import type {
  AuthState,
  AuthContextValue,
  LoginCredentials,
  ChangePasswordPayload,
  ActivateAccountPayload,
} from '../types/auth.types';

/* ─────────────────────────────────────────────────────────── */
/* Initial Safe State                                          */
/* ─────────────────────────────────────────────────────────── */
const initialAuthState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mustChangePassword: false,
};

/* ─────────────────────────────────────────────────────────── */
/* AuthProvider Props                                          */
/* ─────────────────────────────────────────────────────────── */
export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider
 *
 * Provides frontend authentication state architecture.
 *
 * IMPORTANT:
 * - Does NOT mock user sessions or create fake tokens.
 * - Does NOT write to localStorage or sessionStorage.
 * - All methods are structured as integration points for the upcoming backend API.
 * - State remains safely unauthenticated until real backend services are connected.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  /**
   * Clear any active error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Login Integration Point
   * To be connected to the real backend authentication endpoint.
   */
  const login = useCallback(async (_: LoginCredentials): Promise<void> => {
    // Intentionally un-implemented placeholder
    // Real integration will call backend authentication API when available.
    void _;
    throw new Error('Backend authentication API is not connected yet.');
  }, []);

  /**
   * Logout Integration Point
   * To be connected to the real backend logout/session teardown endpoint.
   */
  const logout = useCallback(async (): Promise<void> => {
    setState(initialAuthState);
  }, []);

  /**
   * Current User Refresh Integration Point
   * To be connected to backend session validation endpoint (e.g., /api/auth/me).
   */
  const refreshCurrentUser = useCallback(async (): Promise<void> => {
    // Intentionally un-implemented placeholder
    // Safe no-op until backend session restoration is connected.
  }, []);

  /**
   * Change Password Integration Point
   * To be connected to backend change-password endpoint.
   */
  const changePassword = useCallback(async (_: ChangePasswordPayload): Promise<void> => {
    // Intentionally un-implemented placeholder
    void _;
    throw new Error('Backend change-password API is not connected yet.');
  }, []);

  /**
   * Account Activation Integration Point
   * To be connected to backend account activation endpoint.
   */
  const activateAccount = useCallback(async (_: ActivateAccountPayload): Promise<void> => {
    // Intentionally un-implemented placeholder
    void _;
    throw new Error('Backend activation API is not connected yet.');
  }, []);

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
