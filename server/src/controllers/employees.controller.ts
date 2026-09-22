import type { Request, Response } from 'express';
import * as employeesService from '../services/employees.service.js';
import type { EmployeeBody } from '../types/employees.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await employeesService.listEmployees();
  res.json(employees);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeesService.getEmployee(Number(req.params.id));
  res.json(employee);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeesService.createEmployee(req.body as EmployeeBody);
  res.status(201).json(employee);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeesService.updateEmployee(Number(req.params.id), req.body as EmployeeBody);
  res.json(employee);
});

export const deleteDemo = asyncHandler(async (_req: Request, res: Response) => {
  const result = await employeesService.deleteDemoEmployees();
  res.json(result);
});
