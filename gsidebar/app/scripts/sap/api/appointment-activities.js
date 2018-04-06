import {BASE_URL, default as api} from 'sap/api/base'

const APPOINTMENT_ACTIVITIES_BASE_URL = BASE_URL + 'AppointmentActivities';

export default {
    getAppointmentActivities() {
        return api.apiCall({
            url: APPOINTMENT_ACTIVITIES_BASE_URL,
            data: {
                expand: 'activityCustomers, participants',
                orderby: 'startTime desc desc'
            }
        })
    },
    createAppointmentActivity(activity) {
        return new Promise((resolve, reject) => {
            api.apiCall({
                url: APPOINTMENT_ACTIVITIES_BASE_URL,
                type: 'POST',
                data: JSON.stringify(activity)
            }).then(id => resolve({...activity, id}), reject)
        })
    },
    updateAppointmentActivity(activity) {
        return new Promise((resolve, reject) => {
            api.apiCall({
                url: APPOINTMENT_ACTIVITIES_BASE_URL + '/' + activity.id,
                type: 'PATCH',
                data: JSON.stringify(activity),
                dataType: 'text'
            }).then(res => resolve(activity), err => {
                if (err.message) {
                    reject(err);
                } else {
                    reject(JSON.parse(err.responseText));
                }
            });
        })
    }
}

export const TYPE_OPTIONS =[
    {text: 'Appointment', payload: 'APPOINTMENT'},
    {text: 'Daily', payload: 'DAILY'},
    {text: 'Weekly', payload: 'WEEKLY'},
]