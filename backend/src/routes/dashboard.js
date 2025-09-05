
import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { myStats, adminStats } from '../controllers/dashboardController.js';
const router = Router();
router.get('/me', auth, myStats);
router.get('/admin', auth, requireRole('admin'), adminStats);
export default router;
