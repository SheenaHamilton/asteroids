import { renderWithTemplate, setBreadcrumb } from './utils.mjs';

function listTemplate(dailyPic) {
    let mediaHTML = ``;
    
    if (dailyPic.media_type == 'image') {
        mediaHTML = `<img id='imagery' src="${dailyPic.url}">`;
    } 
    else if (dailyPic.media_type == 'image') {
        mediaHTML = `<iframe id='imagery' width="560" height="315" src="${dailyPic.url}" frameborder="0" allowfullscreen></iframe>`;
    }

    const content =
        `   <div class='title-block'>
                <p id="photo-title">${dailyPic.title}</p>
                <p id="photo-date">${dailyPic.date}</p>
            </div>
            ${mediaHTML}
            <p id="photo-description"><span id="photo-explanation">Explanation</span><br>${dailyPic.explanation}</p>`
    return content;
}

export default class DailyPicture {
    constructor(dataSource, listElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init(path) {
        const pictureData = await this.dataSource.getData(path);
        this.renderList(pictureData);
        //const numFormat = new Intl.NumberFormat('en-US');

        //set the breadcrumbs
        let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href="/daily-picture/index.html">Daily Picture</a>`];
        setBreadcrumb(breadcrumbList);
    }

    renderList(picture) {
        renderWithTemplate(listTemplate, this.listElement, picture, listTemplate);
    }
}