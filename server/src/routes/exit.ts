import { Router } from 'express';
import * as exitController from '../controllers/exit.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.post(
  '/calculate',
  authenticate,
  requirePermission('exit_settlement', 'view'),
  exitController.calculate
);

export default router;
