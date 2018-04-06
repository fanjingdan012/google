import {rpcSend} from 'lib/comms';

const request = (api, params) => rpcSend({api, ...params});

export const getCalendarInfo = (eid) => {
    return {eventId : atob(eid).split(' ')[0], calendarId: '' };
}

export const getEventByEid = (eid) => {
    var {eventId} = getCalendarInfo(eid);
    return new Promise((resolve, reject) => {
        request('calendar.events.get', {
            calendarId: 'primary',
            eventId: eventId
        })
        .then(res => resolve({...res.data, eid}), reject)
    });
}

export const createCalendar = (params) => {
    return request('calendar.calendars.insert', params).then(res => res.data)
}

export const getCalendarList = () => {
    return request('calendar.calendarList.list', {})
}

export const createEvent = (calendarId, resource) => {
    return request('calendar.events.insert', {
        calendarId,
        resource
    }).then(res => res.data)
}
export const updateEvent = (calendarId, eid, resource) => {
    var {eventId} = getCalendarInfo(eid);
    return request('calendar.events.update', {
        calendarId,
        eventId,
        resource
    }).then(res => res.data)
}
export const getPrimaryCalendar = () => {
    return request('calendar.calendars.get', {
        calendarId: 'primary'
    })
}
export default {getEventByEid};