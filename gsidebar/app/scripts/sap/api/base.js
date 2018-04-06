import ConfigStore from 'sap/stores/config';
import {saveToLocalStorage, getFromLocalStorage} from 'lib/comms';
import Comms from 'lib/comms';


const OAUTH_URL = 'https://eap-idp-us.sapanywhere.com:443/sld/oauth2/token';
export const BASE_URL = 'https://api-us.sapanywhere.com:443/v1/';

var client_secret = '',
    refresh_token = '',
    client_id = '',
    accessToken;

ConfigStore.listen(function (config) {
    client_id = config.client_id;
    client_secret = config.client_secret;
    refresh_token = config.refresh_token;
})

const parseErr = (err) => {
    if (err.responseJSON) {
        return err.responseJSON;
    }
    try {
        return JSON.parse(err.responseText);
    } catch(e) {
        return err;
    }
}

export default {
    getAuth: function (appId=client_id, appSecret=client_secret, refreshToken=refresh_token) {
        // return new Promise((resolve, reject) => {
        //     if (!appId) {
        //         OauthActions.OauthFailed();
        //         reject();
        //         return;
        //     }
        //     this.apiCall({
        //         url: OAUTH_URL,
        //         data: {
        //             client_id: appId,
        //             client_secret: appSecret,
        //             grant_type: 'refresh_token',
        //             refresh_token: refreshToken
        //         }
        //     }).then(function (res) {
        //         accessToken = res.access_token;
        //         console.log(res);
        //         resolve(res);
        //     }).catch(function (err) {
        //         console.log(err);
        //         reject(err);
        //     });
        // }.bind(this))
        return new Promise((resolve, reject) => {
            Comms.send({
                action: 'sap_get_auth',
                data: {appId, appSecret, refreshToken, oauthUrl: OAUTH_URL}
            }).then(resolve,reject).catch(reject);
        })
    },
    apiCall: function(params) {
        // if (!accessToken && params.url !== OAUTH_URL) {
        //     return new Promise((resolve, reject) => {
        //         this.getAuth()
        //         .then(res => {
        //             setTimeout(() => {
        //                 this.apiCall(params).then(resolve).catch(reject);
        //             }.bind(this), 500);
        //         }.bind(this)).catch(reject)
        //     }.bind(this))
        // }
        // // var args = _.extend( {access_token: accessToken}, params.data || {});
        // // params.url = `${params.url}?access_token=${accessToken}`;
        // params.url += `?access_token=${accessToken}`;
        // return new Promise((resolve, reject) => {
        //     $.ajax({
        //         type: params.type || 'GET',
        //         url: params.url || BASE_URL,
        //         contentType: params.contentType || 'application/json',
        //         dataType: params.dataType || 'json',
        //         data: params.data || {},
        //         cache: params.cache || false,
        //         beforeSend: function(xhr) {
        //             // xhr.setRequestHeader('Authorization', args.authorization);
        //         },
        //         success : function(res) {
        //             // console.log('linkedin', res)
        //             resolve(res)
        //         },
        //         error: function(err) {
        //             reject(err);
        //         }
        //     });
        // })
        const makeRequest = () => {
            return Comms.send({
                action: 'sap_api_call',
                data: params
            });
        }
        return makeRequest()
            .then(
                null,
                err => {
                    var data = err.data;
                    if (data.status === 401 && data.statusText === 'Unauthorized') {
                        return this.getAuth().then(
                                makeRequest,
                                err => Promise.reject(err) // failed to renew access token. invalid credential
                            );
                    }
                    return Promise.reject(err);
                }
            ).then(
                res => Promise.resolve(res.data),
                err => Promise.reject(err && (err.data && parseErr(err.data)) || err.data),
            );
        // return new Promise((resolve, reject) => {
        //     Comms.send({
        //         action: 'sap_api_call',
        //         data: params
        //     }).then(res => resolve(res.data))
        //     .catch(err => reject((err.data && parseErr(err.data)) || err.data))
        // });
    },
    getToken() {
        return accessToken;
    }
};



