/**
 * Authentication and User Domain Types
 *
 * Designed to cleanly decouple the frontend UI architecture from
 * the future backend API implementation without prematurely hardcoding
 * unconfirmed backend schemas or enum values.
 */

/**
 * Conceptual user roles within the AI & Data Programme Pipeline.
 *
 * Current business terminology:
 * - Administrator
 * - Permanent Staff
 * - Intern
 *
 * Defined as a flexible string union and string type to easily adapt
 * to whatever format the backend team confirms (e.g., 'ADMIN' | 'STAFF' | 'INTERN'
 * or 'admin' | 'permanent_staff' | 'intern').
 */
export type UserRole =
  | 'ADMINISTRATOR'
  | 'PERMANENT_STAFF'
  | 'INTERN'
  | 'ADMIN'
  | 'STAFF'
  | (string & {});

/**
 * Conceptual user profile representing an authenticated identity.
 * Keep fields optional/flexible to prevent assumptions before backend finalization.
 */
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  department?: string;
  mustChangePassword?: boolean;
  isActivated?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

/**
 * Overall frontend authentication state.
 */
export interface AuthState {
  /** The currently authenticated user, or null if unauthenticated */
  user: AuthUser | null;
  /** Verified role of the authenticated user, or null if unauthenticated */
  role: UserRole | null;
  /** Whether there is an active, verified authenticated session */
  isAuthenticated: boolean;
  /** Loading state during session restoration or auth operations */
  isLoading: boolean;
  /** Last authentication-related error message, if any */
  error: string | null;
  /** Whether the user must change password before full access */
  mustChangePassword: boolean;
}

/**
 * Expected credential payload structure for future login.
 */
export interface LoginCredentials {
  identifier: string; // Email or User ID
  password: string;
}

/**
 * Expected payload structure for future change-password.
 */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Expected payload structure for future account activation.
 */
export interface ActivateAccountPayload {
  token?: string;
  newPassword: string;
}

/**
 * Public methods and state exposed by the AuthContext to consumers.
 */
export interface AuthContextValue extends AuthState {
  /** Future login integration point */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Future logout integration point */
  logout: () => Promise<void>;
  /** Future session refresh / current user fetch integration point */
  refreshCurrentUser: () => Promise<void>;
  /** Future change password integration point */
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  /** Future account activation integration point */
  activateAccount: (payload: ActivateAccountPayload) => Promise<void>;
  /** Clear any active authentication error state */
  clearError: () => void;
}
