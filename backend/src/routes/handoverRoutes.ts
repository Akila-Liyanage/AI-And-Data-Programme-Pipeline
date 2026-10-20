import { Router } from 'express';
import {
  getHandoverSummary,
  reassignWork,
  offboardUser,
  reactivateUser,
} from '../controllers/handoverController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// All handover and offboarding management routes are protected and strictly accessible by Administrators
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/summary', getHandoverSummary);
router.post('/reassign', reassignWork);
router.post('/offboard', offboardUser);
router.post('/reactivate', reactivateUser);

export default router;
