import Reflux from 'reflux';
import gcontactApi from 'core/api/google-contact';
import GContactActions from 'core/actions/google-contact';

export default Reflux.createStore({
    listenables: [GContactActions],
    init() {
        this.state = {
            contacts: [],

            // for card
            email: null, // email to search
            currentContact: {},
            currentContactLoaded: false,

            // groups
            groups: [],
            groupsLoaded: false
        }
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.trigger(this.getState());
    },
    getContactInCache(email) {
        return _.find(this.getState('contacts'),
                    c => _.find(c.emails, e => e===email))
    },
    onGetContactByEmail(email, cached=true) {
        var cachedContact = cached && email && this.getContactInCache(email);
        this.setState({
            email,
            currentContactLoaded: email ? !!cachedContact : true,
            currentContact: cachedContact || false,
            currentContactError: false
        });
        if (!cachedContact && email) {
            gcontactApi.getByEmail(email)
                .then(
                    res => {
                        if (this.state.email === email) {
                            GContactActions.GetContactByEmail.completed(res);
                        }
                    },
                    GContactActions.GetContactByEmail.failed
                );
        }
    },
    onGetContactByEmailCompleted(contact) {
        var {contacts, currentContactLoaded} = this.getState();
        if (contact) {
            contacts = [...contacts, contact];
        }
        var currentContact = contact;
        this.setState({
            currentContact,
            contacts,
            currentContactLoaded: true,
            currentContactError: false
        })
    },
    onGetContactByEmailFailed() {
        this.setState({
            currentContactLoaded: true,
            currentContact: null,
            currentContactError: true
        })
    },
    onCreateContactCompleted(contact) {
        var contacts = [...this.getState('contacts'), contact];
        this.setState({contacts});
    },

    // Groups
    onLoadGroups() {
        return new Promise((resolve, reject) => {
            if (this.getState('groupsLoaded')) {
                return;
            }
            gcontactApi.loadGroups()
                .then(groups => this.setState({groups, groupsLoaded: true}), err => {console.log(err); throw err})
                .then(resolve, reject)
        })
    },
    onCreateGroupCompleted(group) {
        this.setState({groups: [...this.getState('groups'), group]})
    },
    getGroupsByName(groupName) {
        return new Promise((resolve, reject) => {
            if (this.getState('groupsLoaded')){
                var {groups} = this.getState();
                resolve(_.filter(groups, group => group.title && group.title.$t === groupName))
            } else {
                this.onLoadGroups()
                    .then(res => {
                        var {groups} = this.getState();
                        resolve(_.filter(groups, group => group.title && group.title.$t === groupName))
                    }, reject)
            }
        })

    }
})