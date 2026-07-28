import type { WatchQueryFetchPolicy } from '@apollo/client';
import snapshot from '../data/snapshot.json';

/** スナップショットをそのまま信じてよい期間 */
const SNAPSHOT_FRESH_MS = 24 * 60 * 60 * 1000;

/**
 * 公開ページ(未ログイン)のフェッチ方針を決める。
 *
 * ビルド時スナップショットが十分に新しければ `cache-first` にして API を叩かない。
 * こうすると:
 *  - Render を起こさないので無料インスタンス時間 (月750時間) を消費しない
 *  - 表示直後に内容が差し替わるレイアウトのちらつきが起きない
 *
 * 鮮度はデプロイ側で担保している (コンテンツ更新時の repository_dispatch + 日次再ビルド)。
 * スナップショットが古い/無い場合だけ `cache-and-network` にフォールバックし、
 * キャッシュを即時描画しつつ裏で最新化する。
 *
 * 管理者(ログイン中)は常に最新を見る必要があるため、この方針は使わない。
 */
export function publicFetchPolicy(): WatchQueryFetchPolicy {
  if (!snapshot.generatedAt) return 'cache-and-network';
  const age = Date.now() - new Date(snapshot.generatedAt).getTime();
  return age >= 0 && age < SNAPSHOT_FRESH_MS ? 'cache-first' : 'cache-and-network';
}
