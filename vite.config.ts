import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The Go backend sets no CORS headers, so we proxy /api to it in dev.
    // The frontend only ever calls relative /api/... paths.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
