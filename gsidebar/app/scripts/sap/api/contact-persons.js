import {BASE_URL, default as BaseApi} from './base';
import {showNotification} from 'core/actions/notification';

const SUPPORTED_FIELDS = [
    'firstName',
    'lastName',
    'customer',
    'mobile',
    'phone',
    'email',
    'status',
    'marketingStatus',
    'remark',
]

const readOnlyFields = [
    'displayName',
    'membershipLevel',
    'creationTime',
    'updateTime'
];

function cleanParams(data) {
    var params = {};
    _.each(data, (val, key) => {
        if (SUPPORTED_FIELDS.indexOf(key) > -1) {
            params[key] = val;
        }
    })
    return params;
}


export default {
    getContactById(id) {
        return BaseApi.apiCall({
            url: BASE_URL + 'ContactPersons/' + id
        });
    },
    getContactByEmail(email) {
        return new Promise ((resolve, reject) => {
            BaseApi.apiCall({
                url: BASE_URL + 'ContactPersons',
                data: {
                    filter: `email eq '${email}'`
                }
            }).then(resolve).catch(reject)
        });
    },
    loadContacts() {
        return new Promise ((resolve, reject) => {
            BaseApi.apiCall({
                url: BASE_URL + 'ContactPersons',
                data: {
                    orderby: 'updateTime desc'
                }
            }).then(resolve).catch(reject)
        });
    },
    createContactPerson(contactPerson = {}) {
        var data = {};
        _.each(contactPerson, function (val, key) {
            if (val) {
                data[key] = val;
            }
        })
        showNotification('Creating contact...');
        return new Promise ((resolve, reject) => {
            BaseApi.apiCall({
                type: 'POST',
                url: BASE_URL + 'ContactPersons',
                data: JSON.stringify(data)
            }).then(id => {
                resolve({...contactPerson, id});
                showNotification('Contact has been created.')
            })
            .catch(err => {
                showNotification(err.message);
                reject(err);
            })
        });
    },
    updateContactPerson(contactPerson) {
        var data = cleanParams(contactPerson);
        showNotification('Saving...');
        return new Promise ((resolve, reject) => {
            BaseApi.apiCall({
                type: 'PATCH',
                url: BASE_URL + 'ContactPersons/' + contactPerson.id,
                data: JSON.stringify(data),
                dataType: 'text'
            }).then(id => {
                resolve(contactPerson);
                showNotification('Contact has been updated.');
            })
            .catch(err => {
                showNotification(err.message);
                reject(err);
            })
        });
    },
    getNotes(id) {
        return BaseApi.apiCall({
            url: BASE_URL + 'ContactPersons/' + id + '/Notes',
        })
    },
    getContactsByCustomerId(id) {
        return BaseApi.apiCall({
            url: BASE_URL + 'ContactPersons',
            data: {
                filter: `customer.id eq ${id}`,
                expand: 'customer'
            }
        });
    },
    queryContacts(filter, select) {
        return BaseApi.apiCall({
            url: BASE_URL + 'ContactPersons',
            data: {filter, select, expand: 'customer'}
        })
    }
}
export const STATUS_OPTIONS = [
    {text: 'Active', payload: 'ACTIVE'},
    {text: 'Inactive', payload: 'INACTIVE'}
];
export const MARKETING_STATUS_OPTIONS = [
    {text: 'Subscribed', payload: 'SUBSCRIBED'},
    {text: 'Unsubscribed', payload: 'UNSUBSCRIBED'},
    {text: 'Cleaned', payload: 'CLEANED'},
    {text: 'Unknown', payload: 'UNKNOWN'}
];