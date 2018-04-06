import {getEmailFromDom} from 'lib/utils';

var email;

const send = (req) => {
    email = req.username = email || getEmailFromDom();
    return new Promise((resolve, reject ) => {
        chrome.runtime.sendMessage(req, function(response) {
            if (response.result === undefined) {
                //log('[missing result in response - ' + msg.action + ']', response);
            }
            if (response.data === undefined) {
                //log('[missing data in response - ' + msg.action + ']', response);
            }
            // that.hideLoading();

            if (response && response.result === 'KO' && response.exception) { // generic 'KO' response handling. (eg. for logging or tracking)
                //handleExceptions(msg, response.exception);
            }

            if (!response || (response && (response.result === 'KO' || response.result === 'undefined_gapi') )) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    })
}

export default { send }
export const ajaxCall = (params) => send({action: 'ajax_call', data: params});
export const getLocalStorage = (params) => send({action: 'get_from_localstorage', data: params});
export const saveToLocalStorage = (params) => send({action: 'save_to_localstorage', data: params});
export const rpcSend = (params) => send({action: 'rpc_request', data: params});
export const ping = () => send({ action: 'ping', data: {} });