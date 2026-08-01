import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * 管理者アカウントを作成する。
 *
 * 認証情報は必ず環境変数で渡すこと。ここに既定値を書くと、公開リポジトリに
 * 管理者のメールアドレスとパスワードをそのまま公開することになる。
 *
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npx prisma db seed
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(
      `[seed] 環境変数 ${key} が未設定です。` +
        ' ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME を指定して実行してください。',
    );
    process.exit(1);
  }
  return value;
}

async function main() {
  const email = required('ADMIN_EMAIL');
  const password = required('ADMIN_PASSWORD');
  const name = required('ADMIN_NAME');

  if (password.length < 12) {
    console.error('[seed] ADMIN_PASSWORD は12文字以上にしてください。');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name },
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
