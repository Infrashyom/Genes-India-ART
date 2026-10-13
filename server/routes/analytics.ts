import express from 'express';
import { getAdminOverview } from '../controllers/analyticsController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/admin-overview', getAdminOverview);

export default router;
