import { prisma } from '../config/db.js';
import type { ExitCalculationInput } from '../types/exit.js';
import { calculateExitSettlement } from '../utils/pf.js';
import { HttpError } from '../utils/httpError.js';

export async function calculateExit(input: ExitCalculationInput) {
  const { employeeId, lastWorkingDay, totalBankProfit = 0 } = input;

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      contributions: { orderBy: [{ year: 'asc' }, { month: 'asc' }] },
    },
  });

  if (!employee) throw new HttpError(404, 'Employee not found');
  if (!employee.pfStartDate) {
    throw new HttpError(400, 'Employee has no PF start date');
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

  return {
    employee: {
      id: employee.id,
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      pfStartDate: employee.pfStartDate,
      lastWorkingDay: exitDate,
    },
    contributionMonths: contributions.length,
    settlement,
  };
}
