# GraphQL の仕組みとコード構成

このプロジェクトにおける GraphQL の全体像、型生成（codegen）の仕組みをまとめたドキュメント。

---

## 全体の流れ

```
[NestJS Backend]
  @ObjectType() / @Field() デコレータ
        ↓ 自動生成
  backend/src/schema.gql   ← GraphQL スキーマ（型・クエリ・ミューテーションの定義）
        ↓ codegen が読み込む
[GraphQL Code Generator]
        ↓ 自動生成
  frontend/src/__generated__/   ← TypeScript 型ファイル群
        ↑
  frontend/src/graphql/queries.ts に書いたクエリも読み込む

[React Frontend]
  queries.ts のクエリを useQuery / useMutation で実行
  → 返り値の型は __generated__/ から自動付与される
```

---

## バックエンド：スキーマの自動生成

NestJS は `@ObjectType()` `@Field()` などのデコレータを読んで、`schema.gql` を自動生成する（code-first アプローチ）。

```typescript
// backend/src/members/member.model.ts
@ObjectType()
export class Member {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
  // ...
}
```

↓ 自動生成される `schema.gql`:

```graphql
type Member {
  id: Int!
  name: String!
  # ...
}
```

**`schema.gql` は手動で編集しない。** モデルのデコレータを変えると自動で更新される。

---

## フロントエンド：クエリの書き方

`frontend/src/graphql/queries.ts` にクエリを定義する。  
`gql` ではなく `__generated__/gql` から `graphql` 関数をインポートする。

```typescript
import { graphql } from '../__generated__/gql';

export const GET_MEMBERS = graphql(`
  query GetMembers {
    members {
      id
      name
      role
    }
  }
`);
```

**なぜ `graphql()` を使うのか？**  
codegen がこの関数でラップされたクエリを認識し、そのクエリ専用の型を生成するため。  
`gql` タグのままだと型が `unknown` になってしまう。

---

## フロントエンド：クエリの実行

```typescript
import { useQuery } from '@apollo/client';
import { GET_MEMBERS } from '../graphql/queries';

const { data, loading, error } = useQuery(GET_MEMBERS);
// data.members の型は自動で Member[] | null | undefined になる
// 手動で interface を書く必要はない
```

クエリ名（`members`）と resolver の `name: 'members'` が文字列として一致することで、バックエンドの正しいメソッドが呼ばれる。

---

## 型の対応づけ

| 要素 | どこで定義 | 役割 |
|---|---|---|
| `name: 'members'` | resolver の `@Query` デコレータ | GraphQL 上のクエリ名 |
| `members { ... }` | queries.ts の `graphql()` | フロントが呼ぶクエリ名（一致が必要） |
| 返り値の型 | `__generated__/graphql.ts` | codegen が自動生成 |

---

## GraphQL Code Generator (codegen)

### 設定ファイル

`frontend/codegen.ts`:

```typescript
const config: CodegenConfig = {
  schema: '../backend/src/schema.gql',   // バックエンドのスキーマを参照
  documents: 'src/**/*.{ts,tsx}',        // クエリが書かれたファイルをスキャン
  generates: {
    './src/__generated__/': {
      preset: 'client',
      config: {
        scalars: { DateTime: 'string' },  // カスタムスカラーの型マッピング
        useTypeImports: true,             // verbatimModuleSyntax 対応
      },
    },
  },
};
```

### 生成コマンド

```bash
cd frontend

# 一度だけ実行（スキーマやクエリを変えたあと）
npm run codegen

# ファイル変更を監視して自動で再生成
npm run codegen:watch
```

### いつ実行するか

以下のいずれかを変えたら `npm run codegen` を実行する:

- `backend/src/**/*.model.ts` などのモデル（スキーマが変わる）
- `frontend/src/graphql/queries.ts` のクエリ・ミューテーション

### 生成されるファイル

```
frontend/src/__generated__/
├── graphql.ts        ← 全型定義（Member, Post, Query, Mutation など）
├── gql.ts            ← graphql() 関数の実装
├── fragment-masking.ts
└── index.ts
```

これらは **手動で編集しない**。`npm run codegen` を実行するたびに上書きされる。

---

## カスタムスカラーについて

GraphQL の `DateTime` スカラーは標準の型ではなく、NestJS 側で定義されたカスタム型。  
JSON で転送されるときは ISO 8601 形式の文字列（例: `"2025-05-16T09:00:00.000Z"`）になるため、`string` にマッピングしている。

```typescript
// codegen.ts
scalars: {
  DateTime: 'string',
}
```

フロント側では `new Date(post.createdAt)` のように文字列から Date に変換して使う。

---

## よくある作業

### バックエンドにフィールドを追加したとき

```bash
# 1. モデルに @Field() を追加
# 2. Prisma スキーマを更新してマイグレーション
cd backend && npx prisma migrate dev --name add_field

# 3. 型を再生成
cd frontend && npm run codegen

# 4. クエリに新フィールドを追加（queries.ts）
# → useQuery の返り値に型が自動で反映される
```

### 新しいクエリ・ミューテーションを追加したとき

```bash
# 1. queries.ts に graphql(`...`) でクエリを書く
# 2. codegen を実行
cd frontend && npm run codegen
# 3. useQuery / useMutation で使う（型は自動付与）
```
