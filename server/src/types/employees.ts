import type { EmploymentType, EmployeeStatus } from '@prisma/client';

export interface EmployeeBody {
  employeeCode: string;
  fullName: string;
  email?: string;
  employmentType?: EmploymentType;
  joiningDate: string;
  probationEndDate?: string;
  pfStartDate?: string;
  grossSalary: number;
  status?: EmployeeStatus;
  lastWorkingDay?: string;
  isDemo?: boolean;
}
