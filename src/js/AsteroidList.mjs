import { renderListWithTemplate, setBreadcrumb, watchlistProcess, findLocalStorageItem } from './utils.mjs';
const watchKey = import.meta.env.VITE_WATCH_KEY;

function listTemplate(asteroid) {
    let asteroidSize = '';
    const numFormat = new Intl.NumberFormat('en-US');
    const asteroidImgs = { 'small': '../images/asteroids-small.webp',
                           'medium': '../images/asteroids-medium.webp',
                           'large': '../images/asteroids-large.webp' }
    if (asteroid.estimated_diameter.kilometers.estimated_diameter_max < 800) {
        asteroidSize = asteroidImgs.small;
    } else if (asteroid.estimated_diameter.kilometers.estimated_diameter_max < 1600) {
        asteroidSize = asteroidImgs.medium;
    } else if (asteroid.estimated_diameter.kilometers.estimated_diameter_max >= 1600) {
        asteroidSize = asteroidImgs.large;
    }

    let sentryBadge = 'low';
    if (asteroid.is_sentry_object == true) sentryBadge = 'high';

    let hazardBadge = 'low';
    if (asteroid.is_potentially_hazardous_asteroid == true) hazardBadge = 'high';

    let watched = 'hide';
    let unwatched = '';

    if (findLocalStorageItem(watchKey, asteroid.id)) {
        watched = '';
        unwatched = 'hide';
    }

    const content =
    `<div>
        <section class='browse-list'>
            <p><span class='list-label'>ASTEROID </span><span class='spaced id'>${asteroid.id}</span></p>
            <p><span class='list-label'>NAME</span> <span class='name'>${asteroid.name}</span></p>
            <p><span class='list-label'>LAST DATE</span> <span>${asteroid.orbital_data.last_observation_date}</span></p>
            <span class='closest' hidden>${asteroid.close_approach_data[0].close_approach_date}</span>
            <div class='asteroid-size'>
                <div class='list-label'>DIAMETER <br> RANGE KM</div>
                <div><span class='size-km'>${numFormat.format(asteroid.estimated_diameter.kilometers.estimated_diameter_min)}</span> <br> <span class='size-km kms'>${numFormat.format(asteroid.estimated_diameter.kilometers.estimated_diameter_max)}</span></div>
                <img class='small' src='${asteroidSize}' alt='asteroid size'>
            </div>
            <div class='hazard-badges'>
                <p><span class='list-label'>Hazard Level</span><span class='badge ${sentryBadge} sentry'></span></p>
                <p><span class='list-label'>Sentry Watch</span><span class='badge ${hazardBadge} hazard'></span></p>
                <svg class='watch unselected ${unwatched}' xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 384 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d='M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z' />
                </svg>
                <svg class='watch ${watched}' xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 384 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d='M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z' />
                </svg>
            </div>
        </section>
    </div>`
    return content;
}


export default class AsteroidList {
    constructor(dataSource, listElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init(path) {
        const asteroidData = await this.dataSource.getData(path);
        this.renderList(asteroidData.near_earth_objects);
        const numFormat = new Intl.NumberFormat('en-US');

        watchlistProcess();

        // Go to detailed View, create an event for each row
        document.querySelectorAll('.browse-list').forEach(item => {
            item.addEventListener('click', () => {
                const asteroid_id = item.querySelector('.id').textContent;
                window.location.href = `../asteroid-detail/index.html?asteroid_id=${asteroid_id}`;
            });
        });

        document.querySelectorAll('.watch').forEach(watch => {
            watch.addEventListener('click', () => {
                let hidden = watch.parentNode.querySelector('.hide');
                watch.classList.toggle('hide');
                hidden.classList.toggle('hide');
            })
        })

        //Listen for the page scroll buttons.
        document.querySelector('#next').addEventListener('click', ()=> {    
            const linkPath = `../asteroid-list/index.html?path=${asteroidData.links.next}`
            window.location.href = linkPath;
        });

        document.querySelector('#previous').ariaDisabled = true;

        if (asteroidData.links.prev) {
            document.querySelector('#previous').addEventListener('click', () => {
                const linkPath = `../asteroid-list/index.html?path=${asteroidData.links.prev}`
                window.location.href = linkPath;
            });
            document.querySelector('#previous').ariaDisabled = false;
        } 

        // Set the results count
        document.querySelector('#results').textContent = `Results ${(asteroidData.page.number * 20) + 1} -  ${(asteroidData.page.number + 1) * 20} / ${numFormat.format(asteroidData.page.total_elements)}`;

        //set the breadcrumbs
        let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href='/asteroid-list/index.html'>Browse Asteroids</a>`, (numFormat.format(asteroidData.page.total_elements) + ' results')];
        setBreadcrumb(breadcrumbList);
    }

    renderList(list) {
        renderListWithTemplate(listTemplate, this.listElement, list);
    }
}