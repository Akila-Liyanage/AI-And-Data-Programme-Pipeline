import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  role: UserRole;
  userId: string;
}

/**
 * Protect routes - Verifies JWT Token and attaches user to request
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'super_secret_ai_data_pipeline_jwt_key_2026';
      let user: IUser | null = null;

      try {
        // First try local JWT verification
        const decoded = jwt.verify(token, secret) as JwtPayload;
        if (decoded && decoded.id) {
          user = await User.findById(decoded.id).select('-password');
        }
      } catch (localJwtError) {
        // If local verification fails, check if this is a Keycloak OpenID token
        const keycloakDecoded = jwt.decode(token) as any;
        if (keycloakDecoded && (keycloakDecoded.iss || keycloakDecoded.sub)) {
          // Check token expiration
          if (keycloakDecoded.exp && keycloakDecoded.exp * 1000 < Date.now()) {
            res.status(401).json({ message: 'Keycloak session expired. Please sign in again.' });
            return;
          }

          const email = (keycloakDecoded.email || '').toLowerCase().trim();
          const username = (keycloakDecoded.preferred_username || '').toLowerCase().trim();

          user = await User.findOne({
            $or: [
              ...(email ? [{ email }] : []),
              ...(username ? [{ username }, { email: username }] : []),
            ],
          }).select('-password');

          // If user exists in Keycloak but not yet in MongoDB, create baseline user
          if (!user && (email || username)) {
            const userEmail = email || `${username}@aidata.com`;
            const nameParts = (keycloakDecoded.name || username).split(' ');
            user = new User({
              userId: `STF-${Math.floor(100 + Math.random() * 900)}`,
              username: username || userEmail.split('@')[0],
              fullName: keycloakDecoded.name || `${keycloakDecoded.given_name || 'Keycloak'} ${keycloakDecoded.family_name || 'User'}`,
              phoneNumber: `077${Math.floor(1000000 + Math.random() * 9000000)}`,
              email: userEmail,
              role: userEmail.includes('admin') ? 'ADMIN' : 'PERMANENT_STAFF',
              department: 'AI & Data Systems',
              accountStatus: 'ACTIVE',
            });
            await user.save();
          }
        }
      }

      if (!user) {
        res.status(401).json({ message: 'User belonging to this token no longer exists' });
        return;
      }

      if (user.accountStatus !== 'ACTIVE') {
        res.status(403).json({ message: 'Account is not active. Please contact administrator.' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * Restricts route access to specified user roles
 * Example usage: authorize('ADMIN'), authorize('ADMIN', 'PERMANENT_STAFF')
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
      return;
    }

    next();
  };
};
