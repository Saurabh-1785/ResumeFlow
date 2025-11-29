import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk sizes
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React vendor code
          'react-vendor': ['react', 'react-dom'],
          // Separate react-pdf if it's large
          'pdf-vendor': ['react-pdf'],
        },
      },
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Set chunk size warnings
    chunkSizeWarningLimit: 600,
  },
});
