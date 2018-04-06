import Reflux from 'reflux';
import {getLocalStorage, saveToLocalStorage} from 'lib/comms';
import ConfigActions from 'sap/actions/config';

import {getEmailFromDom} from 'lib/utils';

export default Reflux.createStore({
    listenables: [ConfigActions],
    init() {
        this.state = {
            instanceUrl: '',
            client_id: '',
            client_secret: '',
            refresh_token: '',
            save_outgoing_emails: true
        },

        this.userEmail = null;

        this.trigger(this.getState());
        // this.getConfigFromLS();
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.saveConfigToLS();
        this.trigger(this.getState());
    },
    getConfigKey() {
        this.userEmail = this.userEmail || getEmailFromDom();
        return `config.${this.userEmail}`;
    },
    getConfigFromLS() {
        var self = this;
        this.userEmail = this.userEmail || getEmailFromDom();
        return getLocalStorage({ key: this.getConfigKey() }).then(res => self.onSetConfig(res.data));
    },
    saveConfigToLS() {
        saveToLocalStorage({ key: this.getConfigKey(), value: this.getState() })
    },
    onSetConfig(newConfig) {
        this.setState(newConfig);
    }
})