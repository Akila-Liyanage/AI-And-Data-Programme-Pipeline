import { Response } from 'express';
import User, { UserRole, AccountStatus } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { normalizePhoneNumber } from './authController';
import { appCache } from '../utils/cache';

/**
 * Helper to generate next unique User ID based on Role
 */
export const generateNextUserId = async (role: UserRole): Promise<string> => {
  let prefix = 'INT';
  let startNum = 200;

  if (role === 'ADMIN') {
    prefix = 'ADM';
    startNum = 1;
  } else if (role === 'PERMANENT_STAFF') {
    prefix = 'STF';
    startNum = 100;
  }

  // Find all existing users with this prefix to find the highest number
  const existingUsers = await User.find({
    userId: { $regex: new RegExp(`^${prefix}-`, 'i') },
  })
    .select('userId')
    .lean();

  let maxNum = startNum;
  for (const user of existingUsers) {
    if (user.userId) {
      const parts = user.userId.split('-');
      if (parts.length >= 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  let nextNum = maxNum + 1;
  let candidateId = `${prefix}-${String(nextNum).padStart(3, '0')}`;

  // Safety check: ensure the candidate ID doesn't already exist in the database
  while (await User.exists({ userId: candidateId })) {
    nextNum++;
    candidateId = `${prefix}-${String(nextNum).padStart(3, '0')}`;
  }

  return candidateId;
};

/**
 * @desc    Get all users (Admin only) - Optimized Caching
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, status, search } = req.query;
    const cacheKey = `users_${role || 'ALL'}_${status || 'ALL'}_${search || ''}`;

    const cachedData = appCache.get<any>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    const query: Record<string, unknown> = {};

    if (role && role !== 'ALL') {
      query.role = role;
    }

    if (status && status !== 'ALL') {
      query.accountStatus = status;
    }

    if (search && typeof search === 'string') {
      const cleanSearch = search.trim();
      query.$or = [
        { fullName: { $regex: cleanSearch, $options: 'i' } },
        { email: { $regex: cleanSearch, $options: 'i' } },
        { phoneNumber: { $regex: cleanSearch, $options: 'i' } },
        { userId: { $regex: cleanSearch, $options: 'i' } },
        { designation: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    const [users, allUsersForStats] = await Promise.all([
      User.find(query)
        .select('-password -otpCode -otpExpiresAt -resetPasswordOtp -resetPasswordExpiresAt')
        .sort({ createdAt: -1 })
        .lean(),
      User.find({}, 'role').lean(),
    ]);

    // Calculate role distribution stats directly in memory
    const totalUsers = allUsersForStats.length;
    const adminCount = allUsersForStats.filter((u) => u.role === 'ADMIN').length;
    const staffCount = allUsersForStats.filter((u) => u.role === 'PERMANENT_STAFF').length;
    const internCount = allUsersForStats.filter((u) => u.role === 'INTERN').length;

    const responsePayload = {
      success: true,
      count: users.length,
      stats: {
        totalUsers,
        adminCount,
        staffCount,
        internCount,
      },
      users,
    };

    appCache.set(cacheKey, responsePayload, 20);

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
    });
  }
};

/**
 * @desc    Create a new user (Admin only)
 * @route   POST /api/users
 * @access  Private (Admin)
 */
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      password,
      role,
      designation,
      department,
      accountStatus,
    } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !role) {
      res.status(400).json({
        success: false,
        message: 'Full Name, Phone Number, Email, and Role are required',
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

    // Auto-generate User ID and Username
    const generatedUsername =
      cleanEmail.split('@')[0] ||
      fullName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);

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
          password: password && password.trim().length >= 6 ? password.trim() : 'User@123',
          role: role as UserRole,
          designation: designation ? designation.trim() : (role === 'PERMANENT_STAFF' ? 'Staff Member' : role === 'INTERN' ? 'Intern Trainee' : 'Administrator'),
          department: department ? department.trim() : 'AI & Data Team',
          accountStatus: (accountStatus as AccountStatus) || 'ACTIVE',
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

    appCache.invalidate('users');

    console.log(`👤 [USER CREATED] Added ${newUser.fullName} (${newUser.role}) - Phone: ${newUser.phoneNumber}, ID: ${newUser.userId}`);

    res.status(201).json({
      success: true,
      message: `User ${newUser.fullName} successfully registered! They can now log in using Phone: ${newUser.phoneNumber}`,
      user: {
        id: newUser._id,
        userId: newUser.userId,
        username: newUser.username,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        role: newUser.role,
        designation: newUser.designation,
        department: newUser.department,
        accountStatus: newUser.accountStatus,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'credential';
      res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists.`,
      });
      return;
    }
    const errorMsg = error instanceof Error ? error.message : 'Failed to create user';
    res.status(500).json({
      success: false,
      message: errorMsg,
    });
  }
};

/**
 * @desc    Update a user's details (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phoneNumber,
      email,
      role,
      designation,
      department,
      accountStatus,
      password,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (fullName) user.fullName = fullName.trim();
    if (phoneNumber) user.phoneNumber = phoneNumber.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role as UserRole;
    if (designation !== undefined) user.designation = designation.trim();
    if (department !== undefined) user.department = department.trim();
    if (accountStatus) user.accountStatus = accountStatus as AccountStatus;
    if (password && password.trim().length >= 6) {
      user.password = password.trim();
    }

    await user.save();
    appCache.invalidate('users');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
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
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
};

/**
 * @desc    Delete a user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting their own currently authenticated account
    if (req.user && req.user._id.toString() === id) {
      res.status(400).json({
        success: false,
        message: 'You cannot delete your own Administrator account while logged in.',
      });
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    appCache.invalidate('users');

    res.status(200).json({
      success: true,
      message: `User ${user.fullName} (${user.userId}) deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

/**
 * @desc    Toggle user status ACTIVE / INACTIVE (Admin only)
 * @route   PATCH /api/users/:id/status
 * @access  Private (Admin)
 */
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);

    if (req.user && req.user._id.toString() === id) {
      res.status(400).json({
        success: false,
        message: 'You cannot change your own account status.',
      });
      return;
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const user = await User.findOne({
      $or: [{ ...(isObjectId ? { _id: id } : { _id: null }) }, { userId: id }],
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { status } = req.body;

    if (status) {
      const validStatuses: AccountStatus[] = ['ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED'];
      if (!validStatuses.includes(status as AccountStatus)) {
        res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
        return;
      }
      user.accountStatus = status as AccountStatus;
    } else {
      user.accountStatus = user.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    await user.save();
    appCache.invalidate('users');

    res.status(200).json({
      success: true,
      message: `User account is now ${user.accountStatus}`,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
    });
  }
};
