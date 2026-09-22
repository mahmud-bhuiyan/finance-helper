export interface PermissionInput {
  moduleId: number;
  canView?: boolean;
  canEdit?: boolean;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions?: PermissionInput[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: PermissionInput[];
}
