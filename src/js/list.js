import { loadHeaderFooter, setLocalStorageSingle, getLocalStorage } from './utils.mjs';
import AsteroidList from './AsteroidList.mjs';
import ExternalServices from './ExternalServices.mjs';
const neowsBaseURL = import.meta.env.VITE_NEOWS;
const neowsAPIKey = import.meta.env.VITE_NEOWS_APIKEY;
const basepath = neowsBaseURL + `/neo/browse?api_key=${neowsAPIKey}`;
const viewKey = import.meta.env.VITE_VIEW_KEY;

loadHeaderFooter();

let urlParams = window.location.search;
urlParams = urlParams.replace('?path=', '')
urlParams = urlParams.replace('http', 'https');

// had to override the params function due to the pagination.
let dataPath = '';
if (urlParams) {
    dataPath = urlParams;
} else {
    dataPath = basepath;
}

const dataSource = new ExternalServices();
const listElement = document.querySelector('#asteroidlisting');
const browseAsteroids = new AsteroidList(dataSource, listElement);

browseAsteroids.init(dataPath);

let list = document.querySelector('#button-list');
let grid = document.querySelector('#button-grid');
let asteroidDisplay = document.querySelector('#asteroidlist-format');

list.addEventListener('click', () => {
    if (!list.classList.contains('list-active')) {
        changeListView();
        setLocalStorageSingle(viewKey, 'list');
    }
});

grid.addEventListener('click', () => {
    if (!grid.classList.contains('list-active')) {
        changeListView();
        setLocalStorageSingle(viewKey, 'grid');
    }
});

//Get the latest key value 
const userViewPref = getLocalStorage(viewKey);
if (userViewPref == 'list') {
    changeListView();
}

function changeListView() {
    asteroidDisplay.classList.toggle('list-view');
    asteroidDisplay.classList.toggle('grid-view');
    grid.classList.toggle('list-active');
    list.classList.toggle('list-active');
}
