import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: '/klazassist/',
  plugins: [viteSingleFile()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,   // inline everything
    chunkSizeWarningLimit: 5000,
  },
  server: {
    port: 5173,
    open: true,   // opens browser automatically on npm run dev
  },
});
