import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';

/**
 * コンテンツ(メンバー・記事)の更新をGitHubへ通知し、フロントエンドの再ビルドを起動する。
 * フロントはビルド時に公開データのスナップショットをバンドルへ焼き込むため、
 * コンテンツ更新のたびに再ビルドしてスナップショットを最新化する。
 *
 * GITHUB_REBUILD_TOKEN が未設定の場合は何もしない
 * (その場合もデイリーの定期再ビルドでスナップショットは更新される)。
 */
@Injectable()
export class RebuildService implements OnApplicationShutdown {
  private readonly logger = new Logger(RebuildService.name);
  private timer?: NodeJS.Timeout;
  private pending = false;

  /** 連続編集をまとめるためのデバウンス時間 */
  private static readonly DEBOUNCE_MS = 10_000;

  trigger() {
    if (!process.env.GITHUB_REBUILD_TOKEN) return;
    clearTimeout(this.timer);
    this.pending = true;
    this.timer = setTimeout(() => void this.dispatch(), RebuildService.DEBOUNCE_MS);
  }

  /** デプロイ等でプロセスが終了するとき、デバウンス待ちの通知を取りこぼさず送る */
  async onApplicationShutdown() {
    if (!this.pending) return;
    clearTimeout(this.timer);
    await this.dispatch();
  }

  private async dispatch() {
    this.pending = false;
    const repo = process.env.GITHUB_REBUILD_REPO ?? 'mocaluna0117/ds-club-web';
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_REBUILD_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ds-club-api',
        },
        body: JSON.stringify({ event_type: 'content-updated' }),
      });
      if (res.ok) {
        this.logger.log('repository_dispatch sent (content-updated)');
      } else {
        this.logger.warn(`repository_dispatch failed: HTTP ${res.status}`);
      }
    } catch (e) {
      // 通知失敗はコンテンツ更新自体には影響させない
      this.logger.warn(`repository_dispatch failed: ${(e as Error).message}`);
    }
  }
}
