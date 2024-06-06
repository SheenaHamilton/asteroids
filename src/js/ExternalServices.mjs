import { convertToJson } from './utils.mjs';

export default class ExternalServices {
    async getData(path) {
        const response = await fetch(path);
        const data = await convertToJson(response);
        return data;
    }
}