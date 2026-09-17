import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// 个人品牌站部署到 GitHub Pages：仓库路径为 https://<username>.github.io/my-website/，
// 故 SPA base 必须设为 '/my-website/'（与 OpenSpec config.yaml base path 一致）。
export default defineConfig({
  base: '/my-website/',
  plugins: [react(), tailwindcss()],
})