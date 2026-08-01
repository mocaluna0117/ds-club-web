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
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  // このシードは Render のビルド中にも実行される。認証情報が渡されていないときは
  // 何もせず正常終了する。ここで失敗させるとデプロイ全体が止まり、
  // 既定値を用意すると公開リポジトリに認証情報を書くことになる
  if (!email || !password || !name) {
    console.log(
      '[seed] ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME が未設定のため、管理者の作成をスキップしました。',
    );
    return;
  }

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
