import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Generate JWT Token helper
 */
const generateToken = (id: string, role: UserRole, userId: string, phoneNumber?: string): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_ai_data_pipeline_jwt_key_2026';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id, role, userId, phoneNumber }, secret, { expiresIn });
};

/**
 * Standardize phone number for clean matching
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/[\s\-\(\)\+]/g, '').trim();
};

/**
 * @desc    Send OTP to phone number for login
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !phoneNumber.toString().trim()) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number',
      });
      return;
    }

    const rawPhone = phoneNumber.toString().trim();
    const cleanPhone = normalizePhoneNumber(rawPhone);

    // Find user by exact match or normalized match or standard Lankan variations (07... vs 947...)
    const phoneRegex = new RegExp(cleanPhone.replace(/^0/, '(0|94|\\+94)?') + '$', 'i');

    const user = await User.findOne({
      $or: [
        { phoneNumber: rawPhone },
        { phoneNumber: cleanPhone },
        { phoneNumber: { $regex: phoneRegex } },
      ],
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: `No account found with phone number "${rawPhone}". Please contact your System Administrator.`,
      });
      return;
    }

    if (user.accountStatus === 'INACTIVE') {
      res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact your Administrator.',
      });
      return;
    }

    // Generate 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes valid

    user.otpCode = generatedOtp;
    user.otpExpiresAt = otpExpiry;
    await user.save();

    // Log simulated SMS sending to console
    console.log(`\n==================================================`);
    console.log(`📱 [SMS GATEWAY SIMULATION]`);
    console.log(`Recipient: ${user.fullName} (${user.role}) - ${user.phoneNumber}`);
    console.log(`Security OTP Code: [ ${generatedOtp} ]`);
    console.log(`Expires At: ${otpExpiry.toLocaleTimeString()}`);
    console.log(`==================================================\n`);

    res.status(200).json({
      success: true,
      message: `OTP successfully sent to ${user.phoneNumber}`,
      phoneNumber: user.phoneNumber,
      // Provide OTP in response for seamless development & testing experience
      debugOtp: generatedOtp,
      userRole: user.role,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate and send OTP code',
    });
  }
};

/**
 * @desc    Verify OTP and authenticate user
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      res.status(400).json({
        success: false,
        message: 'Please provide both phone number and verification OTP code',
      });
      return;
    }

    const rawPhone = phoneNumber.toString().trim();
    const cleanPhone = normalizePhoneNumber(rawPhone);
    const cleanOtp = otp.toString().trim();

    const phoneRegex = new RegExp(cleanPhone.replace(/^0/, '(0|94|\\+94)?') + '$', 'i');

    const user = await User.findOne({
      $or: [
        { phoneNumber: rawPhone },
        { phoneNumber: cleanPhone },
        { phoneNumber: { $regex: phoneRegex } },
      ],
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Account not found for this phone number',
      });
      return;
    }

    if (user.accountStatus === 'INACTIVE') {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an Administrator.',
      });
      return;
    }

    // Verify OTP code and check expiration
    if (!user.otpCode || user.otpCode !== cleanOtp) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
      return;
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new OTP.',
      });
      return;
    }

    // Clear used OTP
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.role, user.userId, user.phoneNumber);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during OTP verification',
    });
  }
};

/**
 * @desc    Authenticate User via Credentials (fallback/legacy)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Please provide Phone Number, Email, or User ID',
      });
      return;
    }

    const cleanIdentifier = identifier.toString().trim();
    const cleanPhone = normalizePhoneNumber(cleanIdentifier);

    // Query user by Phone, Email, Username, or User ID
    const user = await User.findOne({
      $or: [
        { phoneNumber: cleanIdentifier },
        { phoneNumber: cleanPhone },
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

    // If password provided, verify it
    if (password) {
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials. Incorrect password.',
        });
        return;
      }
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
    const token = generateToken(user._id.toString(), user.role, user.userId, user.phoneNumber);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
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
        phoneNumber: req.user.phoneNumber,
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
