import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  loginUser,
  getMe,
  registerUser,
  updateProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Phone Number + OTP Authentication routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Email-based Forgot Password / Reset Password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Fallback password login route
router.post('/login', loginUser);

// Public self-registration route
router.post('/register', registerUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

