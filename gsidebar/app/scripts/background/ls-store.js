export default {
    set(key, data) {
        localStorage[key] = JSON.stringify(data);
    },
    get(key) {
        return localStorage[key] ? JSON.parse(localStorage[key]): null
    }
}