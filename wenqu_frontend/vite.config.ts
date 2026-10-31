import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // 允许通过隧道域名访问（cpolar / ngrok 等内网穿透），否则 Vite 会以 403 拦截
    allowedHosts: ['.cpolar.cn', '.cpolar.top'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // 生产构建后用 npm run preview 托管，同样需要代理与 Host 放行，便于隧道演示
  preview: {
    port: 5173,
    allowedHosts: ['.cpolar.cn', '.cpolar.top'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
