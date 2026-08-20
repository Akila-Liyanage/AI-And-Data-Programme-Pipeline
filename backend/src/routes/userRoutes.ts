import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// All user management routes are protected and strictly accessible by Administrators
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

router.patch('/:id/status', toggleUserStatus);

export default router;
