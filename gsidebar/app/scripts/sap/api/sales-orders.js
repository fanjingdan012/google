import {BASE_URL, default as baseApi} from 'sap/api/base';
import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

import {showNotification} from 'core/actions/notification';

const SALES_ORDER_URL = BASE_URL + 'SalesOrders';
const POST = 'POST';

const api = {
    query(filter) {
        return baseApi.apiCall({
            url: SALES_ORDER_URL,
            data: {
                expand: 'customer',
                filter: filter
            }
        })
    }
}
export default api;
