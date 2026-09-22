import { prisma } from '../config/db.js';
import {
  calculateMonthlyPf,
  daysInMonth,
  getDepositDate,
  grossToBasic,
} from '../utils/pf.js';

export async function getMonthlyContributions(year: number, month: number) {
  return prisma.pfContribution.findMany({
    where: { year, month },
    include: { employee: true },
    orderBy: { employee: { fullName: 'asc' } },
  });
}

export async function generateMonthlyPf(year: number, month: number) {
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

  return {
    year,
    month,
    count: results.length,
    totals: {
      employeePf: Math.round(totals.employeePf * 100) / 100,
      employerPf: Math.round(totals.employerPf * 100) / 100,
      combined: Math.round((totals.employeePf + totals.employerPf) * 100) / 100,
    },
    contributions: results,
  };
}
