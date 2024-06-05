import { loadHeaderFooter } from './utils.mjs';
import DailyPicture from './DailyPicture.mjs';
import ExternalServices from './ExternalServices.mjs';

const apodBaseURL = import.meta.env.VITE_APOD;
const apodAPIKey = import.meta.env.VITE_NEOWS_APIKEY;
const basepath = apodBaseURL + `?api_key=${apodAPIKey}`;

loadHeaderFooter();

const dataSource = new ExternalServices();
const listElement = document.querySelector('#picofDay-container');
const displayDailyPhoto = new DailyPicture(dataSource, listElement);

displayDailyPhoto.init(basepath);
