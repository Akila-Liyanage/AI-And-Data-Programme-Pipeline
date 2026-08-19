import { Router } from 'express';
import { loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

export default router;
