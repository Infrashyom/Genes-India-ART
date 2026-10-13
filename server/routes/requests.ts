import { Router } from 'express';
import { 
  getRequests, 
  getRequestById, 
  createRequest, 
  updateRequestStatus, 
  addRequestDocument, 
  reportClinicalOutcome 
} from '../controllers/requestController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all routes
router.use(authenticateToken);

// Get all requests (Hospitals see their own, Admin/Staff see all)
router.get('/', getRequests as any);

// Get single request
router.get('/:id', getRequestById as any);

// Hospitals can create requests
router.post('/', requireRole(['hospital']), createRequest as any);

// Hospitals and Admins can attach/update documents
router.patch('/:id/documents', requireRole(['hospital', 'admin']), addRequestDocument as any);

// Hospitals and Admins can report clinical outcomes
router.patch('/:id/outcome', requireRole(['hospital', 'admin']), reportClinicalOutcome as any);

// Admin can update status/remarks (Staff has read-only view)
router.patch('/:id/status', requireRole(['admin']), updateRequestStatus as any);

export default router;
