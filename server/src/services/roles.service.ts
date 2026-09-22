import { prisma } from '../config/db.js';
import type { CreateRoleInput, UpdateRoleInput } from '../types/roles.js';
import { HttpError } from '../utils/httpError.js';

export async function listRoles() {
  return prisma.role.findMany({
    include: {
      permissions: { include: { module: true } },
      _count: { select: { users: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getRole(id: number) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: { permissions: { include: { module: true } } },
  });
  if (!role) throw new HttpError(404, 'Role not found');
  return role;
}

export async function createRole(input: CreateRoleInput) {
  const { name, description, permissions = [] } = input;

  return prisma.role.create({
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
}

export async function updateRole(id: number, input: UpdateRoleInput) {
  const { name, description, permissions = [] } = input;

  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Role not found');
  if (existing.isSystem && name && name !== existing.name) {
    throw new HttpError(400, 'Cannot rename system role');
  }

  await prisma.roleModulePermission.deleteMany({ where: { roleId: id } });

  return prisma.role.update({
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
}

export async function deleteRole(id: number) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });
  if (!role) throw new HttpError(404, 'Role not found');
  if (role.isSystem) throw new HttpError(400, 'Cannot delete system role');
  if (role._count.users > 0) throw new HttpError(400, 'Role has assigned users');

  await prisma.role.delete({ where: { id } });
  return { success: true };
}
