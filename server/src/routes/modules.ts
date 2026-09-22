import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requirePermission('roles', 'view'), async (_req, res) => {
  const modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
  res.json(modules);
});

export default router;
