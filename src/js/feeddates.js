import { loadHeaderFooter, setBreadcrumb } from './utils.mjs';

loadHeaderFooter();

//set the breadcrumbs
let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href="/asteroid-feed/feed.html">Search by Approach Date</a>`];
setBreadcrumb(breadcrumbList);

document.querySelector('#endDate').addEventListener('change', () => {
    let validate = checkDates()
    if (validate == 'dateOrder') {
        document.querySelector('#endDate').value = '';
        document.querySelector('#endinputvalid').innerHTML = '&#9888; End date must be after start date';
    }  
    if (validate == 'overRange') {
        document.querySelector('#endDate').value = '';
        document.querySelector('#endinputvalid').innerHTML = '&#9888; The Feed date limit is only 7 Days.';
    }
});

document.querySelector('#startDate').addEventListener('change', () => {
    let validate = checkDates()
    if (validate == 'dateOrder') {
        document.querySelector('#startDate').value = '';
        document.querySelector('#startinputvalid').innerHTML = '&#9888; Start date must be before end date';
    }
    if (validate == 'overRange') {
        document.querySelector('#startDate').value = '';
        document.querySelector('#startinputvalid').innerHTML = '&#9888; The Feed date limit is only 7 Days.';
    }
});

function checkDates() {
    document.querySelector('#endinputvalid').textContent = '';
    document.querySelector('#startinputvalid').textContent = '';
    const startDate = document.querySelector('#startDate');
    const endDate = document.querySelector('#endDate');

    if (endDate.value && startDate.value) {
        //convert string dates to date values and get the number of days difference
        const endD = new Date(endDate.value);
        const startD = new Date(startDate.value);
        const daysdiff = Math.floor((Math.abs(endD - startD)) / (1000 * 60 * 60 * 24)); 


        if (endD < startD) return 'dateOrder';
        if (daysdiff > 7) return 'overRange';
    }
    return true;
}

