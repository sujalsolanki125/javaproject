import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose server to host (required for Docker)
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.REACT_APP_API_URL || 'http://backend:8080', // Use service name 'backend' for Docker networking
        changeOrigin: true,
      }
    }
  }
})
