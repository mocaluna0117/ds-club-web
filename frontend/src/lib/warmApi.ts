import { useEffect } from 'react';

/**
 * API (Render 無料プラン) のコールドスタート対策 — 必要な場面だけ起こす。
 *
 * Render 無料プランには同時に満たせない2つの制約がある:
 *  - 15分アクセスがないとスピンダウンし、復帰に約1分かかる (実測33〜43秒)
 *  - 無料枠は workspace あたり月750インスタンス時間で、起動中のみ消費される。
 *    使い切ると翌月まで全ての無料 Web サービスが suspend される
 * 24時間×31日 = 744時間なので「常時起こし続ける」方式は枠をほぼ使い切ってしまう。
 *
 * 一方で公開ページはビルド時スナップショットで即時描画されるため、閲覧者にとって
 * API の起動状態は体感に影響しない。つまり閲覧のために起こす必要はまったく無く、
 * 全訪問者で起こすと「体感改善ゼロ・枠消費だけ増加」になる(クローラでも発火する)。
 *
 * そこで **コールドスタートが実際に痛い管理系の画面に入ったときだけ** 起こす。
 * 管理者がログインフォームを埋める十数秒の間に起動が進むため、待ち時間の大半を回収できる。
 */
const API_ORIGIN = (() => {
  try {
    return new URL(import.meta.env.VITE_API_URL ?? 'http://localhost:3001/graphql').origin;
  } catch {
    return null;
  }
})();

/** スピンダウンの閾値(15分)より短い間隔 */
const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000;
/** 直近この時間内に操作がある間だけハートビートを続ける */
const IDLE_CUTOFF_MS = 15 * 60 * 1000;
/** 1回のページ読み込みで起こし続ける絶対上限 */
const MAX_SESSION_MS = 6 * 60 * 60 * 1000;
/** 複数タブ・再読み込みをまたいで ping を重複させないための記録 */
const LAST_PING_KEY = 'ds_club_last_api_ping';

function readLastPing(): number {
  try {
    return Number(localStorage.getItem(LAST_PING_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeLastPing(at: number) {
  try {
    localStorage.setItem(LAST_PING_KEY, String(at));
  } catch {
    // プライベートモード等で書けなくても ping 自体は成立する
  }
}

/**
 * Render を起こすだけの最小リクエスト。
 * - GET かつカスタムヘッダ無し + mode:'no-cors' なので CORS プリフライトが発生しない
 *   (POST + Content-Type: application/json だと OPTIONS が1本増え、コールド時はその
 *    プリフライト自体が起動時間ぶん待たされる)
 * - GraphQL エンドポイントではなくオリジンを叩くだけ。NestJS が 404 を返して終わりで、
 *   DB には触れないので Neon の compute (月100 CU時間) を消費しない
 */
export function pingApi() {
  if (!API_ORIGIN) return;
  writeLastPing(Date.now());
  void fetch(API_ORIGIN, { method: 'GET', mode: 'no-cors', cache: 'no-store' }).catch(() => {
    // 起動中・オフライン・ローカル開発でAPI未起動 — いずれも画面には影響させない
  });
}

/**
 * 管理系の画面で API を起こす。
 * @param heartbeat エディタ等、長時間の操作中にスピンダウンさせたくない画面で true
 */
export function useApiWarming({ heartbeat = false }: { heartbeat?: boolean } = {}) {
  useEffect(() => {
    // 他のタブ/直前の遷移が既に起こしているなら重ねて投げない
    if (Date.now() - readLastPing() > HEARTBEAT_INTERVAL_MS) pingApi();
    if (!heartbeat) return;

    const startedAt = Date.now();
    let lastInteractionAt = Date.now();
    const noteInteraction = () => {
      lastInteractionAt = Date.now();
    };
    const events = ['keydown', 'pointerdown', 'input'] as const;
    events.forEach((e) => window.addEventListener(e, noteInteraction, { passive: true }));

    // setInterval の周期はスリープ・モバイルで凍結するため、時刻で判定する
    const timer = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState !== 'visible') return;
      if (now - startedAt > MAX_SESSION_MS) return;
      if (now - lastInteractionAt > IDLE_CUTOFF_MS) return;
      if (now - readLastPing() < HEARTBEAT_INTERVAL_MS) return;
      pingApi();
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, noteInteraction));
    };
  }, [heartbeat]);
}
