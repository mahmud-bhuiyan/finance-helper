import type { Request, Response } from 'express';
import * as usersService from '../services/users.service.js';
import type { CreateUserInput, UpdateUserInput } from '../types/users.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const users = await usersService.listUsers();
  res.json(users);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, roleId, isSuperAdmin } = req.body as CreateUserInput;

  if (!email || !password || !name) {
    throw new HttpError(400, 'Email, password, and name required');
  }

  const user = await usersService.createUser({ email, password, name, roleId, isSuperAdmin });
  res.status(201).json(user);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await usersService.updateUser(id, req.body as UpdateUserInput);
  res.json(user);
});
