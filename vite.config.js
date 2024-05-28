import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        watchlist: resolve(__dirname, 'src/watchlist/index.html'),
        asteroiddetail: resolve(__dirname, 'src/asteroid-detail/index.html'),
        asteroidfeed: resolve(__dirname, 'src/asteroid-feed/index.html'),
        asteroidlist: resolve(__dirname, 'src/asteroid-list/index.html'),
        dailypicture: resolve(__dirname,'src/daily-picture/index.html'),
      },
    },
  },
});
