import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'non-blocking-css',
      transformIndexHtml(html, ctx) {
        if (!ctx || !ctx.bundle) return html
        return html.replace(
          /<link rel="stylesheet" href="([^"]+\.css)">/g,
          '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
        )
      },
    },
  ],
  base: './',
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react')) {
              return 'vendor-react'
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper'
            }
            return 'vendor-misc'
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
    },
  },
})
