import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('react-router') || id.includes('react-dom') || id.includes('react')) {
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
