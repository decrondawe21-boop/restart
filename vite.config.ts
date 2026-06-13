import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'vendor-react';
          }

          if (id.includes('@tiptap') || id.includes('prosemirror')) {
            return 'vendor-editor';
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'vendor-charts';
          }

          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }

          if (id.includes('lucide-react') || id.includes('qrcode') || id.includes('jsbarcode')) {
            return 'vendor-ui';
          }
        }
      }
    }
  }
})
