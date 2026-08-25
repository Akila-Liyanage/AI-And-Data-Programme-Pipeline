import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public / Authenticated read
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin-only mutation
router.post('/', protect, authorize('ADMIN'), createProject);
router.put('/:id', protect, authorize('ADMIN'), updateProject);
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);

export default router;
