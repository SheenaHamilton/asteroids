import { loadHeaderFooter, setBreadcrumb } from './utils.mjs';
const watchKey = import.meta.env.VITE_WATCH_KEY;
import AsteroidWatchlist from './WatchList.mjs'

loadHeaderFooter();

//set the breadcrumbs
let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href='/watchlist/index.html'>Watchlist</a>`];
setBreadcrumb(breadcrumbList);


const watchElement = document.querySelector('#watchlist-results');
const watchList = new AsteroidWatchlist(watchElement,watchKey);
watchList.init()


