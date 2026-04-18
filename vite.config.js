import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3456,
    strictPort: true,
    host: '127.0.0.1'
  },
  build: {
    // Force new hash on every build to bust cache
    rollupOptions: {
      output: {
        entryFileNames: `assets/index-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    }
  }
})
