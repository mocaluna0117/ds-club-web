import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MEMBERS = [
  { name: '木村大暉', role: '運営', grade: 3, bio: '運営です。', imageUrl: null, github: null, twitter: null },
  { name: '山田理功', role: '運営', grade: 3, bio: '運営です。', imageUrl: null, github: null, twitter: null },
  { name: '大澤直明', role: '運営', grade: 3, bio: '浜大際実行委員です。', imageUrl: null, github: null, twitter: null },
];

async function main() {
  // Admin
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

  // Members（同名が存在しない場合のみ作成）
  for (const data of MEMBERS) {
    const existing = await prisma.member.findFirst({ where: { name: data.name } });
    if (existing) {
      console.log(`Member skipped (already exists): ${data.name}`);
      continue;
    }
    const member = await prisma.member.create({ data });
    console.log(`Member created: ${member.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
