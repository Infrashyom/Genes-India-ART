import { Router } from 'express';
import { register, login, getMe, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Register a new user
router.post('/register', register as any);

// Login
router.post('/login', login as any);

// Get current user profile
router.get('/me', authenticateToken, getMe as any);

router.post('/change-password', authenticateToken, changePassword as any);

export default router;
