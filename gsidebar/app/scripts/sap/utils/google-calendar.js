import {getCalendarList, createCalendar, createEvent, getPrimaryCalendar, updateEvent} from 'core/api/calendar';
import {getCurrentTimezone, getQueryParameters} from 'lib/utils';
import {saveToLocalStorage, getLocalStorage} from 'lib/comms';
import {showNotification} from 'core/actions/notification';

import CalendarEventActions from 'sap/actions/calendar-events';

import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

const SAP_CALENDAR = "SAP Anywhere";
const UTC = "UTC";
const lsKey = 'calendarEvents';
var calendars;
var primaryCalendar;



export default {
    getCalendars() {
        return new Promise((resolve, reject) => {
            resolve(calendars || getCalendarList())
        })
    },
    getPermaLink(eid) {
        return `https://calendar.google.com/calendar/event?eid=${eid}`;
    },
    createSAPCal() {
        createCalendar({
            summary: SAP_CALENDAR,
            timeZone: getCurrentTimezone()
        })
    },
    getSAPCalendar() {
        return new Promise((resolve, reject) => {
            this.getCalendars()
            .then(calendarList => _.find(cal => cal.summary === 'SAP_CALENDAR'))
            .then(sapCal => sapCal || this.createSAPCal())
        })
    },
    getPrimaryCalendar() {
        return new Promise((resolve, reject) => {
            resolve(primaryCalendar || getPrimaryCalendar().then(calendar => primaryCalendar = primaryCalendar));
        })
    },
    getEventsFromLs() {
        return getLocalStorage({
            key: lsKey
        }).then(res => res.data);
    },
    saveToLS(event, activity) {
        var eid = getQueryParameters(event.htmlLink.split('?').pop()).eid;
        this.getEventsFromLs().then(res => {
            var events = res || {};
            events[eid] = activity.id;
            saveToLocalStorage({
                key: lsKey,
                value: events
            }).then(res => CalendarEventActions.LoadCalendarEventIds())
        });
    },
    createEventFromActivity(activity) {
        showNotification('Saving to Google Calendar...');
        var promise, resource = {
            end: {
                dateTime: moment(activity.endTime).format(),
                timeZone: UTC
            },
            start: {
                dateTime: moment(activity.startTime).format(),
                timeZone: UTC
            },
            attendees: [],
            description: activity.content,
            summary: activity.title
        };
        var contactFilter = _.filter(activity.participants, att => att.participantType === "ContactPerson").map(att => `id eq ${att.participantId}`).join(' or ')
        var customerFilter = _.map(activity.activityCustomers, cl => `id eq ${cl.customerId}`).join(' or ');

        var requests = [];
        if (contactFilter) {
            requests.push(ContactsApi.queryContacts(contactFilter));
        }
        if (customerFilter) {
            requests.push(CustomersApi.queryCustomers(customerFilter));
        }
        if (requests.length === 0) {
            promise = createEvent('primary', resource);
        } else {
            promise = Promise.all(requests).then(res => {
                var emails = _.flatten(res).filter(c => c.email).map(c => c.email);
                resource.attendees = _.uniq(emails || []).map(email => ({email}) );
                return createEvent('primary', resource);
            })
        }
        return promise.then(res => {
            showNotification('Saved to Google Calendar.');
            this.saveToLS(res, activity);
            return res;
        }, err => {
            showNotification('Failed to save appointment to Google Calendar.')
            return Promise.reject(err);
        })
    },
    updateEventFromActivity(eid, activity) {
        if (!eid) {
            return this.createEventFromActivity(activity);
        }
        var promise, resource = {
            end: {
                dateTime: moment(activity.endTime).format(),
                timeZone: UTC
            },
            start: {
                dateTime: moment(activity.startTime).format(),
                timeZone: UTC
            },
            attendees: [],
            description: activity.content,
            summary: activity.title
        };
        var contactFilter = _.filter(activity.participants, att => att.participantType === "ContactPerson").map(att => `id eq ${att.participantId}`).join(' or ')
        var customerFilter = _.map(activity.activityCustomers, cl => `id eq ${cl.customerId}`).join(' or ');

        var requests = [];
        if (contactFilter) {
            requests.push(ContactsApi.queryContacts(contactFilter));
        }
        if (customerFilter) {
            requests.push(CustomersApi.queryCustomers(customerFilter));
        }
        if (requests.length === 0) {
            promise = updateEvent('primary', resource);
        } else {
            promise = Promise.all(requests).then(res => {
                var emails = _.flatten(res).filter(c => c.email).map(c => c.email);
                resource.attendees = _.uniq(emails || []).map(email => ({email}) );
                return updateEvent('primary', eid, resource);
            })
        }
        return promise.then(res => {
            this.saveToLS(res, activity);
            return res;
        })
    }
}