import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../db.js';

interface JwtPayload {
  userId: number;
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
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
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requirePermission(moduleKey: string, action: 'view' | 'edit' = 'view') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.isSuperAdmin) return next();

    const permission = req.user.role?.permissions.find((p) => p.module.key === moduleKey);
    if (!permission) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allowed = action === 'edit' ? permission.canEdit : permission.canView;
    if (!allowed) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
