import { createContext } from 'react';
import type { AuthContextValue } from '../types/auth.types';

/**
 * Authentication Context definition.
 * Initialized as undefined so useAuth can safely detect usage outside AuthProvider.
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
