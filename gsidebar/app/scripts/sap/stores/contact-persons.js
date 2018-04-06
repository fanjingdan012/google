import Reflux from 'reflux';
import {default as ContactPersonsApi, STATUS_OPTIONS, MARKETING_STATUS_OPTIONS} from 'sap/api/contact-persons';
import _ from 'underscore';
import SidebarActions from 'core/actions/sidebar';
import GmailActions from '../../core/actions/gmail';
import ContactActions from 'sap/actions/contacts';
import HomeActions from 'sap/actions/home';
import HashActions from 'sap/components/SidebarRouter/HashActions';

import CustomerStore from 'sap/stores/customers';

import StoreStateMixin from 'core/mixins/store-state';

export default Reflux.createStore({
    mixins: [StoreStateMixin],
    listenables: [ContactActions, HomeActions, HashActions],
    init() {
        this.state = {
            contacts: [],
            currentContactId: null,

            customer: {}, // customer of currentContact

            isContactsLoaded: false, // contactList

            hasError: false,
            error: {}
        }
    },
    preEmit(state) {
        var currentContact = _.find(state.contacts, c => state.currentContactId === c.id) || {};
        var customerId = currentContact && currentContact.customer && currentContact.customer.id;
        return {
            ...state,
            currentContact,
            contacts: state.contacts.sort((a, b) => {
                var aName = (a.displayName || '').toLowerCase();
                var bName = (b.displayName || '').toLowerCase();
                if (aName < bName) {
                    return -1;
                } else if (aName > bName) {
                    return 1;
                } else {
                    return 0;
                }
            }),
            // customer: customerId === state.customer.id ? state.customer : {},
        }
    },
    onClickedSection(route) {
        if (route === 'contacts') {
            // this.setState({
            //     renderCustomers: true,
            //     renderCurrentCustomer: false
            // });
            /// load only when not yet loaded
            if (!this.state.isContactsLoaded) {
                this._loadContacts();
            }
        }
    },
    onLoadContacts(force=false) {
        if (!this.getState('isContactsLoaded') && !force) {
            this._loadContacts();
        }
    },
    onReloadContacts() {
        this.setState({
            isContactsLoaded: false
        });
        this._loadContacts();
    },
    onShowContactPage(id, saveToHistory=true) {
        var { contacts, customer } = this.getState();
        var contact = _.find(contacts, c => c.id === id)
        var isLoaded = !!contact;
        if (saveToHistory) {
            HashActions.ChangePath('contact', {id});
        }
        if (!contact) {
            this._getContact(id)
                // .then(contact => this._getCustomer(contact.customer))
                // .then(customer => this.setState({ customer, isCurrentContactLoaded: true, }));
        }
        // } else if (_.isNumber(contact.customerId) && contact.customerId !== customer.id) {
        //     isLoaded = false;
        //     this._getCustomer(contact.customer)
        //         .then(customer => this.setState({ customer, isCurrentContactLoaded: true}));
        // }
        this.setState({
            currentContactId: id,
            // currentContact: contact || {id},
            isCurrentContactLoaded: isLoaded
        });
    },
    onReloadContactPage() {
        this.setState({
            isCurrentContactLoaded: false
        });
        this._getContact(this.getState('currentContactId'))
            // .then(contact => this._getCustomer(contact.customer, false))
            .then(customer => this.setState({ customer, isCurrentContactLoaded: true, }));
    },
    _getContact(id) {
        return ContactPersonsApi.getContactById(id)
            .then(
                res => {
                    var contacts = this._insertContact(this.getState('contacts'), res);
                    this.setState({
                        contacts,
                    });
                    return Promise.resolve(res);
                },
                err => {
                    console.log('failed to reload contact page', err);
                    return Promise.reject(err);
                }
        )
        // ContactPersonsApi.getContactById(id)
        // .then(contact => {
        //         var contacts = this._insertContact(this.getState('contacts'), contact);
        //         this.setState({ contacts });
        //         return this._getCustomer(contact.customerId);
        // })
    },
    // _getCustomer(customer, cache=true) {
    //     if (_.isNull(customer) || _.isUndefined(customer) || !customer) {
    //         return Promise.resolve({});
    //     }
    //     if (customer && !_.isNull(customer.id) && !_.isUndefined(customer.id)) {
    //         return CustomerStore.getCustomer(customer.id, cache)
    //             .then(customer => Promise.resolve(customer || {}));
    //     } else {
    //         return Promise.resolve({});
    //     }

    // },
    _loadContacts() {
        ContactPersonsApi.loadContacts()
            .then(
                contacts => this.setState({ contacts, isContactsLoaded: true }),
                error => this.setState({ isContactsLoaded: true, hasError: true, error})
            )
    },
    onPreRevertPath(path, contact) {
        if (path !== 'contact') {
            return;
        }
        var { currentContactId } = this.getState();
        if (!currentContactId || contact.id !== currentContactId) {
            ContactActions.ShowContactPage(contact.id, false);
        }
    },
    getContactByEmail(email) {
        this.setState({
            isContactLoaded: false
        });
        return new Promise( (resolve, reject) => {
            ContactPersonsApi.getContactByEmail(email).then(res => {
                this.setState({
                    contacts: this._insertContact(this.getState('contacts'), res[0]),
                    isContactLoaded: true
                });
                resolve(res[0]);
            }).catch(err => {
                reject(err);
                this.setState({
                    isContactLoaded: true
                })
            });
        });
    },
    onGetContactsByCustomerIdCompleted(result) {
        var contacts = [...this.getState('contacts'), ...result];
        this.setState({contacts})
    },
    createContact(contactPerson = {}) {
        ContactPersonsApi.createContactPerson(contactPerson).then(res => console.log(res)).catch(err => console.log(err));
    },
    onCreateContactCompleted(contactPerson) {
        var contacts = [...this.getState('contacts'), contactPerson];
        this.setState({contacts});
    },
    onUpdateContactCompleted(contactPerson) {
        var {contacts, currentContact} = this.getState();
        var existingContact = _.find(contacts, c => c.id === contactPerson.id);
        _.extend(existingContact, contactPerson);
        // if (currentContact && currentContact.id === contactPerson.id) {
        //     currentContact = _.extend({}, contactPerson);
        // }
        this.setState({ contacts });
    },
    _insertContact(contacts, contact) {
        if (!contact) {
            return contacts;
        }
        var index = _.findIndex(contacts, c => c.id === contact.id);
        if (index > -1) {
            contacts[index] = contact;
            return contacts;
        }
        return [...contacts, contact]
    }


})