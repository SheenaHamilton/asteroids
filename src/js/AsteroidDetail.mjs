import { renderWithTemplate, setBreadcrumb, watchlistProcess, findLocalStorageItem } from './utils.mjs';
const watchKey = import.meta.env.VITE_WATCH_KEY;

function detailTemplate(asteroid) {
    const numFormat = new Intl.NumberFormat('en-US');

    let sentryBadge = 'low';
    if (asteroid.is_sentry_object == true) sentryBadge = 'high';

    let hazardBadge = 'low';
    if (asteroid.is_potentially_hazardous_asteroid == true) hazardBadge = 'high';

    let watched = 'hide';
    let unwatched = '';

    if (findLocalStorageItem(watchKey,asteroid.id)) {
        watched = '';
        unwatched = 'hide';
    }

    let content =
        `       <section class='asteroid-header'>
                    <div id='title-header'>
                        <p><span class='list-label '>ASTEROID </span><span class='spaced id'>${asteroid.id}</span></p>
                        <p><span class='list-label'>NAME</span> <span class='name'>${asteroid.name}</span></p>
                        <span class='closest' hidden>${asteroid.close_approach_data[0].close_approach_date}</span>
                        <span class='size-km kms' hidden>${numFormat.format(asteroid.estimated_diameter.kilometers.estimated_diameter_max)}</span>
                        <div class='details-watchlist'>
                            <svg class='watch unselected ${unwatched}' xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 384 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path
                                    d='M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z'>
                                </path>
                            </svg>
                            <svg class='watch ${watched}' xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 384 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path
                                    d='M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z'>
                                </path>
                            </svg>
                        </div>                        
                    </div>
                    <div class='hazard-badges'>
                        <p><span class='list-label'>Hazard Level</span><span class='badge ${hazardBadge} hazard'></span></p>
                        <p><span class='list-label'>Sentry Watch</span><span class='badge ${sentryBadge} sentry'></span></p>
                    </div>
                </section>
                <hr>
                <section class='asteroid-data-container'>
                    <span class='list-label'>Diameter Range KM MIN</span><span class='size-km'>${numFormat.format(Math.round(asteroid.estimated_diameter.kilometers.estimated_diameter_min))} km</span>
                    <span class='list-label'>First observation date:</span> <span>${asteroid.orbital_data.first_observation_date}</span>
                    <span class='list-label'>Diameter Range KM MAX</span><span class='size-km'>${numFormat.format(Math.round(asteroid.estimated_diameter.kilometers.estimated_diameter_max))} km</span>
                    <span class='list-label'>Last Observation Date</span> <span>${asteroid.orbital_data.last_observation_date}</span>
                    <span class='list-label'>Orbit Uncertainty</span> <span>${asteroid.orbital_data.orbit_uncertainty}</span>
                    <span class='list-label'>Absolute Magnitude (h)</span> <span>${asteroid.absolute_magnitude_h}</span>
                </section> 
                <p class='list-label'>Close Approach Dates </span>
                <div class='approachDates-container'>
                    <section id='approachDates-header'>
                        <span class='list-label'>Close Approach</span>
                        <span class='list-label'>Relative Velocity (km/s)</span>
                        <span class='list-label'>Miss Distance (km)</span>
                        <span class='list-label'>Orbiting Body</span>
                    </section>`;
    asteroid.close_approach_data.forEach((approach) => {
        content +=
            `            <div id='approachDates-Data'>
                        <section class='approachDates-item'>
                            <span>${approach.close_approach_date_full}</span>
                            <span>${numFormat.format(Math.round(approach.relative_velocity.kilometers_per_second))}</span>
                            <span>${numFormat.format(Math.round(approach.miss_distance.kilometers))}</span>
                            <span>${approach.orbiting_body}</span>
                        </section>
                    </div>`
    });
    content +=
        `           </div>`;

    return content;
}


export default class AsteroidDetail {
    constructor(dataSource, detailElement) {
        this.dataSource = dataSource;
        this.detailElement = detailElement;
    }
    async init(path) {
        let errorMsg = '';
        let asteroidetails = {};

        try {
            asteroidetails = await this.dataSource.getData(path);
        }
        catch (e) {
            errorMsg = 'No Results Found';
        }

        if (!errorMsg) {
            this.renderDetail(asteroidetails, detailTemplate);

            watchlistProcess();

            //set the breadcrumbs
            let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href='/asteroid-detail/find.html'>Find Asteroid by ID</a>`, `${asteroidetails.id} `];
            setBreadcrumb(breadcrumbList);
        }
        else {
            this.renderDetail(errorMsg, createErrorBlock);

            let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href='/asteroid-detail/find.html'>Find Asteroid by ID</a>`, `No Result`];
            setBreadcrumb(breadcrumbList);
        }
    }

    renderDetail(details, templateFn) {
        renderWithTemplate(templateFn, this.detailElement, details, templateFn, 'beforeend');
    }
}

function createErrorBlock(errorMessage) {

    return `<div class='no-results'>
                <p>${errorMessage}</p>
            </div>`
}