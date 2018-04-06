import {BASE_URL, default as BaseApi} from './base';
import {showNotification} from 'core/actions/notification';

const SUPPORTED_FIELDS = [
    'customerCode',
    'customerType',
    'stage',
    'customerName',
    'firstName',
    'lastName',
    'status',
    'marketingStatus',
    'remark',
    'phone',
    'mobile',
    'email',
];

const readOnlyFields = [
    'displayName',
    'membershipLevel',
    'creationTime',
    'updateTime'
]

function cleanParams(data) {
    var params = {};
    // _.each(data, (val, key) => {
    //     if ((typeof val === 'boolean' || val ) && readOnlyFields.indexOf(key) === -1) {
    //         params[key] = val;
    //     }
    // })
    _.each(data, (val, key) => {
        if (SUPPORTED_FIELDS.indexOf(key) > -1) {
            params[key] = val;
        }
    })
    return params;
}


export default {
    getCustomerByEmail(email) {
        return new Promise ((resolve, reject) => {
            BaseApi.apiCall({
                url: BASE_URL + 'Customers',
                data: {
                    filter: `email eq '${email}'`
                }
            }).then(resolve).catch(reject)
        });
    },
    getCustomerById(id) {
        return BaseApi.apiCall({
            url: BASE_URL + 'Customers/' + id
        })
    },
    getCustomers() {
        return new Promise ((resolve, reject) => {
            BaseApi.apiCall({
                url: BASE_URL + 'Customers',
                data: {}
            }).then(resolve).catch(reject)
        });
    },
    createCustomer(customerData) {
        var params = cleanParams(customerData);
        showNotification('Saving...');
        return new Promise( (resolve, reject) => {
            if (!customerData || _.isEmpty(customerData)) {
                reject({});
                return;
            }
            BaseApi.apiCall({
                type: 'POST',
                url: BASE_URL + 'Customers',
                data: JSON.stringify(params)
            }).then(id => {
                showNotification('Customer created.');
                resolve({...customerData, id})
            }).catch(err => {
                showNotification(err.message);
                reject(err);
            });
        })
    },
    updateCustomer(customerData) {
        var params = cleanParams(customerData);
        showNotification('Saving...');
        return new Promise((resolve, reject) => {
            BaseApi.apiCall({
                type: 'PATCH',
                url: BASE_URL + 'Customers/' + customerData.id,
                data: JSON.stringify(params),
                dataType: 'text'
            })  .then(id => {
                resolve(customerData);
                showNotification('Customer has been updated.');
            })
            .catch(err => {
                showNotification(err.message);
                reject(err);
            });
        })
    },
    getNotes(id) {
        return BaseApi.apiCall({
            url: BASE_URL + 'Customers/' + id + '/Notes',
        })
    },
    queryCustomers(filter, select) {
        return BaseApi.apiCall({
            url: BASE_URL + 'Customers',
            data: {filter}
        })
    }
}
export const STAGE_OPTIONS = [
    {text: 'Suspect', payload: 'SUSPECT'},
    {text: 'Prospect', payload: 'PROSPECT'},
    {text: 'Customer', payload: 'CUSTOMER'}
];
export const MARKETING_STATUS_OPTIONS = [
    {text: 'Subscribed', payload: 'SUBSCRIBED'},
    {text: 'Unsubscribed', payload: 'UNSUBSCRIBED'},
    {text: 'Cleaned', payload: 'CLEANED'},
    {text: 'Unknown', payload: 'UNKNOWN'}
];

export const CUSTOMER_TYPES = [
    {text: 'Corporate Customer', payload: 'CORPORATE_CUSTOMER'},
    {text: 'Individual Customer', payload: 'INDIVIDUAL_CUSTOMER'}
];
export const STATUS_OPTIONS = [
    {text: 'Active', payload: 'ACTIVE'},
    {text: 'Inactive', payload: 'INACTIVE'},
    {text: 'Duplicated', payload: 'DUPLICATED'},
]