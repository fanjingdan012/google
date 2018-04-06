import {BASE_URL, default as baseApi} from 'sap/api/base';

import {showNotification} from 'core/actions/notification';

const URL = BASE_URL + '/SalesChannels';
const POST = 'POST';

const api = {
    load() {
        return baseApi.apiCall({
            url: URL,
        })
    }
}
export default api;
