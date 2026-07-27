/**
 * 公開データのスナップショット生成スクリプト
 *
 * ビルド時に GraphQL API から公開コンテンツ(メンバー・記事・活動記録)を取得し、
 * src/data/snapshot.json に保存する。フロントは起動時にこのスナップショットを
 * Apollo キャッシュへ注入することで、API のコールドスタートを待たずに即時描画する。
 *
 * - API が起きるまでリトライする(Render 無料プランのコールドスタート約40秒を考慮)
 * - 取得に失敗した場合は既存の snapshot.json を残す(ビルドは失敗させない)
 *
 * 使い方: VITE_API_URL=https://.../graphql node scripts/generate-snapshot.mjs
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const API_URL = process.env.VITE_API_URL ?? 'http://localhost:3001/graphql';
const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../src/data/snapshot.json');
mkdirSync(dirname(OUT_PATH), { recursive: true });
const MAX_ATTEMPTS = 8;
const RETRY_INTERVAL_MS = 20_000;

// __typename を明示的に含める: Apollo キャッシュへの writeQuery で正規化に必要
const LIST_QUERIES = `
  query Snapshot {
    members { __typename id name role grade bio imageUrl github twitter }
    posts { __typename id title excerpt coverImage createdAt author { __typename name } }
    activities { __typename id title excerpt coverImage createdAt author { __typename name } }
  }
`;

const POST_DETAIL_QUERY = `
  query SnapshotPost($id: Int!) {
    post(id: $id) {
      __typename id title content type coverImage createdAt updatedAt
      author { __typename name }
    }
  }
`;

async function gql(query, variables) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchWithRetry() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await gql(LIST_QUERIES);
    } catch (e) {
      console.warn(`[snapshot] attempt ${attempt}/${MAX_ATTEMPTS} failed: ${e.message}`);
      if (attempt === MAX_ATTEMPTS) throw e;
      await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
    }
  }
}

try {
  const lists = await fetchWithRetry();

  // 一覧に載っている記事の詳細(本文)もスナップショットに含め、記事ページも即時描画する
  const ids = [...lists.posts, ...lists.activities].map((p) => p.id);
  const postDetails = [];
  for (const id of ids) {
    try {
      const d = await gql(POST_DETAIL_QUERY, { id });
      postDetails.push(d.post);
    } catch (e) {
      console.warn(`[snapshot] post ${id} detail failed: ${e.message}`);
    }
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    members: lists.members,
    posts: lists.posts,
    activities: lists.activities,
    postDetails,
  };
  writeFileSync(OUT_PATH, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(
    `[snapshot] ok: members=${lists.members.length} posts=${lists.posts.length} activities=${lists.activities.length} details=${postDetails.length} -> ${OUT_PATH}`,
  );
} catch (e) {
  if (existsSync(OUT_PATH)) {
    console.warn(`[snapshot] fetch failed (${e.message}) — keeping existing snapshot.json`);
  } else {
    writeFileSync(
      OUT_PATH,
      JSON.stringify({ generatedAt: null, members: [], posts: [], activities: [], postDetails: [] }, null, 2) + '\n',
    );
    console.warn(`[snapshot] fetch failed (${e.message}) — wrote empty snapshot`);
  }
}
