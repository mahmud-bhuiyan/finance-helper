import { Router } from 'express';
import * as pfController from '../controllers/pf.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/:year/:month', authenticate, requirePermission('monthly_pf', 'view'), pfController.getMonthly);
router.post(
  '/generate/:year/:month',
  authenticate,
  requirePermission('monthly_pf', 'edit'),
  pfController.generate
);

export default router;
