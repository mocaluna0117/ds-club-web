import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email    = process.env.ADMIN_EMAIL    ?? 'd244022c@yokohama-cu.ac.jp';
  const password = process.env.ADMIN_PASSWORD ?? 'moca0425';
  const name     = process.env.ADMIN_NAME     ?? '木村大暉';

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name },
  });
  console.log(`Admin: ${admin.name} (${admin.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
