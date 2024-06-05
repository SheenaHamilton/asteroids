import { convertToJson } from './utils.mjs';

export default class ExternalServices {
    async getData(path) {
        const response = await fetch(path);
        const data = await convertToJson(response);
        return data;
    }

    async getPage(address) {
        const response = await fetch(address);
        const data = await convertToJson(response);
        return data;
    }
}