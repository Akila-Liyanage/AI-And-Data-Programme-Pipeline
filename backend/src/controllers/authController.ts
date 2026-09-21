import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { generateNextUserId } from './userController';

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
/**
 * Format user object for API responses
 */
export const formatUserResponse = (user: any) => ({
  id: user._id ? user._id.toString() : user.id,
  userId: user.userId,
  username: user.username,
  fullName: user.fullName,
  phoneNumber: user.phoneNumber,
  email: user.email,
  role: user.role,
  designation: user.designation || '',
  department: user.department || 'AI & Data Team',
  employmentType: user.employmentType || '',
  internRole: user.internRole || '',
  accountStatus: user.accountStatus || 'ACTIVE',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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

    if (user.accountStatus !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        message: `Your account status is currently ${user.accountStatus.toLowerCase()}. Please contact an Administrator.`,
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
      user: formatUserResponse(user),
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

    // Check account status with clear feedback matching updated BRD
    if (user.accountStatus === 'PENDING') {
      res.status(403).json({
        success: false,
        accountStatus: 'PENDING',
        userId: user.userId,
        message: `Your account registration (ID: ${user.userId}) is pending administrator verification. Please wait for approval before logging in.`,
      });
      return;
    }

    if (user.accountStatus === 'REJECTED') {
      res.status(403).json({
        success: false,
        accountStatus: 'REJECTED',
        userId: user.userId,
        message: `Your account registration (ID: ${user.userId}) was not approved. Please contact the administrator for further details.`,
      });
      return;
    }

    if (user.accountStatus !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        accountStatus: user.accountStatus,
        userId: user.userId,
        message: `Your account is currently inactive. Please contact an Administrator.`,
      });
      return;
    }

    // Generate JWT Token
    const token = generateToken(user._id.toString(), user.role, user.userId, user.phoneNumber);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserResponse(user),
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
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile',
    });
  }
};

/**
 * @desc    Update authenticated user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const { fullName, phoneNumber, designation, department, employmentType, internRole, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found',
      });
      return;
    }

    if (fullName) user.fullName = fullName.trim();
    if (phoneNumber) {
      const cleanPhone = normalizePhoneNumber(phoneNumber);
      // Check for phone conflict
      const existing = await User.findOne({
        _id: { $ne: user._id },
        $or: [{ phoneNumber: phoneNumber.trim() }, { phoneNumber: cleanPhone }],
      });
      if (existing) {
        res.status(409).json({
          success: false,
          message: 'Phone number is already associated with another account',
        });
        return;
      }
      user.phoneNumber = phoneNumber.trim();
    }
    if (designation !== undefined) user.designation = designation.trim();
    if (department !== undefined) user.department = department.trim();
    if (employmentType !== undefined) user.employmentType = employmentType.trim();
    if (internRole !== undefined) user.internRole = internRole.trim();

    if (password && password.trim().length >= 6) {
      user.password = password.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user),
    });
  } catch (error: unknown) {
    console.error('Update profile error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Server error updating profile';
    res.status(500).json({
      success: false,
      message: errorMsg,
    });
  }
};

/**
 * @desc    Self-register user (Staff or Intern)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      password,
      role,
      employmentType,
      internRole,
      designation,
      department,
    } = req.body;

    // Validate role: Admin cannot self-register, role must be PERMANENT_STAFF or INTERN
    if (!role || (role !== 'PERMANENT_STAFF' && role !== 'INTERN')) {
      res.status(400).json({
        success: false,
        message: 'Invalid role selection. Public registration is only available for Staff and Interns.',
      });
      return;
    }

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Full Name, Phone Number, Email, and Password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const cleanPhone = normalizePhoneNumber(phoneNumber);
    const cleanEmail = email.toLowerCase().trim();

    // Check if phone or email already exists
    const existingUser = await User.findOne({
      $or: [
        { phoneNumber: phoneNumber.trim() },
        { phoneNumber: cleanPhone },
        { email: cleanEmail },
      ],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email.toLowerCase() === cleanEmail ? 'Email' : 'Phone Number';
      res.status(409).json({
        success: false,
        message: `A user with this ${conflictField} already exists in the system.`,
      });
      return;
    }

    let baseUsername = cleanEmail.split('@')[0] ||
      fullName.toLowerCase().replace(/[^a-z0-9]/g, '');

    baseUsername = baseUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    if (!baseUsername) {
      baseUsername = 'user';
    }

    let generatedUsername = baseUsername;
    let isUsernameUnique = false;
    let attempts = 0;

    while (!isUsernameUnique && attempts < 10) {
      const usernameExists = await User.findOne({ username: generatedUsername });
      if (!usernameExists) {
        isUsernameUnique = true;
      } else {
        attempts++;
        const suffix = Math.floor(100 + Math.random() * 900).toString();
        generatedUsername = `${baseUsername}${suffix}`;
      }
    }

    // Save with status PENDING (with retry loop in case of concurrent userId assignment)
    let newUser: any;
    let saveAttempts = 0;
    const maxSaveAttempts = 3;

    while (saveAttempts < maxSaveAttempts) {
      try {
        const generatedUserId = await generateNextUserId(role as UserRole);
        newUser = new User({
          userId: generatedUserId,
          username: generatedUsername,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: cleanEmail,
          password: password.trim(),
          role: role as UserRole,
          designation: designation ? designation.trim() : (internRole ? internRole.trim() : (role === 'PERMANENT_STAFF' ? 'Staff Member' : 'Intern Trainee')),
          employmentType: employmentType ? employmentType.trim() : undefined,
          internRole: internRole ? internRole.trim() : undefined,
          department: department ? department.trim() : 'AI & Data Team',
          accountStatus: 'PENDING',
        });

        await newUser.save();
        break;
      } catch (saveErr: any) {
        if (saveErr?.code === 11000 && (saveErr?.keyPattern?.userId || (saveErr?.message && saveErr.message.includes('userId')))) {
          saveAttempts++;
          if (saveAttempts >= maxSaveAttempts) throw saveErr;
        } else {
          throw saveErr;
        }
      }
    }

    console.log(`👤 [USER SELF-REGISTERED] Added ${newUser.fullName} (${newUser.role}) - Phone: ${newUser.phoneNumber}, ID: ${newUser.userId} - status: PENDING`);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending administrator verification.',
      user: formatUserResponse(newUser),
    });
  } catch (error: any) {
    console.error('Error during self-registration:', error);
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'field';
      res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
      return;
    }
    const errorMsg = error instanceof Error ? error.message : 'Registration failed';
    res.status(500).json({
      success: false,
      message: errorMsg,
    });
  }
};

/**
 * @desc    Request Password Reset Code via Email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.toString().trim()) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid registered email address',
      });
      return;
    }

    const cleanEmail = email.toString().trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      res.status(404).json({
        success: false,
        message: `No account found with email "${cleanEmail}". Please verify your email or contact an Administrator.`,
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

    if (user.accountStatus === 'PENDING') {
      res.status(403).json({
        success: false,
        message: 'Your account registration is pending administrator approval. Password reset is not available yet.',
      });
      return;
    }

    // Generate 6-digit numeric reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes valid

    user.resetPasswordOtp = resetCode;
    user.resetPasswordExpiresAt = resetExpiry;
    await user.save();

    // Log simulated Email sending to console
    console.log(`\n==================================================`);
    console.log(`📧 [EMAIL DISPATCH SIMULATION]`);
    console.log(`To: ${user.fullName} <${user.email}>`);
    console.log(`Subject: Password Reset Verification Code - SLT-Mobitel AI & Data Programme`);
    console.log(`Security Reset Code: [ ${resetCode} ]`);
    console.log(`Expires At: ${resetExpiry.toLocaleTimeString()}`);
    console.log(`==================================================\n`);

    res.status(200).json({
      success: true,
      message: `Password reset code sent to ${user.email}`,
      email: user.email,
      debugCode: resetCode,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error('Error sending password reset code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset code. Please try again.',
    });
  }
};

/**
 * @desc    Verify Code and Reset Password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Email, reset verification code, and new password are required',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const cleanEmail = email.toString().trim().toLowerCase();
    const cleanCode = resetCode.toString().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
      return;
    }

    if (user.accountStatus !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus.toLowerCase()}. Password reset cannot be completed.`,
      });
      return;
    }

    // Verify reset code
    if (!user.resetPasswordOtp || user.resetPasswordOtp !== cleanCode) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.',
      });
      return;
    }

    // Check expiration
    if (user.resetPasswordExpiresAt && new Date() > user.resetPasswordExpiresAt) {
      res.status(400).json({
        success: false,
        message: 'Password reset code has expired. Please request a new code.',
      });
      return;
    }

    // Update password (Mongoose pre-save hook will hash it)
    user.password = newPassword.trim();
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    console.log(`🔐 [PASSWORD RESET SUCCESS] Updated password for ${user.fullName} (${user.email})`);

    // Generate JWT token so user can be logged in directly
    const token = generateToken(user._id.toString(), user.role, user.userId, user.phoneNumber);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.',
    });
  }
};

