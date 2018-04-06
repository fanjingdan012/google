import Reflux from 'reflux';
import GmailActions from 'core/actions/gmail';

const GmailConnActions = Reflux.createActions([
    'GmailConnInboxOpen',
    'GmailConnStart',
    'GmailConnInboxStart',
    'GmailConnEmailStart',
    'GmailConnThreadOpen',
    'GmailConnEmailSent',
    'DrivePickerResult'
]);

var Connector = {};
function getEventName(event) {
    return 'WIZY:Extension:listener:' + event;
}
Connector.actions = {

    gmailjs_start: function(data) {

        console.log('GmailConn - gmailjs_start');

        GmailConnActions['GmailConnStart']();

        if (data.visible_emails) {
            GmailConnActions['GmailConnInboxStart'](data.visible_emails);
        }

        if (data.email_data && !$.isEmptyObject(data.email_data)) {
            GmailConnActions['GmailConnEmailStart'](data.email_data);
        }

    },

    visible_emails: function(res) {

        GmailConnActions['GmailConnInboxOpen'](res);

    },
    open_email: function (res) {
        GmailConnActions['GmailConnThreadOpen'](res);
    },
    displayed_email_data: function(res) {
        GmailConnActions['GmailConnEmailStart'](res);
        GmailConnActions['GmailConnThreadOpen'](res);

    },

    email_sent: function(data) {

        GmailConnActions['GmailConnEmailSent'](data);

    },
    drive_picker_result: function(data) {
        // console.debug(data);
        GmailConnActions['DrivePickerResult'](data);
    }
};

window.addEventListener("message", function(event) {

    if(event.source != window) return;
    if(!event.data.type) return;
    if(!/WIZY:Gmail:listener/.test(event.data.type)) return;
    var eventName = event.data.type.substr(20);
    //console.log('eventname', event.data.type, event.data.data);
    if (Connector.actions[eventName]) {
        Connector.actions[eventName].apply(self, [event.data.data]);
    }

}, false);


export const GmailConnectorStore = Reflux.createStore({

    listenables: [GmailActions],

    // onLoginSuccess: function() {
    //     console.log('GmailConnector - injecting gmail.js');
    //     var self = this;
    //     if (WizyDeployment !== 'min') {
    //         yepnope({
    //             load: [
    //                 chrome.extension.getURL("lib/vendors/jquery-2.1.3.js"),
    //                 chrome.extension.getURL("lib/gmail.js"),
    //                 chrome.extension.getURL("src/gmail_script.js"),
    //                 chrome.extension.getURL("lib/materialize/js/materialize.js")
    //             ],
    //             callback: {
    //                 'gmail_script.js' : self.onGmailScriptsInjected
    //             }
    //         });
    //     }else {
    //         yepnope({
    //             load: [
    //                 chrome.extension.getURL("wgs.min.js"),
    //             ],
    //             callback: self.onGmailScriptsInjected
    //         });
    //     }


    // },
    // onGmailScriptsInjected: function() {
    //     // re apply hash to trigger hash change
    //     var view = this.getCurrentView();
    //     Actions.Gmail['GmailViewChange']({view_type: view})
    // },
    getCurrentView: function() {
        if ($('div.Cq.RdSZF').length > 0 || $('div.A1.D.E').length > 0 || $('div[gh=tl]').length > 0) {
            return 'list';
        } else if ($('.nH.qZ.G-atb').length > 0) {
            return 'settings';
        } else if ($('table.Bs.nH.iY').length > 0) {
            return 'conversation';
        } else if ($('div.fN').length > 0) {
            return 'compose';
        } else {
            return null;
        }
    },
    onGmailViewChange: function(params) {

        console.log('GmailConn - ViewChange', params.view_type);
        var view_type = params.view_type,
        action = 'displayed_email_data';
        if (view_type === 'list'
                // && location.hash.indexOf('inbox') !== -1
            ) {
            //Ext.Email._threadData = null;
            action = 'get_visible_emails';
            this.postMessage(action, {});
        }

    },
    postMessage: function(action, params) {
        window.postMessage({
          type: getEventName(action),
          data: params
        }, "*");
    },
    onGmailConnPostMsg: function(action , params) {
        this.postMessage(action, params);
    }


});

export default GmailConnActions;
