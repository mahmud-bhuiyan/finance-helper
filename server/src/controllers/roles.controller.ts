import type { Request, Response } from 'express';
import * as rolesService from '../services/roles.service.js';
import type { CreateRoleInput, UpdateRoleInput } from '../types/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await rolesService.listRoles();
  res.json(roles);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const role = await rolesService.getRole(Number(req.params.id));
  res.json(role);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateRoleInput;
  if (!input.name) throw new HttpError(400, 'Role name required');

  const role = await rolesService.createRole(input);
  res.status(201).json(role);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const role = await rolesService.updateRole(Number(req.params.id), req.body as UpdateRoleInput);
  res.json(role);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await rolesService.deleteRole(Number(req.params.id));
  res.json(result);
});
