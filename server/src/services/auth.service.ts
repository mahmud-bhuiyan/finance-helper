import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { config } from '../config/index.js';
import type { AuthUser, AuthUserPermission, FormattedUser } from '../types/auth.js';
import { HttpError } from '../utils/httpError.js';

export function formatUser(user: AuthUser): FormattedUser {
  const permissions = user.isSuperAdmin
    ? null
    : user.role?.permissions.map((p: AuthUserPermission) => ({
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

export async function login(email: string, password: string) {
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
    throw new HttpError(401, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, signOptions);

  return { token, user: formatUser(user) };
}
