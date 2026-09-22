import type { Employee } from '@prisma/client';
import { prisma } from '../config/db.js';
import type { EmployeeBody } from '../types/employees.js';
import { parseEmployeeBody } from '../validators/employees.validator.js';
import { grossToBasic } from '../utils/pf.js';
import { HttpError } from '../utils/httpError.js';

function mapEmployee(e: Employee) {
  const gross = Number(e.grossSalary);
  const basic = grossToBasic(gross);
  return {
    ...e,
    grossSalary: gross,
    basicSalary: basic,
  };
}

export async function listEmployees() {
  const employees = await prisma.employee.findMany({ orderBy: { fullName: 'asc' } });
  return employees.map(mapEmployee);
}

export async function getEmployee(id: number) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { contributions: { orderBy: [{ year: 'asc' }, { month: 'asc' }] } },
  });
  if (!employee) throw new HttpError(404, 'Employee not found');
  return mapEmployee(employee);
}

export async function createEmployee(body: EmployeeBody) {
  const data = parseEmployeeBody(body);
  const employee = await prisma.employee.create({ data });
  return mapEmployee(employee);
}

export async function updateEmployee(id: number, body: EmployeeBody) {
  const data = parseEmployeeBody(body);
  const employee = await prisma.employee.update({
    where: { id },
    data,
  });
  return mapEmployee(employee);
}

export async function deleteDemoEmployees() {
  await prisma.pfContribution.deleteMany({ where: { isDemo: true } });
  await prisma.employee.deleteMany({ where: { isDemo: true } });
  return { success: true, message: 'Demo employee data deleted' };
}
