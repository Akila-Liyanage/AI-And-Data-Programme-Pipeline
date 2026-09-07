import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateWorkItemStatus,
} from '../controllers/projectController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public / Authenticated read
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Work item status updates (Authenticated staff, intern, admin)
router.patch('/:id/work-items/:workItemId/status', protect, updateWorkItemStatus);

// Admin-only mutation
router.post('/', protect, authorize('ADMIN'), createProject);
router.put('/:id', protect, authorize('ADMIN'), updateProject);
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);

export default router;

