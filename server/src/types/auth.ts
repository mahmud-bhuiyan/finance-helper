import type { Module, Role, RoleModulePermission, User } from '@prisma/client';

export type AuthUserPermission = RoleModulePermission & {
  module: Module;
};

export type AuthUser = User & {
  role: (Role & { permissions: AuthUserPermission[] }) | null;
};

export interface LoginInput {
  email: string;
  password: string;
}

export interface FormattedUser {
  id: number;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  role: { id: number; name: string } | null;
  permissions: Array<{
    moduleKey: string;
    moduleName: string;
    route: string;
    canView: boolean;
    canEdit: boolean;
  }> | null;
}
