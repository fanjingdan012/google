import Reflux from 'reflux';

import AppActions from 'sap/actions/app';

export default Reflux.createStore({
    init() {
        this.state = {
            sections: [
                {
                    name: 'Customers',
                    route: 'customers'
                },
                {
                    name: 'Contacts',
                    route: 'contacts'
                },
                {
                    name: 'Opportunities',
                    route: 'opportunities'
                }
            ]
        };

        // this.listenTo(OauthAction.completed, this.onOauthActionCompleted.bind(this));
    },
    getState(key) {
        return key ? this.state[key]: this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.trigger(this.state);
    },
    // onOauthActionCompleted() {
    //     console.debug('rendering home');
    //     this.trigger(this.state);
    //     // AppActions.ChangeRoute('/home', this.state);
    // }
});