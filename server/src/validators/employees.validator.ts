import type { EmployeeStatus, EmploymentType } from '@prisma/client';
import type { EmployeeBody } from '../types/employees.js';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export type ParsedEmployeeBody = {
  employeeCode: string;
  fullName: string;
  email: string | null;
  employmentType: EmploymentType;
  joiningDate: Date;
  probationEndDate: Date | null;
  pfStartDate: Date | null;
  grossSalary: number;
  status: EmployeeStatus;
  lastWorkingDay: Date | null;
  isDemo: boolean;
};

export function parseEmployeeBody(body: EmployeeBody): ParsedEmployeeBody {
  const pfStartDate = body.pfStartDate
    ? new Date(body.pfStartDate)
    : body.probationEndDate
      ? addDays(new Date(body.probationEndDate), 1)
      : null;

  return {
    employeeCode: body.employeeCode,
    fullName: body.fullName,
    email: body.email ?? null,
    employmentType: body.employmentType ?? 'PERMANENT',
    joiningDate: new Date(body.joiningDate),
    probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
    pfStartDate,
    grossSalary: body.grossSalary,
    status: body.status ?? 'ACTIVE',
    lastWorkingDay: body.lastWorkingDay ? new Date(body.lastWorkingDay) : null,
    isDemo: Boolean(body.isDemo),
  };
}
