import xhrWatcher from './xhr_watcher';



class CalendarClient {

    constructor() {
        this.xhrs = []; // xhrs to observe
        this.beforeRequest = this.beforeRequest.bind(this);
        this.afterRequest = this.afterRequest.bind(this);
    }

    start() {
        xhrWatcher(this.beforeRequest, this.afterRequest);
    }

    getListenerParams(url, method) {
        return _.find(this.xhrs, xhr => xhr.method === method && xhr.url === url)
    }

    beforeRequest(xhrParams) {
        if (xhrParams) {
            var listenerParams = this.getListenerParams(xhrParams.url, xhrParams.method);
            if (listenerParams && listenerParams.method === xhrParams.method
                    && listenerParams.eventNames.before) {
                this.postMessage(listenerParams.eventNames.before,  _.extend({}, xhrParams))
            }
        }
    }

    afterRequest(xhr) {
        if (xhr && xhr.xhrParams) {
            var xhrParams = xhr.xhrParams;
            var listenerParams = this.getListenerParams(xhrParams.url, xhrParams.method);
            if (listenerParams && listenerParams.method === xhrParams.method
                    && listenerParams.eventNames.after) {
                this.postMessage(listenerParams.eventNames.after, _.extend({}, xhr))
            }
        }
    }

    observeUrl(data) {
        // data = {url, eventNames: { before, after }, method}
        this.xhrs.push(data)
    }

    postMessage(eventName, data) {
        window.postMessage({
            type: this.eventNameFor(eventName),
            data: data
        }, "*");
    }

    eventNameFor(eventName) {
        return "WIZY:Calendar:listener:" + eventName;
    }
}

$(function() {
    var calenderClient = new CalendarClient();
    calenderClient.start();
    // listener to messages coming from the extension
    window.addEventListener("message", function(event) {
      if(event.source != window) return;
      if(!event.data.type) return;
      if(!/WIZY:Extension:listener/.test(event.data.type)) return;
      var eventName = event.data.type.substr(24);
      if (calenderClient[eventName]) {calenderClient[eventName](event.data.data); }
  }, false);
});
