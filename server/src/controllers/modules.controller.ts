import type { Request, Response } from 'express';
import * as modulesService from '../services/modules.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const modules = await modulesService.listModules();
  res.json(modules);
});
