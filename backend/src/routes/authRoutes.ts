import { Router } from 'express';
import { sendOtp, verifyOtp, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Phone Number + OTP Authentication routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Fallback password login route
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

export default router;
