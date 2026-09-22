import { prisma } from '../config/db.js';

export async function listModules() {
  return prisma.module.findMany({ orderBy: { id: 'asc' } });
}
