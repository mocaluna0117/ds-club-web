import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ds-club-web/',
  // server.port は未指定のため Vite のデフォルト値 5173 が使われる
  // 変更する場合: server: { port: 3000 }
})
