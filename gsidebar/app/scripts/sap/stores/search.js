import Reflux from 'reflux';
import GmailActions from 'core/actions/gmail';
import GmailConnActions from 'core/actions/gmail-connector';

import CustomerStore from 'sap/stores/customers';
import ContactStore from 'sap/stores/contact-persons';

import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';

import {AllSettledPromise, getEmailFromDom, extractEmails} from 'lib/utils';

import HashActions from 'sap/components/SidebarRouter/HashActions';

export default Reflux.createStore({
    listenables: [
        GmailActions,
        GmailConnActions,
        HashActions,

    ],
    init() {
        this.state = {
            email: '',
            isLoaded: false,
            result: {},

            resultType: null, // one of contact/customer
            resultId: null, // contact/customer id
        }
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.trigger(this.getState());
    },
    onChangePath(path, params) {
        var { resultType, resultId } = this.state;
        var id = params && params.id;
        if (path !== 'search' && resultType !== path && resultId !== id) {
            this.setState({ email: '' });
        }
    },
    onRevertPath() {
        this.setState({ email: '' });
    },
    _searchByEmail(email) {
        if (this.getState('email') === email) {
            return;
        }

        this.setState({
            email,
            isLoaded: false,
            result: {}
        });

        HashActions.ChangePath('search', {}, false);

        var promises = [
            CustomerStore.getCustomerByEmail(email),
            ContactStore.getContactByEmail(email)
        ]
        AllSettledPromise(promises).then( (results) => {
            var customerResult = results[0];
            var contactResult = results[1];
            var resultType = null, resultId = null;
            if (customerResult.status === 'resolved' && customerResult.data) {
                resultType = 'customer';
                resultId = customerResult.data.id;
                // CustomerActions.ShowCustomer(resultId);
            } else if (contactResult.status === 'resolved' && contactResult.data){
                resultType = 'contact';
                resultId = contactResult.data.id;
                // ContactActions.ShowContactPage(resultId);
            }
            this.setState({
                resultId,
                resultType,
                result: {
                    customerResult: customerResult.data,
                    contactResult: contactResult.data
                },
                isLoaded: true
            });
            if (resultType === 'customer') {
                CustomerActions.ShowCustomer(resultId);
            } else if (resultType === 'contact') {
                ContactActions.ShowContactPage(resultId);
            }
        });
    },
    onGmailConnThreadOpen(data) {
        var currUserEmail = getEmailFromDom();
        var threads = _.sortBy(data.threads, 'timestamp').reverse();
        var emailToSearch;

        function getEmail(emails, currUserEmail) {
            return _.map(emails, e => extractEmails(e).pop() )
                    .filter( e => e && e !== currUserEmail )[0];
        }

        _.each(threads, function (thread) {
            if (emailToSearch) {
                return;
            } else if (thread.from_email !== currUserEmail) {
                emailToSearch = thread.from_email;
            } else {
                if (thread.to && thread.to.length) {
                    emailToSearch = getEmail(thread.to, currUserEmail);
                }
                if (!emailToSearch && thread.cc && thread.cc.length) {
                    emailToSearch = getEmail(thread.cc, currUserEmail);
                }
                if (!emailToSearch && thread.bcc && thread.bcc.length) {
                    emailToSearch = getEmail(thread.bcc, currUserEmail);
                }
            }
        })


        var email = emailToSearch || _.map(data.people_involved, p => p[1]).filter(em => em && em !== currUserEmail).pop();
        if (email) {
            this._searchByEmail(email);
        }
    },
    onGmailEmailHovered(email) {
        this._searchByEmail(email)
    }

})