import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Generate JWT Token helper
 */
const generateToken = (id: string, role: UserRole, userId: string): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_ai_data_pipeline_jwt_key_2026';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id, role, userId }, secret, { expiresIn });
};

/**
 * @desc    Authenticate User & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide Email / User ID and Password',
      });
      return;
    }

    const cleanIdentifier = identifier.trim();

    // Query user by Email, Username, or User ID (case-insensitive for email/username)
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { username: cleanIdentifier.toLowerCase() },
        { userId: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } },
      ],
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
      return;
    }

    // Verify Password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    // Check account status
    if (user.accountStatus === 'INACTIVE') {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an Administrator.',
      });
      return;
    }

    // Generate JWT Token
    const token = generateToken(user._id.toString(), user.role, user.userId);

    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred during login',
    });
  }
};

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        userId: req.user.userId,
        username: req.user.username,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        designation: req.user.designation,
        department: req.user.department,
        accountStatus: req.user.accountStatus,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile',
    });
  }
};
