import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import type { CreateUserInput, UpdateUserInput } from '../types/users.js';
import { HttpError } from '../utils/httpError.js';

export async function listUsers() {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { name: 'asc' },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    isSuperAdmin: u.isSuperAdmin,
    isActive: u.isActive,
    role: u.role ? { id: u.role.id, name: u.role.name } : null,
    createdAt: u.createdAt,
  }));
}

export async function createUser(input: CreateUserInput) {
  const { email, password, name, roleId, isSuperAdmin = false } = input;

  if (isSuperAdmin) {
    const existing = await prisma.user.findFirst({ where: { isSuperAdmin: true } });
    if (existing) {
      throw new HttpError(400, 'A superadmin already exists. Only one is allowed.');
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

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    role: user.role,
  };
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const { email, name, roleId, isSuperAdmin, isActive, password } = input;

  if (isSuperAdmin) {
    const existing = await prisma.user.findFirst({
      where: { isSuperAdmin: true, NOT: { id } },
    });
    if (existing) {
      throw new HttpError(400, 'A superadmin already exists. Only one is allowed.');
    }
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

  const user = await prisma.user.update({
    where: { id },
    data: {
      email,
      name,
      isActive,
      isSuperAdmin: Boolean(isSuperAdmin),
      ...(passwordHash ? { passwordHash } : {}),
      ...(isSuperAdmin
        ? { role: { disconnect: true as const } }
        : roleId !== undefined
          ? { role: roleId ? { connect: { id: roleId } } : { disconnect: true as const } }
          : {}),
    },
    include: { role: true },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    isActive: user.isActive,
    role: user.role,
  };
}
