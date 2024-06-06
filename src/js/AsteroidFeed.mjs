import { renderListWithTemplate, setBreadcrumb, watchlistProcess } from './utils.mjs';

function feedTemplate(asteroid) {
    let asteroidSize = '';
    const numFormat = new Intl.NumberFormat('en-US');
    const asteroidImgs = {
        'small': '../images/asteroids-small.webp',
        'medium': '../images/asteroids-medium.webp',
        'large': '../images/asteroids-large.webp'
    }
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

    const content =
        `<div>
        <section class="browse-list">
            <p><span class="list-label">ASTEROID </span><span class="spaced id">${asteroid.id}</span></p>
            <p><span class="list-label">NAME</span> <span class="name">${asteroid.name}</span></p>
            <p><span class="list-label">CLOSEST APPROACH</span> <span class="closest">${asteroid.close_approach_data[0].close_approach_date}</span></p>
            <div class="asteroid-size">
                <div class="list-label">DIAMETER <br> RANGE KM</div>
                <div><span class="size-km ">${numFormat.format(asteroid.estimated_diameter.kilometers.estimated_diameter_min)}</span> <br> <span class="size-km kms">${numFormat.format(asteroid.estimated_diameter.kilometers.estimated_diameter_max)}</span></div>
                <img class='small' src="${asteroidSize}" alt="asteroid size">
            </div>
            <div class="hazard-badges">
                <p><span class="list-label">Hazard Level</span><span class="badge ${sentryBadge} sentry"></span></p>
                <p><span class="list-label">Sentry Watch</span><span class="badge ${hazardBadge} hazard"></span></p>
                <svg class='watch unselected' xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
                </svg>
                <svg class='watch hide selected' xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                </svg>
            </div>
        </section>
    </div>`
    return content;
}


export default class AsteroidFeed {
    constructor(dataSource, feedElement, startDate, endDate) {
        this.dataSource = dataSource;
        this.feedElement = feedElement;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    async init(path) {
        const asteroidData = await this.dataSource.getData(path);

        //Need to combine the date objects into one large list. The json has objects that are dates, I have to reference the
        //date to retreive that object of data.
        let currentDate = this.startDate;
        let allasteroidData = [];

        while (currentDate <= this.endDate) {
            allasteroidData = allasteroidData.concat(asteroidData.near_earth_objects[currentDate]);

            //increment to the next day
            currentDate = this.addOneDayAndFormat(currentDate);
        }

        this.renderList(allasteroidData);

        // Go to detailed View, create an event for each row
        document.querySelectorAll('.browse-list').forEach(item => {
            item.addEventListener('click', () => {
                const asteroid_id = item.querySelector('.id').textContent;
                window.location.href = `../asteroid-detail/index.html?asteroid_id=${asteroid_id}`;
            });
        });

        watchlistProcess();

        //Listen for the date/page scroll buttons.
        document.querySelector('#next').addEventListener('click', () => {
            const linkPath = `../asteroid-feed/index.html?path=${asteroidData.links.next}`
            window.location.href = linkPath;
        });

        if (asteroidData.links.previous) {
            document.querySelector('#previous').addEventListener('click', () => {
                const linkPath = `../asteroid-feed/index.html?path=${asteroidData.links.previous}`
                window.location.href = linkPath;
            });
            document.querySelector('#previous').ariaDisabled = false;
            document.querySelector('#previous span').style.color = '#D00000';
        } else {
            document.querySelector('#previous').ariaDisabled = true;
            document.querySelector('#previous span').style.color = '#303030';
        }

        // Set the results count
        document.querySelector('#results').textContent = `${asteroidData.element_count} Results`;

        //set the breadcrumbs
        let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href="/asteroid-feed/feed.html">Search by Approach Date</a>`, `<a href="/asteroid-feed/index.html?path=${asteroidData.links.self}">${this.startDate} to ${this.endDate}</a>`, `${asteroidData.element_count} Results`];
        setBreadcrumb(breadcrumbList);
    }

    renderList(list) {
        renderListWithTemplate(feedTemplate, this.feedElement, list);
    }

    addOneDayAndFormat(inputDate) {
        // Convert inputDate string to a Date object. Add one day an format the string
        var date = new Date(inputDate);
        date.setDate(date.getDate() + 1);
        var formattedDate = date.toISOString().split('T')[0];

        return formattedDate;
    }

}