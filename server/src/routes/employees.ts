import { Router, type Request, type Response } from 'express';
import type { Employee, EmploymentType, EmployeeStatus, Prisma } from '@prisma/client';
import { prisma } from '../db.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { grossToBasic } from '../utils/pf.js';

const router = Router();

function mapEmployee(e: Employee) {
  const gross = Number(e.grossSalary);
  const basic = grossToBasic(gross);
  return {
    ...e,
    grossSalary: gross,
    basicSalary: basic,
  };
}

router.get('/', authenticate, requirePermission('employees', 'view'), async (_req, res) => {
  const employees = await prisma.employee.findMany({ orderBy: { fullName: 'asc' } });
  res.json(employees.map(mapEmployee));
});

router.get('/:id', authenticate, requirePermission('employees', 'view'), async (req, res) => {
  const employee = await prisma.employee.findUnique({
    where: { id: Number(req.params.id) },
    include: { contributions: { orderBy: [{ year: 'asc' }, { month: 'asc' }] } },
  });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  res.json(mapEmployee(employee));
});

router.post('/', authenticate, requirePermission('employees', 'edit'), async (req: Request, res: Response) => {
  const data = parseEmployeeBody(req.body);
  const employee = await prisma.employee.create({ data });
  res.status(201).json(mapEmployee(employee));
});

router.put('/:id', authenticate, requirePermission('employees', 'edit'), async (req: Request, res: Response) => {
  const data = parseEmployeeBody(req.body);
  const employee = await prisma.employee.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(mapEmployee(employee));
});

router.delete('/demo', authenticate, requirePermission('employees', 'edit'), async (_req, res) => {
  await prisma.pfContribution.deleteMany({ where: { isDemo: true } });
  await prisma.employee.deleteMany({ where: { isDemo: true } });
  res.json({ success: true, message: 'Demo employee data deleted' });
});

interface EmployeeBody {
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

function parseEmployeeBody(body: EmployeeBody): Prisma.EmployeeCreateInput {
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

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default router;
