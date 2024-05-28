// Local storage functions ------------------------------------------ //

// Gets the local storage data based on the passed in key.
export function getLocalStorage(key) {

  let localstorage = localStorage.getItem(key);
  let data = [];

  if (localstorage) {
      data = JSON.parse(localstorage);
  }
  return data;
}

// Sets the local storage, receives a new complete array to replace
export function addtoLocalStorage(key, newData) {

  let dataArray = getLocalStorage(key);
  dataArray.push(newData);
  setLocalStorage(key,dataArray)

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
      if (item.Id != id) {
        return true; // Do not include this item in the updated array
      }
    });
    setLocalStorage(key, newArray);
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

export function renderWithTemplate(templateFn, parentElement, data, position = 'afterbegin') {
  parentElement.insertAdjacentHTML(position, templateFn);
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

export async function loadHTMLTemplate(path) {
  const html = await fetch(path);
  const template = await html.text();
  return template;
}

export function setBreadcrumb(links) {
    const breadcrumbList = document.querySelector('#breadcrumb');

    links.forEach(link => {
      const newBreadcrumb = document.createElement('li');
      newBreadcrumb.classList.add('breadcrumb')
      newBreadcrumb.innerHTML = link;
      breadcrumbList.appendChild(newBreadcrumb);
    });

}

// END HTML Page Functions --------------------------------------------- //
