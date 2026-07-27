import { apolloClient } from './apolloClient';
import { GET_MEMBERS, GET_POSTS, GET_ACTIVITIES, GET_POST } from '../graphql/queries';
import type {
  GetMembersQuery,
  GetPostsQuery,
  GetActivitiesQuery,
  GetPostQuery,
} from '../__generated__/graphql';
import snapshot from '../data/snapshot.json';

/**
 * ビルド時に生成した公開データのスナップショット (src/data/snapshot.json) を
 * Apollo キャッシュへ注入する。各ページは fetchPolicy: 'cache-and-network' で
 * このデータを即時描画しつつ、裏で API から最新データを取得して置き換える。
 * これにより Render / Neon のコールドスタートが訪問者の体感に影響しなくなる。
 */
export function primeCache() {
  if (!snapshot.generatedAt) return;
  try {
    // 空のリストは注入しない: スナップショット生成時にデータが無かった(または取得に失敗した)場合に
    // 「メンバーがいません」等の誤った空表示を出さず、通常のスピナー+API取得にフォールバックさせる
    if (snapshot.members.length > 0) {
      apolloClient.writeQuery({
        query: GET_MEMBERS,
        data: { members: snapshot.members } as unknown as GetMembersQuery,
      });
    }
    if (snapshot.posts.length > 0) {
      apolloClient.writeQuery({
        query: GET_POSTS,
        data: { posts: snapshot.posts } as unknown as GetPostsQuery,
      });
    }
    if (snapshot.activities.length > 0) {
      apolloClient.writeQuery({
        query: GET_ACTIVITIES,
        data: { activities: snapshot.activities } as unknown as GetActivitiesQuery,
      });
    }
    for (const post of snapshot.postDetails) {
      apolloClient.writeQuery({
        query: GET_POST,
        variables: { id: post.id },
        data: { post } as unknown as GetPostQuery,
      });
    }
  } catch (e) {
    // スナップショットの形式が古い場合でも起動は妨げない(通常のAPI取得にフォールバック)
    console.warn('[snapshot] cache priming skipped:', e);
  }
}
