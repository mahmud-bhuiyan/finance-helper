import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requirePermission('users', 'view'), usersController.list);
router.post('/', authenticate, requirePermission('users', 'edit'), usersController.create);
router.put('/:id', authenticate, requirePermission('users', 'edit'), usersController.update);

export default router;
