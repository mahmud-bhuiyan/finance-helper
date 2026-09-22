import type { Request, Response } from 'express';
import * as exitService from '../services/exit.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const calculate = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, lastWorkingDay, totalBankProfit } = req.body as {
    employeeId?: number;
    lastWorkingDay?: string;
    totalBankProfit?: number;
  };

  if (!employeeId || !lastWorkingDay) {
    throw new HttpError(400, 'employeeId and lastWorkingDay required');
  }

  const result = await exitService.calculateExit({
    employeeId: Number(employeeId),
    lastWorkingDay,
    totalBankProfit,
  });
  res.json(result);
});
