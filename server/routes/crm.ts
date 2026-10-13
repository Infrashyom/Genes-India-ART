import { Router } from 'express';
import { 
  createLead, 
  getLeads, 
  updateLeadStatus, 
  createContactQuery, 
  getContactQueries 
} from '../controllers/crmController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// ==========================================
// PUBLIC ROUTES (Used by landing page forms)
// ==========================================
router.post('/leads', createLead as any);
router.post('/contacts', createContactQuery as any);

// ==========================================
// PROTECTED ROUTES (Admin/Staff only)
// ==========================================
router.use(authenticateToken);
router.use(requireRole(['admin', 'staff']));

// Lead management
router.get('/leads', getLeads as any);
router.patch('/leads/:id/status', updateLeadStatus as any);

// Contact query management
router.get('/contacts', getContactQueries as any);

export default router;
