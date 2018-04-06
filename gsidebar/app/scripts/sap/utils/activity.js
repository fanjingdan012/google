import {getEventByEid} from 'core/api/calendar';

import activityApi from 'sap/api/appointment-activities';
import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

export default {
    buildActivityFromEvent(event) {
        return new Promise((resolve, reject) => {
            var {attendees, end, start, summary, description} = event;
            var emailFilter = _.map(attendees, att => `email eq '${att.email}'`).join(' or ');
            var defaultPromise;
            if (!emailFilter) {
                defaultPromise = new Promise((resolve, reject) => {
                    resolve([]);
                })
            }
            var getCustomers = defaultPromise || CustomersApi.queryCustomers(emailFilter);
            var getContacts = defaultPromise || ContactsApi.queryContacts(emailFilter);

            var activity = {
                title: summary || 'Untitled event',
                content: description || '',
                startTime: moment(start.dateTime).toDate(),
                endTime: moment(end.dateTime).toDate(),
                activityCustomers: [],
                participants: [],
                type: 'APPOINTMENT'
            }

            Promise.all([
                getCustomers,
                getContacts
            ]).then(res => {
                var [customers, contacts] = res;
                var promise;
                activity.activityCustomers = _.map(customers, c => ({
                    customerId: c.id
                }));
                activity.participants = _.map(contacts, c=> ({
                    participantType: "ContactPerson",
                    participantId: c.id
                }));
                // if (activityId) {
                //     promise = activityApi.updateAppointmentActivity(activity);
                // } else {
                //     promise = activityApi.createAppointmentActivity(activity)
                // }
                resolve(activity);
                // promise.then(res => {
                //     res.eid = event.eid;
                //     showNotification('Saved to SAP Anywhere.');
                //     resolve(res);
                // }, err => {
                //     reject();
                //     console.log(err);
                //     showNotification('Saved to SAP Anywhere failed.');
                // });
            }, reject);
        })
    },
    createActivity(event) {
        return new Promise((resolve, reject) => {
            this.buildActivityFromEvent(event)
                .then(activity => activityApi.createAppointmentActivity(activity), err => { throw err; })
                .then(activity => resolve({...activity, eid: event.eid}), err => { throw err; })
                .catch(reject)
        });
    },
    updateActivity(event, oldActivity) {
        return new Promise((resolve, reject) => {
            this.buildActivityFromEvent(event,)
                .then(activity => activityApi.updateAppointmentActivity({...activity, id: oldActivity.id}), err => { throw err; })
                .then(activity => resolve({...activity, eid: event.eid}), err => { throw err; })
                .catch(reject);
        });
    }
}