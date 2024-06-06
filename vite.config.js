import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        watchlists: resolve(__dirname, 'src/watchlist/index.html'),
        asteroiddetail: resolve(__dirname, 'src/asteroid-detail/index.html'),
        asteroidfind: resolve(__dirname, 'src/asteroid-detail/find.html'),
        asteroidfeed: resolve(__dirname, 'src/asteroid-feed/index.html'),
        asteroidsearch: resolve(__dirname, 'src/asteroid-feed/feed.html'),
        asteroidlist: resolve(__dirname, 'src/asteroid-list/index.html'),
        dailypicture: resolve(__dirname, 'src/daily-picture/index.html'),
        credits: resolve(__dirname, 'src/credits/index.html')
      },
    },
  },
});
