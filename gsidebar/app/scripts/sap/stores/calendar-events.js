import {createStore} from 'reflux';
import StoreStateMixin from 'core/mixins/store-state';
import {saveToLocalStorage, getLocalStorage} from 'lib/comms';
import CalendarEventActions from 'sap/actions/calendar-events';
const lsKey = 'calendarEvents';

export default createStore({
    mixins: [StoreStateMixin],
    listenables: [CalendarEventActions],
    init() {
        this._getEventsFromLS();
    },
    getInitialState() {
        return {
            calendarEvents: {}
        }
    },
    _getEventsFromLS() {
        return getLocalStorage({
            key: lsKey
        }).then(res => res.data)
        .then(calendarEvents => this.setState({calendarEvents}))
    },
    onLoadCalendarEventIds() {
        this._getEventsFromLS();
    },
    saveToLS(event, activity) {
        var eid = getQueryParameters(event.htmlLink.split('?').pop()).eid;
        this._getEventsFromLS().then(res => {
            var events = res || {};
            events[eid] = activity.id;
            saveToLocalStorage({
                key: lsKey,
                value: events
            })
            this.setState({
                calendarEvents: events
            });
        });
    }
})