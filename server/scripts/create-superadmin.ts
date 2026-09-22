import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/db.js';

async function main() {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const name = process.env.SUPERADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.error('Missing SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD in server/.env');
    process.exit(1);
  }

  const existing = await prisma.user.findFirst({ where: { isSuperAdmin: true } });
  if (existing) {
    console.log(`Superadmin already exists: ${existing.email}`);
    console.log('Only one superadmin is allowed. No changes made.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      isSuperAdmin: true,
      isActive: true,
    },
  });

  console.log(`Superadmin created: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
