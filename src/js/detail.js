import { loadHeaderFooter, getParams } from './utils.mjs';
import AsteroidDetail from './AsteroidDetail.mjs';
import ExternalServices from './ExternalServices.mjs';
const neowsBaseURL = import.meta.env.VITE_NEOWS;
const neowsAPIKey = import.meta.env.VITE_NEOWS_APIKEY;
let basepath = neowsBaseURL + `/neo/`

loadHeaderFooter();

const asteroidID = getParams('asteroid_id');
basepath = `${basepath}${asteroidID}?api_key=${neowsAPIKey}`;

const dataSource = new ExternalServices();
const listElement = document.querySelector('#details-container');
const findAsteroid = new AsteroidDetail(dataSource, listElement);

findAsteroid.init(basepath);
