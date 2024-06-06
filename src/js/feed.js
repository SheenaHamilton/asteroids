import { loadHeaderFooter, setLocalStorageSingle, getLocalStorage, getEntireParamsString, getParams } from './utils.mjs';
import AsteroidFeed from './AsteroidFeed.mjs';
import ExternalServices from './ExternalServices.mjs';
const neowsBaseURL = import.meta.env.VITE_NEOWS;
const neowsAPIKey = import.meta.env.VITE_NEOWS_APIKEY;
let basepath = neowsBaseURL + `/feed`;
const viewKey = import.meta.env.VITE_FEEDVIEW_KEY;

loadHeaderFooter();

// Get start and End Dates. Check if the parameter string includes the nextPage path
let paramStartDate = getParams('start_date');
let paramEndDate = getParams('end_date');
let paramPagePath = getParams('path');

// Not the string for the next/previous page that comes fully complete
if (!paramPagePath) {
    basepath += `?start_date=${paramStartDate}&end_date=${paramEndDate}&api_key=${neowsAPIKey}`
} else {
    let getURL = getEntireParamsString();
    getURL = getURL.replace('?path=', '');
    getURL = getURL.replace('http', 'https');
    let urlParams = getURL.substring(getURL.indexOf('?'));
    urlParams = new URLSearchParams(urlParams);
    paramStartDate = urlParams.get('start_date');
    basepath = getURL;
}

const dataSource = new ExternalServices();
const feedElement = document.querySelector('#asteroidlisting');
const browseAsteroids = new AsteroidFeed(dataSource, feedElement, paramStartDate, paramEndDate);

browseAsteroids.init(basepath);

let list = document.querySelector('#button-list');
let grid = document.querySelector('#button-grid');
let asteroidDisplay = document.querySelector('#asteroidlist-format');

list.addEventListener('click', () => {
    if (!list.classList.contains('list-active')) {
        changeFeedView();
        setLocalStorageSingle(viewKey, 'feed-list');
    }
});

grid.addEventListener('click', () => {
    if (!grid.classList.contains('list-active')) {
        changeFeedView();
        setLocalStorageSingle(viewKey, 'feed-grid');
    }
});

//Get the latest key value 
const userViewPref = getLocalStorage(viewKey);
if (userViewPref == 'feed-list') {
    changeFeedView();
}

function changeFeedView() {
    asteroidDisplay.classList.toggle('list-view');
    asteroidDisplay.classList.toggle('grid-view');
    grid.classList.toggle('list-active');
    list.classList.toggle('list-active');
}
 
