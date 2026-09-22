import type { Request, Response } from 'express';
import * as pfService from '../services/pf.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMonthly = asyncHandler(async (req: Request, res: Response) => {
  const year = Number(req.params.year);
  const month = Number(req.params.month);
  const contributions = await pfService.getMonthlyContributions(year, month);
  res.json(contributions);
});

export const generate = asyncHandler(async (req: Request, res: Response) => {
  const year = Number(req.params.year);
  const month = Number(req.params.month);
  const result = await pfService.generateMonthlyPf(year, month);
  res.json(result);
});
