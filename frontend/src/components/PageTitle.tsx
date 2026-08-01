const SITE_NAME = 'データサイエンス倶楽部';

/**
 * ページごとのタイトルを設定する。
 *
 * React 19 は JSX 内の <title> を自動で <head> へ移動させるので、
 * ライブラリを足さずにページ単位のタイトルを出せる。
 * 履歴・タブ・ブックマークで区別がつくようになる。
 */
export function PageTitle({ title }: { title?: string }) {
  return <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>;
}
