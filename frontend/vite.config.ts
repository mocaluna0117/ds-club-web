import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本番ビルド時のみ /ds-club-web/ をベースにする（GitHub Pages 用）
// 開発時は / を使うことで localhost:5173 で直接アクセスできる
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/ds-club-web/' : '/',
  // server.port は未指定のため Vite のデフォルト値 5173 が使われる
  // 変更する場合: server: { port: 3000 }
}))
