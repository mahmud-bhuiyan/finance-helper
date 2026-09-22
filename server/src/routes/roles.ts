import { Router } from 'express';
import * as rolesController from '../controllers/roles.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requirePermission('roles', 'view'), rolesController.list);
router.get('/:id', authenticate, requirePermission('roles', 'view'), rolesController.getById);
router.post('/', authenticate, requirePermission('roles', 'edit'), rolesController.create);
router.put('/:id', authenticate, requirePermission('roles', 'edit'), rolesController.update);
router.delete('/:id', authenticate, requirePermission('roles', 'edit'), rolesController.remove);

export default router;
