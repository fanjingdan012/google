import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import Form from 'core/components/form';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import LinearProgress from 'material-ui/lib/linear-progress';
import {default as Api, TYPE_OPTIONS} from 'sap/api/appointment-activities';
import Actions from 'sap/actions/appointment-activities';
import FormModal from 'sap/components/modals/form';
import AttendeeLines from 'sap/components/forms/fields/AttendeeLines';
import CustomerField from 'sap/components/forms/fields/CustomerField';
import calendarUtil from 'sap/utils/google-calendar';
import {showNotification} from 'core/actions/notification';

class CreateAppointment extends FormModal {
    constructor(props) {
        super(props);
        this.columns = 1;
    }
    getFields() {
        // var toggleStyle = {
        //     width: 220,
        //     paddingTop: 10
        // }
        var cbStyle = { paddingTop: 8 };
        var saveToCal = this.isEdit() ? !!this.props.eventId : true;
        return {
            startTime: { label: 'Start Time', type: 'datetime' },
            endTime: { label: 'End Time', type: 'datetime' },

            activityCustomers: {  label: 'Customers', component: CustomerField, props: { multi: true } },
            participants: { label: 'Participants', component: AttendeeLines },

            type: { label: 'Type', type: 'select', options: TYPE_OPTIONS, props: { fullWidth: false } },
            title: { label: 'Title' },
            content: { label: 'Content', type: 'textarea' },
            // completed: { label: 'Complete', type: 'checkbox' },
            saveToCal: { label: 'Save to Google Calendar', type: 'checkbox', props: { style: cbStyle, defaultChecked: saveToCal } },
        };
    }
    getTitle() {
        return this.isEdit() ? 'Edit Appointment' : 'Create Appointment';
    }
    isEdit() {
        return this.props.model && !_.isNull(this.props.model.id) && !_.isUndefined(this.props.model.id);
    }
    onSubmit(data) {
        var { saveToCal, ...activity } = data;
        activity.id = this.props.model.id;
        var promise = new Promise((resolve, reject) => {
            return this.isEdit() ?
                Actions.UpdateAppointmentActivity(activity)
                    .then(resolve, reject)
                : Actions.CreateAppointmentActivity(activity)
                    .then(resolve, reject);
        });
        promise
            .then( res => {
                this.onRequestSuccess();
                return Promise.resolve(res);
            }, err => {
                this.onRequestFail();
                showNotification(err.message);
                return Promise.reject(err);
            })
            .then( res => {
                if (saveToCal) {
                    return calendarUtil.updateEventFromActivity(this.props.eventId, res);
                }
                return Promise.resolve(res);
            });
    }
}

export default CreateAppointment;
