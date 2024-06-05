// Local storage functions ------------------------------------------ //
const watchKey = import.meta.env.VITE_WATCH_KEY;

// Gets the local storage data based on the passed in key.
export function getLocalStorage(key) {

  let localstorage = localStorage.getItem(key);
  let data = [];

  if (localstorage) {
      data = JSON.parse(localstorage);
  }
  return data;
}

// Sets the local storage, receives a new item to add to the array
export function addtoLocalStorage(key, newData) {

  let dataArray = getLocalStorage(key);
  dataArray.push(newData);
  setLocalStorage(key,dataArray)

}
// Sets the local storage, receives a new single entry replace
export function setLocalStorageSingle(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Sets the local storage, receives a new complete array to replace
export function setLocalStorage(key, updatedArray) {
  localStorage.setItem(key, JSON.stringify(updatedArray));
}

export function removeLocalStorageItem(key, id) {
  let dataArray = getLocalStorage(key);

  if (dataArray != null) {
    //filter the array and exclude the asteroid that we're removing
    let newArray = dataArray.filter(item => {
      if (item.asteroid_id != id) {
        return true; // Do not include this item in the updated array
      }
    });
    setLocalStorage(key, newArray);
  }
}

export function findLocalStorageItem(key, id) {
  let dataArray = getLocalStorage(key);

  if (dataArray != null) {
    //filter the array and exclude the asteroid that we're removing
    let newArray = dataArray.filter(item => {
      if (item.asteroid_id == id) {
        return true; // include this item in the updated array
      }
    });
    if (newArray.length > 0) return true; else return false;
  }
}

export function updateWatchlist(key, id, name, kms, closest, sentry, hazard) {
  //create the new object
  const asteroidobj = {
    'asteroid_id': id,
    'name': name,
    'maximum_size_km': kms,
    'closest_date': closest,
    'sentry': sentry,
    'hazard': hazard
  };
    //if the entry is not found, add it.
    if(!findLocalStorageItem(key,id)) {
      addtoLocalStorage(key,asteroidobj);
    }
}

// END Local storage functions ------------------------------------------ //

// Data conversion functions -------------------------------------------- //

//convert the imported file to JSON
export function convertToJson(results) {
  if (results.ok) {
      return results.json();
  } else {
      throw new Error('Bad Response');
  }
}

//Get Data file based on the given path
export function getData(path) {
    return fetch(path)
      .then(convertToJson)
      .then((data) => data);
}

// END Data conversion functions ---------------------------------------- //

// Render HTML functions ------------------------------------------------ //

export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = false) {
  const renderedHTML = list.map(templateFn);
  if (clear == true) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, renderedHTML.join(''));
}

export function renderWithTemplate(templateFn, parentElement, data, callback, position = 'afterbegin') {
  
  var htmlTemplate = '';

  if (callback) {
    htmlTemplate = callback(data);
    parentElement.insertAdjacentHTML(position, htmlTemplate);
  }
  else {
    parentElement.insertAdjacentHTML(position, templateFn);
  }
  
}

// END Render functions ------------------------------------------------ //

// Header and Footer functions ----------------------------------------- //


export async function loadHeaderFooter() {

  const headerTemplate = await loadHTMLTemplate('../partials/header.html');
  const headerElement = document.querySelector('header');

  const footerTemplate = await loadHTMLTemplate('../partials/footer.html');
  const footerElement = document.querySelector('footer');

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// END Header and Footer functions ------------------------------------- //

// HTML page functions  ------------------------------------------ //

export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function getEntireParamsString() {
  const paramString = window.location.search;
  return paramString;
}

export async function loadHTMLTemplate(path) {
  const html = await fetch(path);
  const template = await html.text();
  return template;
}

export function setBreadcrumb(links) {
  const breadcrumbList = document.querySelector('#breadcrumb');

  //clears the placeholders. there to stop the screen from moving too much.
  breadcrumbList.innerHTML = '';

  links.forEach(link => {
    const newBreadcrumb = document.createElement('li');
    newBreadcrumb.classList.add('breadcrumb')
    newBreadcrumb.innerHTML = link;
    breadcrumbList.appendChild(newBreadcrumb);
  });
}
// END HTML Page Functions --------------------------------------------- //

// Watchlist Functions --------------------------------------------- //
export function watchlistProcess (reload = false) {
  document.querySelectorAll('.watch').forEach(watch => {
    watch.addEventListener('click', (event) => {
      let hidden = watch.parentNode.querySelector('.hide');

      const id = watch.parentElement.parentElement.parentElement.querySelector('.id').textContent;
      const name = watch.parentElement.parentElement.parentElement.querySelector('.name').textContent;
      const kms = watch.parentElement.parentElement.parentElement.querySelector('.kms').textContent;
      const closest = watch.parentElement.parentElement.parentElement.querySelector('.closest').textContent;

      let sentry = 'low'
      const sentryCode = watch.parentElement.parentElement.parentElement.querySelector('.sentry').classList.contains('high');
      if (sentryCode) {
        sentry = 'high'
      }

      let hazard = 'low'
      const hazardcode = watch.parentElement.parentElement.parentElement.querySelector('.hazard').classList.contains('high');
      if (hazardcode) {
        hazard = 'high'
      }

      //Update local Storage
      if (watch.classList.contains('unselected')) {
        updateWatchlist(watchKey, id, name, kms, closest, sentry, hazard);
      } else {
        removeLocalStorageItem(watchKey, id);
      }

      watch.classList.toggle('hide');
      hidden.classList.toggle('hide');
      event.stopPropagation();
      
      if (reload) location.reload();
    });
  });  
}

// END Change View Functions --------------------------------------------- //



