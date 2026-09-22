import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../config/db.js';

interface JwtPayload {
  userId: number;
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        role: {
          include: {
            permissions: { include: { module: true } },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid or inactive user' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requirePermission(moduleKey: string, action: 'view' | 'edit' = 'view') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (req.user.isSuperAdmin) {
      next();
      return;
    }

    const permission = req.user.role?.permissions.find((p) => p.module.key === moduleKey);
    if (!permission) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const allowed = action === 'edit' ? permission.canEdit : permission.canView;
    if (!allowed) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
