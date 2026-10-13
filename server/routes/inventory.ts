import { Router } from 'express';
import { getInventory, addVial, updateVialStatus } from '../controllers/inventoryController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get all inventory items
router.get('/', requireRole(['admin', 'staff']), getInventory as any);

// Add new vial to inventory
router.post('/', requireRole(['admin', 'staff']), addVial as any);

// Update vial status
router.patch('/:id/status', requireRole(['admin', 'staff']), updateVialStatus as any);

export default router;
