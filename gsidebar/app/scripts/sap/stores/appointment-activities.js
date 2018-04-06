import Reflux from 'reflux';
import API from 'sap/api/appointment-activities';
import Actions from 'sap/actions/appointment-activities';

import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';

export default Reflux.createStore({
    listenables: [Actions, CustomerActions, ContactActions],
    init(){
        this.state = {
            activitiesLoaded: false,
            activities: [],

            visibleActivities: [],

            cardType: '',
            idFilter: null
        }
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.trigger(this.state);
    },
    onShowCustomer(id) {

        this.onActivityCardShow(id, 'customer')
    },

    onReloadContactPage() {
        this._onReloadPage();
    },
    onReloadCustomerPage() {
        this._onReloadPage();
    },
    _onReloadPage() {
        var { idFilter, cardType } = this.getState();
        this.setState({ activitiesLoaded: false, visibleActivities: [], activities: [] });
        this.onActivityCardShow(idFilter, cardType);
    },
    onShowContactPage(id) {
        this.onActivityCardShow(id, 'contact');
    },
    onActivityCardShow(id, type) {
        var {activities, activitiesLoaded, visibleActivities} = this.getState();
        if (activitiesLoaded) {
            var newState = this._getVisibleActivities(activities, type, id);
            this.setState(newState);
        } else {
            this._loadActivities()
                .then(activities => this._getVisibleActivities(activities, type, id))
                .then(newState => this.setState(newState), err => this.setState({activitiesLoaded: true}))
        }
    },
    _getVisibleActivities(activities, type, id) {
        var {visibleActivities} = this.getState();
        if (type === 'customer') {
            visibleActivities = _.filter(activities, act => act.activityCustomers.filter(cl => cl.customerId === id).length > 0)
        } else if (type === 'contact') {
            visibleActivities = _.filter(activities, act => _.find(act.participants, att => att.participantId === id && att.participantType === 'ContactPerson'))
        }

        return {
            visibleActivities,
            activities,
            activitiesLoaded: true,
            cardType: type,
            idFilter: id
        }
    },
    onCreateAppointmentActivityCompleted(act) {
        var {activities, cardType, idFilter} = this.getState();
        var newState = this._getVisibleActivities([...activities, act], cardType, idFilter);
        this.setState(newState);
    },
    onUpdateAppointmentActivityCompleted(act) {
        var {activities, cardType, idFilter} = this.getState();
        _.each(activities, old => {
            if (old.id === act.id) {
                _.extend(old, act)
            }
        });
        var newState = this._getVisibleActivities([...activities, act], cardType, idFilter);
        this.setState(newState);
    },
    _loadActivities() {
        return new Promise((resolve, reject) => {
            API.getAppointmentActivities()
            .then(resolve, reject)
        })
    }

})