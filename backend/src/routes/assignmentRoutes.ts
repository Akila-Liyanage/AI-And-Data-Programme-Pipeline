import { Router } from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Authenticated read
router.get('/', getAssignments);

// Admin-only mutation
router.post('/', protect, authorize('ADMIN'), createAssignment);
router.put('/:id', protect, authorize('ADMIN'), updateAssignment);
router.delete('/:id', protect, authorize('ADMIN'), deleteAssignment);

export default router;
