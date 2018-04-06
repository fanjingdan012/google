import lsStore from './ls-store';
import UserAccounts from './user-accounts';

const KO = data => ({result: 'KO', data});
const OK = data => ({result: 'OK', data});

const setToken = (token, username) => UserAccounts.set({sap_a_t:token}, username);
const getToken = username => {
    var accnt = UserAccounts.get(username)
    var userToken = accnt && accnt['sap_a_t'];
    return userToken;
}
export default {
    sap_get_auth(msg, callback) {
        var {appId, appSecret, refreshToken, oauthUrl} = msg.data;
        return new Promise((resolve, reject) => {
            if (!appId) {
                callback && callback(KO({}))
                reject({});
                return;
            }
            var data = {
                url: oauthUrl,
                data: {
                    client_id: appId,
                    client_secret: appSecret,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }
            }
            this.sap_api_call({data}).then(function (res) {
                setToken(res.access_token, msg.username);
                callback && callback(OK({access_token: res.access_token}));
                resolve(res);
            }).catch(function (err) {
                callback && callback(KO({}))
                reject(err);
            });
        })
    },
    sap_api_call: function(msg, callback) {
        var params = msg.data;
        var accessToken = getToken(msg.username);
        params.url += `?access_token=${accessToken}`;

        function makeRequest() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: params.type || 'GET',
                    url: params.url,
                    contentType: params.contentType || 'application/json',
                    dataType: params.dataType || 'json',
                    data: params.data || {},
                    cache: params.cache || false,
                    beforeSend: function(xhr) {
                        // xhr.setRequestHeader('Authorization', args.authorization);
                    },
                    success : function(res) {
                        // console.log('linkedin', res)
                        resolve(res);
                        callback && callback(OK(res));
                    },
                    error: function(err) {
                        reject(err);
                        callback && callback(KO(err));
                    }
                });
            })
        }

        return makeRequest();
                // .then(
                //     res => Promise.resolve(res),
                //     err => {
                //         // callback && callback(KO(err));
                //         if (err.status === 401 && err.statusText === 'Unauthorized' && params.url.indexOf(oauthUrl) === -1) {
                //             var data = lsStore.get(`config.${msg.username}`);
                //             return this.sap_get_auth({ data })
                //                 .then( makeRequest, err => Promise.reject(err) );
                //         }
                //         return Promise.reject(err);
                //     }
                // ).then(
                //     res => {
                //         callback && callback(OK(res));
                //         return Promise.resolve(res);
                //     },
                //     err => {
                //         callback && callback(KO(err));
                //         return Promise.reject(err);
                //     }
                // )
    },
};