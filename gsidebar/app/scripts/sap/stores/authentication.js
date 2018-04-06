import Reflux from 'reflux';

import OauthAction from 'sap/actions/oauth';
import GmailActions from 'core/actions/gmail';
import AppActions from 'sap/actions/app';

import ConfigStore from 'sap/stores/config';
import {showNotification} from 'core/actions/notification';

var client_secret = '',
    refresh_token = '',
    client_id = '',
    accessToken;

ConfigStore.listen(function (config) {
    client_id = config.client_id;
    client_secret = config.client_secret;
    refresh_token = config.refresh_token;
});

const Authentication = Reflux.createStore({
    listenables: [AppActions, OauthAction],
    init() {
        this.state = {
            authStatus: 'authenticating', /// {authenticating, success, fail}
            credentials: {
                client_id: '',
                client_secret: '',
                refresh_token: ''
            },
            googleAuthStatus: 'failed'
        };
        this.setListeners();
    },
    setListeners() {
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.trigger(this.state);
    },
    onAppStart() {
        /// show auth page
        console.debug('app start');
        console.debug('authenticating...');

        OauthAction.TwoStepAuth(client_id, client_secret, refresh_token)
        .then(res => {
            console.debug('two step auth result', res);
        }, err => {
            console.debug('two step auth result', err);
        })

        this.setState({
            authStatus: 'authenticating',
            credentials: {
                client_id: client_id,
                client_secret: client_secret,
                refresh_token: refresh_token
            }
        });
    },
    onTwoStepAuthCompleted() {
        console.debug('authentication completed.');
        // this.setState({
        //  authStatus: 'success'
        // });
    },
    onTwoStepAuthFailed() {
        console.debug('authentication failed.');
        this.setState({
            authStatus: 'fail',
            credentials: {
                client_id: client_id,
                client_secret: client_secret,
                refresh_token: refresh_token
            }
        });
    },
    onGoogleSignIn() {
        this.setState({ googleAuthStatus: 'authenticating'})
    },
    onGoogleAuthCompleted(res) {
        this.setState({ googleAuthStatus: 'authenticated'})
    },
    onGoogleAuthFailed() {
        this.setState({ googleAuthStatus: 'failed'})
    },
    onGoogleSignInCompleted(res) {
        this.onGoogleAuthCompleted()
    },
    onGoogleSignInFailed(err) {
        this.onGoogleAuthFailed()
    }
});

export default Authentication;