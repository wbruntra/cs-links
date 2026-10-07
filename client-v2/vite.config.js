import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 13002,
    proxy: {
      '/api': {
        target: 'http://localhost:13001',
        changeOrigin: true,
      },
    },
  },
})
