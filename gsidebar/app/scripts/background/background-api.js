import {OAUTH_URL} from './credentials';
import lsStore from './ls-store';
const OK = 'OK';
const KO = 'KO';

import UserAccounts from './user-accounts';

// console.log(UserAccounts)

export default {
    _get_auth_token(options) {
        return new Promise((resolve, reject) => {
          var oauth_url = OAUTH_URL + '&immediate=';
            if ('immediate' in options) {
                oauth_url += options.immediate;
            } else {
                oauth_url += 'true';
            }
            if (options.login) {
                oauth_url += '&login_hint=' + options.login;
            }

            $.get(oauth_url, function(res) {
                // var $page = $(res.split('</head>')[1].replace(/<[img|IMG][^>]*>/g, ''));
                var $nodes = $.parseHTML(res), token;
                $nodes.forEach(function(node) {
                    if (node.id === "response-form-encoded") {
                        var params = {}, queryString = node.value,
                        regex = /([^&=]+)=([^&]*)/g, m;
                        while (m = regex.exec(queryString)) {
                          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                        }
                        token = params['access_token'];
                    }
                });
                if (token) {
                    resolve(token);
                } else {
                    reject(null);
                }
            });
        });
    },
    get_auth_token(msg, callback) {
        this._get_auth_token({immediate: true, login: msg.username})
        .then(token => callback( {result: OK, data: {token} } ), err => callback( {result: KO, data: err} ))
    },
    open_window(msg, callback) {
        var self = this;
        var height = 500, width = 800;
        if (msg.data.height) {
            height = msg.data.height;
        }
        if (msg.data.width) {
            width = msg.data.width;
        }
        chrome.windows.create({url: msg.data.url, type: msg.data.type, width: parseInt(width, 10), height: parseInt(height, 10)}, function(w) {
            //console.log('window twitter', w);
            chrome.windows.onRemoved.addListener(function(popup_id) {
                if ((popup_id === w.id || popup_id === self.approvalWindowId) && callback) {
                    callback({
                        result: 'OK',
                        data: {}
                    });
                }
            });
        });
    },
    close_oauth_window(msg, callback) {
        chrome.tabs.query({url: "https://accounts.google.com/o/oauth2/approval*"}, function(tabs) {
            _.each(tabs, function(tab) {
                chrome.tabs.remove(tab.id, function() {});
            });
        });
    },
    oauth_login(msg, callback) {
        var self = this;
        var options = {
            url: OAUTH_URL + '&immediate=false&login_hint=' + msg.username,
            height: 600,
            type: 'popup',
        };
        msg.data = options;
        this.open_window(msg,
            res => this._get_auth_token({immediate: true, login: msg.username})
                .then(this._setGoogleAccessToken, err => {throw err})
                .then(token => callback({ result: OK, data: { token } }))
                .catch(err => callback({ result: KO, data: {} }))
        )
    },
    _getGoogleAccessToken(username) {
        var accnt = UserAccounts.get(username)
        var userToken = accnt && accnt['google_a_t'];
        return userToken;
    },
    _setGoogleAccessToken(token, username) {
        UserAccounts.set({google_a_t:token}, username);
        return token;
        // this.googleAccessToken = token;
    },
    ajax_call(msg, callback) {
        var params = msg.data;
        $.ajax({
            method: params.type || 'GET',
            url: params.url || BASE_URL,
            contentType: params.contentType || 'application/json',
            dataType: params.dataType || 'json',
            data: params.data || {},
            cache: params.cache || false,
            traditional: true,
            beforeSend: function(xhr) {
                // xhr.setRequestHeader('Authorization', args.authorization);
            },
            success : function(res) {
                // console.log('linkedin', res)
                callback({
                    result: OK,
                    data: res
                });
            },
            error: function(err) {
                callback({
                    result: KO,
                    data: err
                });
            }
        });
    },
    save_to_localstorage(msg, callback) {
        lsStore.set(msg.data.key, msg.data.value);
        callback({
            result: OK
        });
    },
    get_from_localstorage(msg, callback) {
        callback({
            result: OK,
            data: lsStore.get(msg.data.key)
        });
    },
    load_calendar_api(msg, callback) {
        if (!gapi.client.calendar) {
            gapi.client.load('calendar', 'v3', res => callback({result: OK, data: res}));
        } else {
            callback({result: OK, data: {}});
        }
    },
    rpc_request(msg, callback) {
        var {data, username} = msg;
        var {api, ...params} = data;
        var userToken = this._getGoogleAccessToken(username);
        gapi.auth.setToken({access_token: userToken});

        var apiToCall = gapi.client;

        var methods = api.split('.');
        _.each(methods, m => {
            apiToCall = apiToCall[m] ;
        });

        apiToCall(params).execute((res) => {
                if (!res.error) {
                    callback({
                        result: OK,
                        data: res
                    });
                } else {
                    if (res && res.error && (res.error.code === 401 || res.error.code === 403) ) {
                        this._get_auth_token({immediate: true, login: username}).then(token => {

                            // self.lsStore('set', 'a_t.'+self.currentUser.email, token);
                            // UserAccounts.set({a_t:token}, username);
                            this._setGoogleAccessToken(token, username);

                            gapi.auth.setToken({access_token: token});
                            apiToCall(params).execute(function(res) {
                                if (!res.error) {
                                    callback({
                                        result: OK,
                                        data: res
                                    });
                                } else {
                                    callback({
                                        result: KO,
                                        exception: {
                                            code: res.error.code,
                                            message: res.data[0].message,
                                            type: res.data[0].reason
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        callback({
                            result: KO,
                            exception: {
                                code: res.error.code,
                                message: res.data && res.data[0] ? res.data[0].message : res.message || "",
                                type: res.data && res.data[0] ? res.data[0].reason : res.reason || ""
                            }
                        });
                    }
                }
            });
    },
    get_gcontact_photo(msg, callback) {
        var photoDataUrl, photo_url;
        if (!msg.data.contact) {
            callback({
                result: 'OK',
                data: 'https://plus.google.com/u/0/_/focus/photos/private/nophotofound?sz=48'
            });
            return;
        }
        msg.data.contact.link && msg.data.contact.link.forEach(l => {
            if (l.type === 'image/*') {
                photo_url = l.href.replace('googleapis', 'google')+'?v=3.0';
            }
        });

        if (!photo_url) {
            callback({
                result: 'OK',
                data: 'https://plus.google.com/u/0/_/focus/photos/private/nophotofound?sz=48'
            });
           return;
        }

        var token = gapi.auth.getToken().access_token;

        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', photo_url ,true);

        // Must include this line - specifies the response type we want
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e) {

            var arr = new Uint8Array(this.response);
            var raw = String.fromCharCode.apply(null,arr);

            switch(xmlHTTP.status) {
                case 200:
                    var b64=btoa(raw),
                    photoDataUrl="data:image/png;base64," + b64;
                    // console.log('with photo - ' +  msg.data.gcontact.gd$email[0].address, photo_url, msg.data.gcontact);
                    // msg.data.gcontact.photoDataUrl = photoDataUrl;
                    // deferred.resolve(photoDataUrl)
                    break;
                default:
                    // console.log('no photo - ' +  msg.data.gcontact.gd$email[0].address, photo_url, msg.data.gcontact);
                    photoDataUrl = 'https://plus.google.com/u/0/_/focus/photos/private/nophotofound?sz=48';
            }

            callback({
                result: 'OK',
                data: photoDataUrl
            });
        };
        xmlHTTP.setRequestHeader('Authorization', 'Bearer '+ token);
        xmlHTTP.send();
    },

    base_gcontact_request(msg, callback) {
        gapi.auth.setToken({access_token: this._getGoogleAccessToken(msg.username)});
        this._gcontact_request(msg.data)
            .then(
                res => callback({result: OK, data: res}),
                err => {
                    if (err && err.error && err.error.code === 401) {
                        this._get_auth_token({immediate: true, login: msg.username})
                            .then(token => {
                                this._setGoogleAccessToken(token, msg.username);
                                gapi.auth.setToken({access_token: token});
                                this._gcontact_request(msg.data)
                                    .then(
                                        data => callback({result: OK, data}),
                                        data => callback({result: KO, data}))
                            }, err => callback({result: KO, data: err}))
                    } else {
                        callback({result: KO, data: err});
                    }
                }
            ).catch(err => console.log('err', err))
    },
    _gcontact_request(data) {
        return new Promise((resolve, reject) => {
            var headers = _.extend({
                "GData-Version": '3.0'
            }, data.headers);
            var reqParam = {
                method : data.method || 'GET',
                path: data.path || 'm8/feeds/contacts/default/full',
                body: data.body || {},
                params: data.params || {},
                headers: headers,
                callback: res => {
                    if (data.method === 'DELETE' && res === undefined) {
                        resolve(res);
                    }
                    if (res && res.error && res.error.code === 401) {
                        reject(res);
                    } else if (res.error || res.errors) {
                        reject(res);
                    } else if (res === false ) {
                        reject(res)
                    } else {
                        resolve(res);
                    }
                }
            }
            if (data.method === 'DELETE') {
                delete reqParam['body'];
            }
            gapi.client.request(reqParam);
        });
    },
    ping(msg, callback) {
        callback({ result: 'OK' });
    }

}