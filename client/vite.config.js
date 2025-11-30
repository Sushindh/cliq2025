import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'https://cliq2025.onrender.com',
      '/socket.io': {
        target: 'https://cliq2025.onrender.com',
        ws: true,
      },
    },
  },
})
