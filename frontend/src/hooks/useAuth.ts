import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextValue } from '../types/auth.types';

/**
 * Custom hook to consume the authentication context.
 *
 * Provides typed access to the current authentication state and operations.
 * Throws a descriptive runtime error if invoked outside of an <AuthProvider>.
 *
 * @returns {AuthContextValue} The current authentication context value
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }

  return context;
}
