import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to the backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Inline small assets
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Manual chunks for better cache splitting
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
          state: ['zustand'],
          http: ['axios'],
        },
      },
    },
  },
  // Ensure environment variables are available
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
