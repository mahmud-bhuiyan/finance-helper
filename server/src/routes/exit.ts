import { Router, type Request, type Response } from 'express';
import { prisma } from '../db.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { calculateExitSettlement } from '../utils/pf.js';

const router = Router();

router.post('/calculate', authenticate, requirePermission('exit_settlement', 'view'), async (req: Request, res: Response) => {
  const { employeeId, lastWorkingDay, totalBankProfit = 0 } = req.body as {
    employeeId?: number;
    lastWorkingDay?: string;
    totalBankProfit?: number;
  };

  if (!employeeId || !lastWorkingDay) {
    return res.status(400).json({ error: 'employeeId and lastWorkingDay required' });
  }

  const employee = await prisma.employee.findUnique({
    where: { id: Number(employeeId) },
    include: {
      contributions: { orderBy: [{ year: 'asc' }, { month: 'asc' }] },
    },
  });

  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  if (!employee.pfStartDate) {
    return res.status(400).json({ error: 'Employee has no PF start date' });
  }

  const exitDate = new Date(lastWorkingDay);
  const contributions = employee.contributions.filter((c) => {
    const contribEnd = new Date(c.year, c.month, 0);
    return contribEnd <= exitDate;
  });

  const settlement = calculateExitSettlement({
    contributions,
    pfStartDate: employee.pfStartDate,
    lastWorkingDay: exitDate,
    totalBankProfit: Number(totalBankProfit),
  });

  res.json({
    employee: {
      id: employee.id,
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      pfStartDate: employee.pfStartDate,
      lastWorkingDay: exitDate,
    },
    contributionMonths: contributions.length,
    settlement,
  });
});

export default router;
