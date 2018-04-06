import Reflux from 'reflux';
import GmailActions from 'core/actions/gmail';
import {getQueryParameters} from 'lib/utils';
const CalendarConnActions = Reflux.createActions([
    // inbound
    'ObserveUrl',

    // outbound -- calendar page requests
    'CalendarConnEventCreated',
    'CalendarConnEventUpdated'

]);

var Connector = {};
function getEventName(event) {
    return 'WIZY:Extension:listener:' + event;
}
Connector.actions = {
    init() {
        this.observeUrl('event', 'POST', {after: 'onPostEvent'})
    },
    onPostEvent(xhr) { // post request for calendar event ig. create/update event event
        var request = getQueryParameters(xhr.xhrParams.body);
        if (request.action === 'EDIT') {
            CalendarConnActions.CalendarConnEventUpdated(request.eid, xhr);
        } else if (request.action === 'CREATE') {
            var eid = xhr.responseText.split(',')[1].replace(/'/g,"");
            CalendarConnActions.CalendarConnEventCreated(eid, xhr);
        }
    },
    observeUrl(url, method, eventNames) {
        this.postMessage('observeUrl', { url, method, eventNames});
    },
    postMessage(action, params) {
        window.postMessage({
          type: getEventName(action),
          data: params
        }, "*");
    }
};



window.addEventListener("message", function(event) {
    if(event.source != window) return;
    if(!event.data.type) return;
    if(!/WIZY:Calendar:listener/.test(event.data.type)) return;
    var eventName = event.data.type.substr(23);
    if (Connector.actions[eventName]) {
        Connector.actions[eventName].apply(self, [event.data.data]);
    }

}, false);


yepnope({
    load: [
        chrome.extension.getURL("scripts/calendar-page.js"),
    ],
    callback: () => setTimeout(Connector.actions.init.bind(Connector.actions), 300)
});

export default CalendarConnActions;