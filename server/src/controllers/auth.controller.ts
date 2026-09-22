import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    throw new HttpError(400, 'Email and password required');
  }

  const result = await authService.login(email, password);
  res.json(result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json({ user: authService.formatUser(req.user!) });
});
