import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        smp: resolve(__dirname, 'detail-smp-kqc.html'),
        takhassus: resolve(__dirname, 'detail-takhassus.html'),
        sanlat: resolve(__dirname, 'detail-sanlat.html'),
      },
    },
  },
});
