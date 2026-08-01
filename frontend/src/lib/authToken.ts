const TOKEN_KEY = 'ds_club_token';
const NAME_KEY = 'ds_club_admin';
const EXPIRED_FLAG = 'ds_club_session_expired';

/** 認証切れを検知したときに投げるイベント (Apollo のリンクから React 側へ伝える) */
export const UNAUTHENTICATED_EVENT = 'ds-club:unauthenticated';

/** JWT のペイロードを取り出す。UTF-8 (日本語名など) を含んでいても壊さない */
function decodePayload(token: string): Record<string, unknown> | null {
  const part = token.split('.')[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const json = decodeURIComponent(
      Array.from(binary, (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * JWT の exp を見て期限切れかを判定する。
 * exp が読めないトークンは判定できないので false を返し、サーバーの 401 に任せる。
 */
export function isExpired(token: string): boolean {
  const exp = decodePayload(token)?.exp;
  if (typeof exp !== 'number') return false;
  return Date.now() >= exp * 1000;
}

/** 期限切れのトークンは無かったことにして返す。理由をログイン画面で示せるよう印も付ける */
export function readToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  if (isExpired(token)) {
    clearAuth();
    markSessionExpired();
    return null;
  }
  return token;
}

function markSessionExpired() {
  try {
    sessionStorage.setItem(EXPIRED_FLAG, '1');
  } catch {
    // 印が付けられなくてもログイン画面には遷移する
  }
}

export function readAdminName(): string | null {
  return localStorage.getItem(NAME_KEY);
}

export function saveAuth(token: string, name: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME_KEY, name);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}

/**
 * サーバーに認証を拒否された。ログイン状態を捨てて画面側に知らせる。
 * これが無いと、期限切れ後も「記事0件・メンバー0件」に見えてしまい原因が分からない。
 */
export function notifyUnauthenticated() {
  markSessionExpired();
  window.dispatchEvent(new Event(UNAUTHENTICATED_EVENT));
}

/** ログイン画面で「期限切れで戻された」旨を1回だけ表示するためのフラグ */
export function consumeSessionExpiredFlag(): boolean {
  const flagged = sessionStorage.getItem(EXPIRED_FLAG) !== null;
  if (flagged) sessionStorage.removeItem(EXPIRED_FLAG);
  return flagged;
}
