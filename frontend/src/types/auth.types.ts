/**
 * Authentication and User Domain Types
 */

export type UserRole =
  | 'ADMINISTRATOR'
  | 'PERMANENT_STAFF'
  | 'INTERN'
  | 'ADMIN'
  | 'STAFF'
  | (string & {});

export interface AuthUser {
  id: string;
  userId?: string;
  username?: string;
  phoneNumber?: string;
  email: string;
  fullName?: string;
  role: UserRole;
  designation?: string;
  department?: string;
  employmentType?: string;
  internRole?: string;
  accountStatus?: string;
  mustChangePassword?: boolean;
  isActivated?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mustChangePassword: boolean;
}

export interface LoginCredentials {
  identifier: string; // Phone, Email or User ID
  password?: string;
}

export interface SendOtpPayload {
  phoneNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  phoneNumber: string;
  debugOtp?: string;
  fullName?: string;
  userRole?: UserRole;
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  otp: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ActivateAccountPayload {
  token: string;
  password?: string;
}

export interface UpdateUserProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  designation?: string;
  department?: string;
  employmentType?: string;
  internRole?: string;
  password?: string;
}

export interface AuthContextValue extends AuthState {
  /** Send OTP to phone number */
  sendOtp: (phoneNumber: string) => Promise<SendOtpResponse>;
  /** Verify OTP code and authenticate */
  verifyOtp: (phoneNumber: string, otp: string) => Promise<AuthUser>;
  /** Legacy/Fallback login */
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  /** Logout */
  logout: () => Promise<void>;
  /** Session refresh */
  refreshCurrentUser: () => Promise<void>;
  /** Update user profile */
  updateUserProfile: (payload: UpdateUserProfilePayload) => Promise<AuthUser>;
  /** Change password */
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  /** Account activation */
  activateAccount: (payload: ActivateAccountPayload) => Promise<void>;
  /** Clear any error */
  clearError: () => void;
}

