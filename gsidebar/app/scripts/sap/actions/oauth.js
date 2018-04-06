import Reflux from 'reflux';
import {BASE_URL, default as SapApi} from 'sap/api/base';
import Comms from 'lib/comms';

const Actions = Reflux.createActions({
    SapAuth: {asyncResult: true},
    GoogleAuth: {asyncResult: true},
    GoogleSignIn: {asyncResult: true},
    TwoStepAuth: {asyncResult: true},

});

Actions.SapAuth.listenAndPromise(function() {
    return SapApi.getAuth.apply(SapApi, arguments);
});

Actions.GoogleAuth.listenAndPromise(function() {
    return Comms.send({ action: 'get_auth_token', data: {} });
})

Actions.TwoStepAuth.listenAndPromise(function() {
    return Promise.all([
        Actions.SapAuth.apply(Actions.SapAuth, arguments),
        Actions.GoogleAuth()
    ]);
});

Actions.GoogleSignIn.listenAndPromise(function() {
    return Comms.send({ action: 'oauth_login', data: {} });
})
export default Actions;




