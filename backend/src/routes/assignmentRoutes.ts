import { Router } from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  selfEnrollProject,
} from '../controllers/assignmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Authenticated read
router.get('/', getAssignments);

// Authenticated self-enrollment (Intern / Staff with role matching)
router.post('/self-enroll', protect, selfEnrollProject);

// Admin-only mutation
router.post('/', protect, authorize('ADMIN'), createAssignment);
router.put('/:id', protect, authorize('ADMIN'), updateAssignment);
router.delete('/:id', protect, authorize('ADMIN'), deleteAssignment);

export default router;
