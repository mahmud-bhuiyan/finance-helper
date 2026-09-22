import { Router } from 'express';
import * as modulesController from '../controllers/modules.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requirePermission('roles', 'view'), modulesController.list);

export default router;
