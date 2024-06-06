import { renderListWithTemplate, setBreadcrumb, getLocalStorage, watchlistProcess } from './utils.mjs';

function watchTemplate(asteroid) {
    const numFormat = new Intl.NumberFormat('en-US');

    //secondary div here is for the use of common code for the removal of the watchlist flag, it has to go up the parent node a certain leval and still remain in the items specifi block.
     const content =
    `<div class='watchitem-container'>
     <div>
        <section class="watch-item">
            <span class="spaced id">${asteroid.asteroid_id}</span>
            <span class="name">${asteroid.name}</span>
            <span class="closest">${asteroid.closest_date}</span>
            <span class="size-km kms">${numFormat.format(asteroid.maximum_size_km)}</span>
            <div class="hazard"><span class=" badge ${asteroid.sentry} sentry"></span></div>
            <div class="hazard"><span class=" badge ${asteroid.hazard} hazard"></span></div>
            <svg class='watch hide' xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
            </svg>
            <svg class='watch' xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
            </svg>
        </section>
    </div>
    </div>`
   return content;
}

export default class AsteroidWatchlist {
    constructor(watchElement,watchKey) {
        this.watchElement = watchElement;
        this.watchKey = watchKey
    }
    async init() {

        const watchData = getLocalStorage(this.watchKey);

        if (watchData.length == 0) {
            this.renderDetail(['No watchlist information available'], createErrorBlock);
        }
        else {
            this.renderDetail(watchData, watchTemplate);

            document.querySelectorAll('.watch').forEach(watch => {
                watch.addEventListener('click', () => {
                    let hidden = watch.parentNode.querySelector('.hide');
                    watch.classList.toggle('hide');
                    hidden.classList.toggle('hide');
                })
            })

            // Go to detailed View, create an event for each row
            document.querySelectorAll('.watch-item').forEach(item => {
                item.addEventListener('click', () => {
                    const asteroid_id = item.querySelector('.id').textContent;
                    window.location.href = `../asteroid-detail/index.html?asteroid_id=${asteroid_id}`;
                });
            });

            //set the breadcrumbs
            let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href="/watchlist/index.html">Watchlist</a>`, `${watchData.length} results `];
            setBreadcrumb(breadcrumbList);
            watchlistProcess(true);
        }
    }

    renderDetail(watchlist, templateFn) {
        renderListWithTemplate(templateFn, this.watchElement, watchlist);
    }
}

function createErrorBlock(errorMessage) {

    return `<div class='no-results'>
                <p>${errorMessage}</p
            </div>`
}