import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { prisma } from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MODULES = [
  { key: 'dashboard', name: 'Dashboard', route: '/', description: 'Overview and quick stats' },
  { key: 'employees', name: 'Employees', route: '/employees', description: 'Employee master data' },
  { key: 'monthly_pf', name: 'Monthly PF', route: '/monthly-pf', description: 'Monthly PF ledger' },
  { key: 'exit_settlement', name: 'Exit Settlement', route: '/exit-settlement', description: 'PF exit calculator' },
  { key: 'users', name: 'Users', route: '/admin/users', description: 'User management' },
  { key: 'roles', name: 'Roles', route: '/admin/roles', description: 'Role and permission management' },
];

interface PermDef {
  key: string;
  view: boolean;
  edit: boolean;
}

async function main() {
  console.log('Seeding Finance Helper...');

  for (const mod of MODULES) {
    await prisma.module.upsert({
      where: { key: mod.key },
      update: mod,
      create: mod,
    });
  }

  const modules = await prisma.module.findMany();
  const moduleId = (key: string) => {
    const mod = modules.find((m) => m.key === key);
    if (!mod) throw new Error(`Module not found: ${key}`);
    return mod.id;
  };

  const accountantPerms: PermDef[] = [
    { key: 'dashboard', view: true, edit: false },
    { key: 'employees', view: true, edit: true },
    { key: 'monthly_pf', view: true, edit: true },
    { key: 'exit_settlement', view: true, edit: true },
    { key: 'users', view: false, edit: false },
    { key: 'roles', view: false, edit: false },
  ];

  const hrPerms: PermDef[] = [
    { key: 'dashboard', view: true, edit: false },
    { key: 'employees', view: true, edit: true },
    { key: 'monthly_pf', view: true, edit: false },
    { key: 'exit_settlement', view: true, edit: false },
    { key: 'users', view: false, edit: false },
    { key: 'roles', view: false, edit: false },
  ];

  async function upsertRole(name: string, description: string, perms: PermDef[]) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description },
      create: { name, description, isSystem: true },
    });

    await prisma.roleModulePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.roleModulePermission.createMany({
      data: perms.map((p) => ({
        roleId: role.id,
        moduleId: moduleId(p.key),
        canView: p.view,
        canEdit: p.edit,
      })),
    });

    return role;
  }

  await upsertRole('Accountant', 'Full payroll and PF access', accountantPerms);
  await upsertRole('HR', 'Employee data management', hrPerms);

  await seedDemoEmployees();
  console.log('Seed complete.');
}

interface RawEmployee {
  employee_id: string;
  full_name: string;
  email: string;
  employment_type: string;
  employment_status: string;
  joining_date: string;
  salary: { monthly: number };
}

async function seedDemoEmployees() {
  const dataPath = path.resolve(__dirname, '../../data/employees.json');
  if (!fs.existsSync(dataPath)) {
    console.log('No employees.json found — skipping demo employees.');
    return;
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as { employees?: RawEmployee[] };
  const employees = raw.employees ?? [];

  let seeded = 0;
  for (const e of employees) {
    if (e.employment_type !== 'Full-Time' && e.employment_type !== 'Permanent') continue;
    if (e.employment_status !== 'Active') continue;

    const joiningDate = new Date(e.joining_date);
    const probationEnd = new Date(joiningDate);
    probationEnd.setMonth(probationEnd.getMonth() + 3);
    const pfStart = new Date(probationEnd);
    pfStart.setDate(pfStart.getDate() + 1);

    await prisma.employee.upsert({
      where: { employeeCode: e.employee_id },
      update: {
        fullName: e.full_name,
        email: e.email,
        employmentType: 'PERMANENT',
        joiningDate,
        probationEndDate: probationEnd,
        pfStartDate: pfStart,
        grossSalary: e.salary.monthly,
        status: 'ACTIVE',
        isDemo: true,
      },
      create: {
        employeeCode: e.employee_id,
        fullName: e.full_name,
        email: e.email,
        employmentType: 'PERMANENT',
        joiningDate,
        probationEndDate: probationEnd,
        pfStartDate: pfStart,
        grossSalary: e.salary.monthly,
        status: 'ACTIVE',
        isDemo: true,
      },
    });
    seeded += 1;
  }

  console.log(`Seeded ${seeded} demo employees (is_demo=true).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
