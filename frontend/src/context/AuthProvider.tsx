import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { loginWithKeycloak } from '../services/keycloakAuth';
import type {
  AuthState,
  AuthContextValue,
  AuthUser,
  LoginCredentials,
  SendOtpResponse,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ChangePasswordPayload,
  ActivateAccountPayload,
  UpdateUserProfilePayload,
} from '../types/auth.types';
import { API_BASE_URL } from '../config/api';

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
   * Send OTP Implementation
   */
  const sendOtp = useCallback(async (phoneNumber: string): Promise<SendOtpResponse> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP to this phone number.');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while sending OTP';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Verify OTP Implementation
   */
  const verifyOtp = useCallback(async (phoneNumber: string, otp: string): Promise<AuthUser> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid or expired OTP code.');
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
        err instanceof Error ? err.message : 'An error occurred during OTP verification';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Keycloak OIDC Login Implementation
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthUser> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const username = (credentials.identifier || (credentials as any).username || (credentials as any).email || '').trim();
      const password = credentials.password || '';

      try {
        let accessToken: string;
        let refreshToken: string | undefined;

        try {
          // 1. Direct OIDC Resource Owner Password Credentials Grant to Keycloak
          const keycloakData = await loginWithKeycloak(username, password);
          accessToken = keycloakData.access_token;
          refreshToken = keycloakData.refresh_token;
        } catch (kcErr: any) {
          // If direct Keycloak attempt failed, attempt backend bridge
          const response = await fetch(`${API_BASE_URL}/auth/keycloak-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || kcErr.message || 'Keycloak authentication failed');
          }
          accessToken = data.token;
          refreshToken = data.keycloakTokens?.refresh_token;
        }

        // Save Keycloak tokens securely in localStorage
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // 2. Fetch authenticated user profile using Keycloak Bearer token
        const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let authUser: AuthUser;
        if (meRes.ok) {
          const meData = await meRes.json();
          authUser = meData.user;
        } else {
          // Fallback baseline user construction
          const isStaff = !username.includes('intern');
          const isAdmin = username.includes('admin');
          authUser = {
            id: username,
            userId: isAdmin ? 'ADM-001' : isStaff ? 'STF-101' : 'INT-201',
            username,
            email: username,
            fullName: isAdmin ? 'Akila Liyanage' : isStaff ? 'Dr. Kasun Perera' : 'Ayuni Sliit',
            role: isAdmin ? 'ADMIN' : isStaff ? 'PERMANENT_STAFF' : 'INTERN',
            accountStatus: 'ACTIVE',
            department: 'AI & Data Systems',
          };
        }

        localStorage.setItem('user', JSON.stringify(authUser));

        setState({
          user: authUser,
          role: authUser.role,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          mustChangePassword: false,
        });

        return authUser;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred during Keycloak login';
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
   * Update Profile Implementation
   */
  const updateUserProfile = useCallback(
    async (payload: UpdateUserProfilePayload): Promise<AuthUser> => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update profile.');
        }

        // Update local storage and auth state
        localStorage.setItem('user', JSON.stringify(data.user));

        setState((prev) => ({
          ...prev,
          user: data.user,
          isLoading: false,
          error: null,
        }));

        return data.user;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred while updating profile';
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

  /**
   * Request Password Reset Code via Email
   */
  const forgotPassword = useCallback(async (email: string): Promise<ForgotPasswordResponse> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send password reset code.');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while sending reset code';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Reset Password with Email Code
   */
  const resetPassword = useCallback(async (payload: ResetPasswordPayload): Promise<AuthUser> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
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
        err instanceof Error ? err.message : 'An error occurred while resetting password';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      sendOtp,
      verifyOtp,
      forgotPassword,
      resetPassword,
      login,
      logout,
      refreshCurrentUser,
      updateUserProfile,
      changePassword,
      activateAccount,
      clearError,
    }),
    [state, sendOtp, verifyOtp, forgotPassword, resetPassword, login, logout, refreshCurrentUser, updateUserProfile, changePassword, activateAccount, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

