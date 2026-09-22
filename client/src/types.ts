export interface Permission {
  moduleKey: string;
  moduleName: string;
  route: string;
  canView: boolean;
  canEdit: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  role: { id: number; name: string } | null;
  permissions: Permission[] | null;
}

export interface Employee {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string | null;
  employmentType: string;
  grossSalary: number;
  basicSalary: number;
  pfStartDate: string | null;
  isDemo: boolean;
}

export interface PfContribution {
  id: number;
  employeeId: number;
  year: number;
  month: number;
  employeePf: number;
  employerPf: number;
  daysInMonth: number;
  daysWorked: number;
}

export interface PfGenerateResult {
  year: number;
  month: number;
  count: number;
  totals: {
    employeePf: number;
    employerPf: number;
    combined: number;
  };
  contributions: PfContribution[];
}

export interface ExitSettlementResult {
  employee: {
    id: number;
    fullName: string;
    pfStartDate: string;
    lastWorkingDay: string;
  };
  contributionMonths: number;
  settlement: {
    eligibleForFull: boolean;
    employeePf: number;
    employerPf: number;
    bankProfitShare: number;
    totalPayout: number;
    pfTenureYears: number;
  };
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Array<{
    id: number;
    canView: boolean;
    canEdit: boolean;
    module: { id: number; name: string; key: string };
  }>;
}

export interface AppModule {
  id: number;
  key: string;
  name: string;
  route: string;
}

export interface UserListItem {
  id: number;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  role: { id: number; name: string } | null;
}
