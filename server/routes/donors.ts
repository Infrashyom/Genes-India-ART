import { Router } from 'express';
import { getDonors, getDonorById, createDonor, updateDonor, checkDonorCode } from '../controllers/donorController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all donor routes
router.use(authenticateToken);

// Get all donors (Staff/Admin/Hospital)
router.get('/', requireRole(['admin', 'staff', 'hospital']), getDonors as any);

// Check if donor code exists (Duplicate validation)
router.get('/check-code/:code', requireRole(['admin', 'staff']), checkDonorCode as any);

// Get a single donor
router.get('/:id', requireRole(['admin', 'staff', 'hospital']), getDonorById as any);

// Create a new donor
router.post('/', requireRole(['admin', 'staff']), createDonor as any);

// Update a donor
router.put('/:id', requireRole(['admin', 'staff']), updateDonor as any);

export default router;
