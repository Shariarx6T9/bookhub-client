import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/auth', 'firebase/app'],
          ui: ['react-hot-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000
  }
})