import {BASE_URL, default as baseApi} from 'sap/api/base';
import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

import {showNotification} from 'core/actions/notification';

const EMAIL_ACTIVITY_URL = BASE_URL + 'EmailActivities';
const POST = 'POST';

const api = {
    getEmailActivities() {
        return baseApi.apiCall({
            url: EMAIL_ACTIVITY_URL,
            data: {
                expand: 'activityCustomers',
                // orderby: 'creation desc'
            }
        });
    },
    createEmailActivity(act) {
        return new Promise((resolve, reject) => {
            baseApi.apiCall({
                url: EMAIL_ACTIVITY_URL,
                type: POST,
                data: JSON.stringify(act)
            }).then(id => resolve({id, ...act}), reject)
        })
    },
    quickSave(act, emails) {
        act.activityCustomers = act.activityCustomers || [];
        var emailFilter = _.map(emails, e => `email eq '${e}'`).join(' or ');
        showNotification('Saving email to SAP Anywhere...');
        return ContactsApi.queryContacts(emailFilter).then(res => {
            _.each(res, c => {
                if (c.customer && c.customer.id !== undefined && c.customerId !== null && !_.find(act.activityCustomers, cl => cl.customerId === c.customerId)) {
                    act.activityCustomers.push({ customerId: c.customer.id });
                }
            });
            return CustomersApi.queryCustomers(emailFilter)
        }).then(customers => {
            _.each(customers, c => {
                if (!_.find(act.activityCustomers, cl => cl.customerId === c.id)) {
                    act.activityCustomers.push({ customerId: c.id });
                }
            });
            return this.createEmailActivity(act)
        }).then(res => {
            showNotification('Email has been saved to SAP Anywhere.');
            return Promise.resolve(res);
        }, err => {
            showNotification('Failed to save email to SAP Anywhere');
            return Promise.reject(err);
        })
    }
}
export default api;
