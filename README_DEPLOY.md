# デプロイ手順書

初回デプロイ時に行った作業の記録。

## 全体構成

```
[GitHub Pages]           フロントエンド (React)
      ↓ GraphQL API
[Render]                 バックエンド (NestJS)
      ↓ DATABASE_URL
[Neon]                   データベース (PostgreSQL)
```

## デプロイの順番

DBが先にないとバックエンドが起動できず、バックエンドのURLが確定しないとフロントエンドの環境変数に何を設定すればいいか分からないため、以下の順番で行う。

```
1. Neon (DB)
   ↓ 接続文字列を取得
2. Render (Backend)
   ↓ APIのURLが確定
3. GitHub Pages (Frontend)
```

---

## 1. Neon (DB)

### アカウント作成・DB作成

1. [neon.tech](https://neon.tech) にアクセス → GitHub でログイン
2. **New Project** をクリック
3. 以下を設定して **Create**

   | 項目 | 値 |
   |---|---|
   | Project name | `ds-club` |
   | Region | Singapore (東京がないので最寄り) |
   | Auth | **OFF** (NestJS側でJWT認証を自前実装しているため不要) |

4. 作成後に表示される接続文字列をコピー

   ```
   postgresql://username:password@xxxx.neon.tech/ds_club?sslmode=require
   ```

   → これを Render の `DATABASE_URL` に使う

---

## 2. Render (Backend)

### アカウント作成・サービス作成

1. [render.com](https://render.com) にログイン
2. **New +** → **Web Service**
3. **Connect a repository** → GitHub を連携 → `ds-club-web` リポジトリを選択
4. 以下を設定

   | 項目 | 値 |
   |---|---|
   | Name | `ds-club-api` |
   | Region | Singapore (Neon と合わせる) |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Runtime | `Node` |
   | Build / Start Command | `render.yaml` から自動読み込み |
   | Plan | Free |

### 環境変数の設定

**Create Web Service を押す前に** Environment Variables に以下を追加する。

| Key | Value |
|---|---|
| `DATABASE_URL` | Neon の接続文字列 |
| `JWT_SECRET` | ランダムな文字列 (下記コマンドで生成) |
| `FRONTEND_URL` | 最初は `http://localhost:5173`、GitHub Pages のURL確定後に更新 |

`JWT_SECRET` の生成:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`JWT_EXPIRES_IN`・`PORT` は [render.yaml](backend/render.yaml) に記載済みのため設定不要。

5. **Create Web Service** をクリック → ビルドログを確認
6. デプロイ完了後、サービスのURL (`https://ds-club-api.onrender.com`) を控えておく

> **注意:** 無料プランは15分間アクセスがないとスリープする。最初のリクエストだけ数十秒かかる。

---

## 3. GitHub Pages (Frontend)

### リポジトリ作成・push

```bash
cd /Users/daiki.kimura/ds_club_web
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/your-name/ds-club-web.git
git push -u origin main
```

### `vite.config.ts` のベースパス確認

リポジトリ名 `ds-club-web` と一致していることを確認する。

```ts
// frontend/vite.config.ts
base: '/ds-club-web/',
```

### GitHub Pages の設定

1. リポジトリページ → **Settings** → **Pages**
2. **Source** を **GitHub Actions** に変更

### シークレットの設定

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://ds-club-api.onrender.com/graphql` |

### デプロイ

```bash
git add .
git commit -m "deploy frontend"
git push origin main
```

Actions タブでビルドの進行状況を確認。完了後、以下のURLでサイトが閲覧できる。

```
https://your-name.github.io/ds-club-web/
```

---

## 4. デプロイ後の追加作業

### Render の `FRONTEND_URL` を更新

GitHub Pages のURLが確定したら、Render の環境変数を更新する。

1. Render ダッシュボード → `ds-club-api` → **Environment**
2. `FRONTEND_URL` を GitHub Pages のURLに変更

   ```
   https://your-name.github.io
   ```

3. 保存すると自動で再デプロイされる

---

## 日常の開発フロー

### ローカル開発

```bash
# DB起動
docker compose up -d

# バックエンド
cd backend && npm run start:dev   # http://localhost:3001/graphql

# フロントエンド
cd frontend && npm run dev        # http://localhost:5173/ds-club-web/
```

### 本番への反映

```bash
git add .
git commit -m "..."
git push origin main
# → GitHub Pages (frontend/) と Render (backend/) が自動でデプロイ
```

### DBスキーマを変えたとき

```bash
cd backend
# prisma/schema.prisma を編集してから実行
npx prisma migrate dev --name 変更内容の名前
# → prisma/migrations/ にファイルが生成される
# → git push すると本番DBにも自動適用される
```
