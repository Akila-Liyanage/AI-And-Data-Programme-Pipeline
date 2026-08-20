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
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Find user from database and attach to req.user (exclude password)
      const user = await User.findById(decoded.id).select('-password');

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
