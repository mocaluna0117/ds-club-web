/**
 * 記事エディタの下書きをブラウザに自動保存する。
 *
 * API (Render 無料プラン) は寝ていると復帰に約1分かかるため、保存ボタンを押してから
 * 実際に保存されるまで待たされたり、その間にタブを閉じたり通信が切れたりすると
 * 書いた内容が失われる。書いている端から localStorage に退避しておく。
 */
export type Draft = {
  title: string;
  content: string;
  savedAt: number;
};

const PREFIX = 'ds_club_draft:';

/** 新規は種別ごと、編集は記事ごとに下書きを分ける */
export function draftKeyFor(postId: string | undefined, type: string) {
  return postId ? `${PREFIX}edit:${postId}` : `${PREFIX}new:${type}`;
}

export function loadDraft(key: string): Draft | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (typeof parsed.title !== 'string' || typeof parsed.content !== 'string') return null;
    return { title: parsed.title, content: parsed.content, savedAt: parsed.savedAt ?? 0 };
  } catch {
    return null;
  }
}

export function saveDraft(key: string, draft: { title: string; content: string }) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    // 容量超過やプライベートモード。保存できなくても編集は続けられる
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // 消せなくても実害はない
  }
}

/** 「3分前」のような相対表記 */
export function formatSavedAt(savedAt: number): string {
  if (!savedAt) return '';
  const minutes = Math.floor((Date.now() - savedAt) / 60000);
  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}
