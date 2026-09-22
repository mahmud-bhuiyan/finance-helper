import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { prisma } from '../db.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requirePermission('users', 'view'), async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { name: 'asc' },
  });
  res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      isSuperAdmin: u.isSuperAdmin,
      isActive: u.isActive,
      role: u.role ? { id: u.role.id, name: u.role.name } : null,
      createdAt: u.createdAt,
    }))
  );
});

router.post('/', authenticate, requirePermission('users', 'edit'), async (req: Request, res: Response) => {
  const { email, password, name, roleId, isSuperAdmin = false } = req.body as {
    email?: string;
    password?: string;
    name?: string;
    roleId?: number;
    isSuperAdmin?: boolean;
  };

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  if (isSuperAdmin) {
    const existing = await prisma.user.findFirst({ where: { isSuperAdmin: true } });
    if (existing) {
      return res.status(400).json({ error: 'A superadmin already exists. Only one is allowed.' });
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      roleId: isSuperAdmin ? null : roleId ?? null,
      isSuperAdmin: Boolean(isSuperAdmin),
    },
    include: { role: true },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    role: user.role,
  });
});

router.put('/:id', authenticate, requirePermission('users', 'edit'), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { email, name, roleId, isSuperAdmin, isActive, password } = req.body as {
    email?: string;
    name?: string;
    roleId?: number | null;
    isSuperAdmin?: boolean;
    isActive?: boolean;
    password?: string;
  };

  if (isSuperAdmin) {
    const existing = await prisma.user.findFirst({
      where: { isSuperAdmin: true, NOT: { id } },
    });
    if (existing) {
      return res.status(400).json({ error: 'A superadmin already exists. Only one is allowed.' });
    }
  }

  const data: Prisma.UserUpdateInput = {
    email,
    name,
    isActive,
    isSuperAdmin: Boolean(isSuperAdmin),
  };

  if (isSuperAdmin) {
    data.role = { disconnect: true };
  } else if (roleId !== undefined) {
    data.role = roleId ? { connect: { id: roleId } } : { disconnect: true };
  }

  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { role: true },
  });

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    isActive: user.isActive,
    role: user.role,
  });
});

export default router;
