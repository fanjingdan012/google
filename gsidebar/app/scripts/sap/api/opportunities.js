import {BASE_URL, default as baseApi} from 'sap/api/base';
import {showNotification} from 'core/actions/notification';

const OPPS_URL = BASE_URL + 'Opportunities';
const POST = 'POST';

const api = {
    load() {
        return baseApi.apiCall({
            url: OPPS_URL,
            data: {
                expand: 'customer',
            }
        });
    },
    loadByCustomerId(id) {
        return baseApi.apiCall({
            url: OPPS_URL,
            data: {
                expand: 'customer',
                filter: `customer.id eq ${id}`
            }
        });
    },
    create(opp) {
        return baseApi.apiCall({
            url: OPPS_URL,
            type: 'POST',
            data: JSON.stringify(opp),
        }).then( res => ({ ...opp, id: res }) )
    }
}
export default api;
