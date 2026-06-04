import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    // Auto-optimize imported images at build: convert to WebP and cap the
    // dimensions. Per-import directives (e.g. ?w=24&inline for blur-up
    // placeholders) override these defaults.
    imagetools({
      defaultDirectives: () =>
        new URLSearchParams({ format: 'webp', quality: '72', w: '1200' })
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
