# DS Club Web

DS倶楽部の公式Webサイト。メンバー紹介・活動ブログ・お問い合わせ機能を備えたフルスタックWebアプリ。

## 構成

```
ds_club_web/
├── frontend/          # React + TypeScript + Apollo Client
├── backend/           # NestJS + GraphQL + Prisma
└── docker-compose.yml # ローカル開発用 PostgreSQL
```

## 技術スタック

| レイヤー | 技術 |
|---|---|
| Frontend | React 19, TypeScript, Vite, Apollo Client |
| Backend API | NestJS 11, GraphQL (code-first), Apollo Server v5 |
| ORM | Prisma |
| DB (ローカル) | PostgreSQL (Docker) |
| DB (本番) | Vercel Postgres |
| 認証 | JWT + Passport |
| デプロイ (Frontend) | GitHub Pages |
| デプロイ (Backend) | Render |

## 機能

- **メンバー紹介** — 部員のプロフィール一覧 (学年・役職・GitHub/Twitter リンク)
- **ブログ/活動記録** — 記事の投稿・閲覧
- **お問い合わせ** — 外部からのフォーム送信 (DBに保存)
- **管理者ログイン** — JWT認証によるコンテンツ管理 (メンバー・記事・問い合わせの管理)

## ローカル開発のセットアップ

### 前提条件

- Node.js 20+
- Docker Desktop

### 1. DBを起動

```bash
docker compose up -d
```

### 2. バックエンドを起動

```bash
cd backend
# .env が存在しない場合は作成 (DATABASE_URL 等を設定)
npx prisma migrate dev   # DBマイグレーションを実行 (ローカルのみ)
npm run start:dev        # http://localhost:3001/graphql
```

### 3. 管理者アカウントを作成

初回のみ、Prisma Studio で `Admin` テーブルにレコードを作成します。
パスワードは bcryptjs でハッシュ化する必要があるため、以下のスクリプトを使用してください。

```bash
# backend ディレクトリで実行
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('your-password', 12).then(h => console.log(h));
"
# 出力されたハッシュを Prisma Studio の passwordHash フィールドに貼り付ける
npx prisma studio
```

### 4. フロントエンドを起動

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173/ds-club-web/
```

## 環境変数

### backend/.env

| 変数名 | 説明 | 例 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL 接続文字列 | `postgresql://postgres:postgres@localhost:5432/ds_club` |
| `JWT_SECRET` | JWT署名シークレット (長いランダム文字列) | `super-secret-key` |
| `JWT_EXPIRES_IN` | トークン有効期限 | `7d` |
| `PORT` | バックエンドのポート番号 | `3001` |
| `FRONTEND_URL` | CORS許可オリジン | `http://localhost:5173` |

### frontend/.env (任意)

| 変数名 | 説明 | デフォルト |
|---|---|---|
| `VITE_API_URL` | GraphQL エンドポイント | `http://localhost:3001/graphql` |

## GraphQL API

`http://localhost:3001/graphql` で Apollo Sandbox が使用可能。

### 主なクエリ

```graphql
# メンバー一覧
query { members { id name role grade bio github twitter } }

# 公開記事一覧
query { posts { id title excerpt createdAt author { name } } }
```

### 主なミューテーション (要認証)

```graphql
# ログイン
mutation { login(input: { email: "...", password: "..." }) { accessToken adminName } }

# メンバー追加 (Authorization: Bearer <token> ヘッダーが必要)
mutation { createMember(input: { name: "..." role: "..." grade: 3 }) { id } }
```

## デプロイ

### 環境ごとのDB構成

**Dockerはローカル開発専用です。** 本番環境では Vercel Postgres を使います。

```
ローカル開発                        本番
────────────────────────           ──────────────────────────────
docker compose up -d               Vercel Postgres (常時起動・管理不要)
        │                                    │
DATABASE_URL=localhost:5432        DATABASE_URL=vercel接続文字列
        │                                    │
NestJS (npm run start:dev)         NestJS on Render
        │                                    │
   React (npm run dev)             React on GitHub Pages
```

### Prisma マイグレーションの使い分け

| コマンド | 使う場面 | 動作 |
|---|---|---|
| `npx prisma migrate dev` | ローカル開発のみ | マイグレーションファイルを**作成**してから適用。対話あり |
| `npx prisma migrate deploy` | 本番デプロイ時 | 既存のマイグレーションファイルを**適用するだけ**。非対話 |

ローカルで `migrate dev` して作った `prisma/migrations/` を Git にコミットしておけば、Render が `migrate deploy` で本番DBに自動適用します。

### 1. DB → Vercel Postgres

1. [vercel.com](https://vercel.com) にログイン → Storage → **Create Database → Postgres**
2. 発行される接続文字列 (`postgres://...`) をコピーしておく

### 2. Backend → Render

1. [render.com](https://render.com) でアカウントを作成
2. **New Web Service** でこのリポジトリを接続
   - Root Directory: `backend`
   - [render.yaml](backend/render.yaml) が自動で検出される
3. 以下の環境変数を設定

   | 変数名 | 値 |
   |---|---|
   | `DATABASE_URL` | Vercel Postgres の接続文字列 |
   | `JWT_SECRET` | 長いランダム文字列 (例: `openssl rand -hex 32` の出力) |
   | `FRONTEND_URL` | GitHub Pages の URL (例: `https://your-name.github.io`) |

4. `main` ブランチへのプッシュで自動デプロイ
   - ビルド時に `prisma migrate deploy` → `nest build` の順で実行される

### 3. Frontend → GitHub Pages

1. GitHubリポジトリを作成してプッシュ
2. リポジトリの **Settings > Pages** で Source を **GitHub Actions** に設定
3. [vite.config.ts](frontend/vite.config.ts) の `base` をリポジトリ名に合わせて変更

   ```ts
   // vite.config.ts
   base: '/your-repo-name/',
   ```

4. GitHub リポジトリの **Settings > Secrets > Actions** に以下を追加

   | シークレット名 | 値 |
   |---|---|
   | `VITE_API_URL` | Render にデプロイされた API の URL (例: `https://ds-club-api.onrender.com/graphql`) |

5. `main` ブランチへのプッシュで自動デプロイ ([.github/workflows/deploy.yml](.github/workflows/deploy.yml) 参照)

## ディレクトリ構造

```
backend/
├── prisma/
│   └── schema.prisma        # Member / Post / Contact / Admin モデル
├── src/
│   ├── members/             # メンバー Query / Mutation
│   ├── posts/               # ブログ記事 Query / Mutation
│   ├── auth/                # JWT認証・ログイン
│   ├── contact/             # お問い合わせ
│   └── prisma/              # PrismaService (Global Module)
└── render.yaml              # Render デプロイ設定

frontend/
└── src/
    ├── components/          # Navbar, Footer
    ├── context/             # AuthContext (JWT管理)
    ├── graphql/queries.ts   # Apollo クエリ・ミューテーション定義
    ├── lib/apolloClient.ts  # Apollo Client 設定
    └── pages/
        ├── HomePage.tsx
        ├── MembersPage.tsx
        ├── BlogPage.tsx
        ├── BlogPostPage.tsx
        ├── ContactPage.tsx
        ├── LoginPage.tsx    # 管理者ログイン
        └── AdminPage.tsx    # 管理者ダッシュボード
```
