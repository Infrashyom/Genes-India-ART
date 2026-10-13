import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus } from '../controllers/taskController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all task routes (Tasks are internal to staff and admin)
router.use(authenticateToken);
router.use(requireRole(['admin', 'staff']));

router.get('/', getTasks as any);
router.post('/', createTask as any);
router.patch('/:id/status', updateTaskStatus as any);

export default router;
