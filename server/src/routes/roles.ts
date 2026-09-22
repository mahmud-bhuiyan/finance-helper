import { Router, type Request, type Response } from 'express';
import { prisma } from '../db.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

interface PermissionInput {
  moduleId: number;
  canView?: boolean;
  canEdit?: boolean;
}

router.get('/', authenticate, requirePermission('roles', 'view'), async (_req, res) => {
  const roles = await prisma.role.findMany({
    include: {
      permissions: { include: { module: true } },
      _count: { select: { users: true } },
    },
    orderBy: { name: 'asc' },
  });
  res.json(roles);
});

router.get('/:id', authenticate, requirePermission('roles', 'view'), async (req, res) => {
  const role = await prisma.role.findUnique({
    where: { id: Number(req.params.id) },
    include: { permissions: { include: { module: true } } },
  });
  if (!role) return res.status(404).json({ error: 'Role not found' });
  res.json(role);
});

router.post('/', authenticate, requirePermission('roles', 'edit'), async (req: Request, res: Response) => {
  const { name, description, permissions = [] } = req.body as {
    name?: string;
    description?: string;
    permissions?: PermissionInput[];
  };

  if (!name) return res.status(400).json({ error: 'Role name required' });

  const role = await prisma.role.create({
    data: {
      name,
      description,
      permissions: {
        create: permissions.map((p) => ({
          moduleId: p.moduleId,
          canView: Boolean(p.canView),
          canEdit: Boolean(p.canEdit),
        })),
      },
    },
    include: { permissions: { include: { module: true } } },
  });

  res.status(201).json(role);
});

router.put('/:id', authenticate, requirePermission('roles', 'edit'), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, permissions = [] } = req.body as {
    name?: string;
    description?: string;
    permissions?: PermissionInput[];
  };

  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Role not found' });
  if (existing.isSystem && name && name !== existing.name) {
    return res.status(400).json({ error: 'Cannot rename system role' });
  }

  await prisma.roleModulePermission.deleteMany({ where: { roleId: id } });

  const role = await prisma.role.update({
    where: { id },
    data: {
      name,
      description,
      permissions: {
        create: permissions.map((p) => ({
          moduleId: p.moduleId,
          canView: Boolean(p.canView),
          canEdit: Boolean(p.canEdit),
        })),
      },
    },
    include: { permissions: { include: { module: true } } },
  });

  res.json(role);
});

router.delete('/:id', authenticate, requirePermission('roles', 'edit'), async (req, res) => {
  const id = Number(req.params.id);
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });
  if (!role) return res.status(404).json({ error: 'Role not found' });
  if (role.isSystem) return res.status(400).json({ error: 'Cannot delete system role' });
  if (role._count.users > 0) return res.status(400).json({ error: 'Role has assigned users' });

  await prisma.role.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
