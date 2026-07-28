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
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
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

/**
 * 「前回は件数があったリストが今回0件になった」= 回帰を検出する。
 *
 * フロントはスナップショットの空配列をそのまま信じて即時描画するため、DB障害などで
 * API が 200 を返しつつ0件になったのを取り込むと「空のサイト」が公開されてしまう。
 * 一方で「本当に全部削除した」ケースを永久にブロックしないよう、ALLOW_EMPTY=1 で通せる。
 */
function findEmptiedLists(lists) {
  if (!existsSync(OUT_PATH)) return [];
  let prev;
  try {
    prev = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
  } catch {
    return [];
  }
  return ['members', 'posts', 'activities'].filter(
    (key) => (prev[key]?.length ?? 0) > 0 && lists[key].length === 0,
  );
}

try {
  const lists = await fetchWithRetry();

  const emptied = findEmptiedLists(lists);
  if (emptied.length > 0 && process.env.ALLOW_EMPTY !== '1') {
    console.error(
      `[snapshot] regression detected: ${emptied.join(', ')} went from non-empty to 0 items. ` +
        'Keeping the existing snapshot so an empty site is not published. ' +
        'If the content really was deleted, re-run with ALLOW_EMPTY=1.',
    );
    process.exit(1);
  }

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
  // 失敗しても既存スナップショットでビルドは続行させる (deploy.yml 側で continue-on-error)。
  // ただし非ゼロで終了して run を赤くする: Render 無料プランでは Webhook もログ保持も無いため、
  // GitHub Actions の失敗通知が唯一の無料の異常検知手段になる。
  if (existsSync(OUT_PATH)) {
    console.error(`[snapshot] fetch failed (${e.message}) — keeping existing snapshot.json`);
  } else {
    writeFileSync(
      OUT_PATH,
      JSON.stringify({ generatedAt: null, members: [], posts: [], activities: [], postDetails: [] }, null, 2) + '\n',
    );
    console.error(`[snapshot] fetch failed (${e.message}) — wrote empty snapshot`);
  }
  process.exit(1);
}
