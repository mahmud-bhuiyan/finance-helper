import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthUser } from '../types/express.js';

const router = Router();

function formatUser(user: AuthUser) {
  const permissions = user.isSuperAdmin
    ? null
    : user.role?.permissions.map((p) => ({
        moduleKey: p.module.key,
        moduleName: p.module.name,
        route: p.module.route,
        canView: p.canView,
        canEdit: p.canEdit,
      })) ?? [];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    role: user.role ? { id: user.role.id, name: user.role.name } : null,
    permissions,
  };
}

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: { include: { module: true } },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  res.json({ token, user: formatUser(user) });
});

router.get('/me', authenticate, (req: Request, res: Response) => {
  res.json({ user: formatUser(req.user!) });
});

export default router;
