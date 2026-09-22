import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
import {
  calculateMonthlyPf,
  daysInMonth,
  getDepositDate,
  grossToBasic,
} from '../utils/pf.js';

const router = Router();

router.get('/:year/:month', authenticate, requirePermission('monthly_pf', 'view'), async (req, res) => {
  const year = Number(req.params.year);
  const month = Number(req.params.month);

  const contributions = await prisma.pfContribution.findMany({
    where: { year, month },
    include: { employee: true },
    orderBy: { employee: { fullName: 'asc' } },
  });

  res.json(contributions);
});

router.post('/generate/:year/:month', authenticate, requirePermission('monthly_pf', 'edit'), async (req, res) => {
  const year = Number(req.params.year);
  const month = Number(req.params.month);
  const dim = daysInMonth(year, month);

  const employees = await prisma.employee.findMany({
    where: { employmentType: 'PERMANENT', status: 'ACTIVE' },
  });

  const results = [];

  for (const employee of employees) {
    if (!employee.pfStartDate) continue;

    const pfStart = new Date(employee.pfStartDate);
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    if (pfStart > monthEnd) continue;

    let daysWorked = dim;
    if (pfStart > monthStart) {
      daysWorked = dim - (pfStart.getDate() - 1);
    }

    const basic = grossToBasic(Number(employee.grossSalary));
    const { employeePf, employerPf } = calculateMonthlyPf(basic, dim, daysWorked);
    const depositDate = getDepositDate(year, month);

    const contribution = await prisma.pfContribution.upsert({
      where: {
        employeeId_year_month: {
          employeeId: employee.id,
          year,
          month,
        },
      },
      create: {
        employeeId: employee.id,
        year,
        month,
        basicSalary: basic,
        employeePf,
        employerPf,
        daysInMonth: dim,
        daysWorked,
        depositDate,
        isDemo: employee.isDemo,
      },
      update: {
        basicSalary: basic,
        employeePf,
        employerPf,
        daysInMonth: dim,
        daysWorked,
        depositDate,
      },
    });

    results.push(contribution);
  }

  const totals = results.reduce(
    (acc, c) => ({
      employeePf: acc.employeePf + Number(c.employeePf),
      employerPf: acc.employerPf + Number(c.employerPf),
    }),
    { employeePf: 0, employerPf: 0 }
  );

  res.json({
    year,
    month,
    count: results.length,
    totals: {
      employeePf: Math.round(totals.employeePf * 100) / 100,
      employerPf: Math.round(totals.employerPf * 100) / 100,
      combined: Math.round((totals.employeePf + totals.employerPf) * 100) / 100,
    },
    contributions: results,
  });
});

export default router;
