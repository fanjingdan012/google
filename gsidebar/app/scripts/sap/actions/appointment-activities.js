import Reflux from 'reflux';
import ModalActions from 'core/actions/modal';
import React from 'react';
// import CreateAppointmentModal from 'sap/components/modals/CreateAppointment';
import api from 'sap/api/appointment-activities';

const ACTIONS = Reflux.createActions([
    'LoadAppointmentActivities',
])

ACTIONS.CreateAppointmentActivity = Reflux.createAction({children: ["completed","failed"]});

ACTIONS.CreateAppointmentActivity.listenAndPromise(api.createAppointmentActivity);


ACTIONS.UpdateAppointmentActivity = Reflux.createAction({ children: ["completed", "failed"]})
ACTIONS.UpdateAppointmentActivity.listenAndPromise(api.updateAppointmentActivity);

export default ACTIONS;
