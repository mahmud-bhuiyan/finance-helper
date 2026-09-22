import { Router } from 'express';
import * as employeesController from '../controllers/employees.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requirePermission('employees', 'view'), employeesController.list);
router.get('/:id', authenticate, requirePermission('employees', 'view'), employeesController.getById);
router.post('/', authenticate, requirePermission('employees', 'edit'), employeesController.create);
router.put('/:id', authenticate, requirePermission('employees', 'edit'), employeesController.update);
router.delete('/demo', authenticate, requirePermission('employees', 'edit'), employeesController.deleteDemo);

export default router;
