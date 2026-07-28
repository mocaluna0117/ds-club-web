import { useEffect, useState } from 'react';

/**
 * active が指定時間を超えて続いたら true になる。
 * Render 無料プランのスピンアップ(約1分)に入っている可能性が高いことを
 * ユーザーに伝えるための表示切り替えに使う。
 */
export function useSlowFlag(active: boolean, ms = 4000) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setSlow(true), ms);
    // active が終わったら次回のためにリセットする
    return () => {
      clearTimeout(t);
      setSlow(false);
    };
  }, [active, ms]);

  return active && slow;
}
