'use strict';

// Enable chromereload by uncommenting this line:
import './lib/livereload';
import SendMessage from './background/sendmessage';
import Background from './background/background-api';
import SapApi from './background/sap-api';
import $ from 'jquery';
import _ from 'underscore';
import 'moment-timezone';
import loadGapi from './background/load-gapi';

_.extend(Background, SapApi);

window.moment = moment;
window.Background = Background;
window.$ = $;
window._ = _;
var _TABS = [];
function onMessage(msg, sender, sendResponse) {
    var query_data, data;

    if (_TABS.indexOf(sender.tab.id) === -1) {
        // monitor current tabs
        _TABS.push(sender.tab.id);
    }

    //console.log(msg.action);

    if (msg.action === 'initialize') {
        var isFirstUse = false;
        lscache.flush();
    } else {
        // if (typeof gapi === 'undefined' && msg.action === 'identity_check') {
        //     loadGapi();
        //     sendResponse({
        //         'result' : 'undefined_gapi',
        //     })
        //     return;
        // }
        if (Background[msg.action] === undefined) {
            //console.log(msg.action + ' is not yet supported by the ' + CRM + ' library');
            sendResponse({
                'result': 'KO'
            });
            return true;
        }
        // if (msg.username) {
        //     Background.currentUser = {email: msg.username};
        // }
        Background[msg.action](msg, sendResponse);
        return true;
    }
}
function onUpdateAvailable(details) {
    console.debug('installed ', details);
    if (details.reason === 'install') {
        chrome.tabs.query({url:"*://mail.google.com/*"}, function(tabs) {
            if (!tabs.length) {
                Background._create_tab('https://mail.google.com/');
            }
        });
    }
}
if (!chrome.runtime.onMessage && __ENV__ === 'development') {
    window.location.reload();
}
chrome.runtime.onMessage.addListener(onMessage);
try {
    chrome.runtime.onInstalled.addListener(onUpdateAvailable);
} catch (err) {
    //console.log('chrome.' + runtimeOrExtension + ' not supported on this version.');
}

loadGapi().then(() => {
    Background.load_calendar_api({}, function () {} );
})


