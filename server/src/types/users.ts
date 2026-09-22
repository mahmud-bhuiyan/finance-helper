export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  roleId?: number;
  isSuperAdmin?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  roleId?: number | null;
  isSuperAdmin?: boolean;
  isActive?: boolean;
  password?: string;
}
