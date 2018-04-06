import React from 'react';
import {createStore} from 'reflux';
import StoreStateMixin from 'core/mixins/store-state';
import {getById, updateContact} from 'core/api/google-contact';

import {showNotification} from 'core/actions/notification';
import ContactsApi from 'sap/api/contact-persons';
import {getSAPGroupId} from 'sap/utils/google-contact';

import Container from 'core/components/Container';

const getPrimEmail = raw => {
    var email;
    _.each(raw && raw['gd$email'], (em, index, emails) => {
        if (em.primary) {
            email = em.address;
        } else if (index === emails.length - 1 && !email) {
            email = em.address;
        }
    })
    return email;
}

const notifMsg = 'Email address is required.';


const Store = createStore({
    mixins: [StoreStateMixin],
    getInitialState() {
        return {
            isLoaded: false,
            contact: null,
            gcontact: null // raw
        }
    },
    load() {
        this.setState(this.getInitialState());
        var gcontactId = window.location.hash.split('/').pop();
        getById(gcontactId).then(gcontact => {
            this.state.gcontact = gcontact;
            return getPrimEmail(gcontact.raw);
        }, err => Promise.reject(err))
        .then(this.getContactByEmail);
    },
    getContactByEmail(email) {
        if (!email) {
            this.setState({ isLoaded: true })
            return
        }
        ContactsApi.getContactByEmail(email)
        .then(contacts => {
            if (contacts && contacts.length) {
                this.setState({contact: contacts[0], isLoaded: true})
            } else {
                this.setState({ isLoaded: true });
            }
        }, err => {
            this.setState({ isLoaded: true });
        })
    },
    buildContact(entry) {
        var {givenName, familyName, emails, phoneNumbers, raw} = entry;
        return {
            firstName: givenName,
            lastName: familyName || ' ',
            email: getPrimEmail(raw),
            mobile: phoneNumbers[0],
            //defaults
            status: 'ACTIVE',
            marketingStatus: 'UNKNOWN'
        };
    },
    createContact(entry) {
        var contact = this.buildContact(entry);
        if (!contact.email) {
            showNotification(notifMsg);
            return Promise.reject();
        }
        return ContactsApi.createContactPerson(contact);
    },
    updateContact(entry, contact) {
        var newValues = this.buildContact(entry);
        contact = _.extend(contact, newValues);
        if (!contact.email) {
            showNotification(notifMsg);
            return Promise.reject();
        }
        return ContactsApi.updateContactPerson(contact);
    },
    addToSAPGroup(groupId) {
        var contactInSapGroup = false;
        var gcontact = this.state.gcontact.raw;
        if (gcontact['gContact$groupMembershipInfo']) {
            _.each(gcontact['gContact$groupMembershipInfo'], g => {
                if (g.href === groupId) {
                    contactInSapGroup = true
                }
            })
        }
        if (!contactInSapGroup) {
            gcontact['gContact$groupMembershipInfo'] = [...(gcontact['gContact$groupMembershipInfo'] || []), {href: groupId, deleted: false}];
            return updateContact(gcontact).then();
        }
        return Promise.reject();
    },
    pushGcontact() {
        var contact = this.state.contact;
        var existing = !!contact;
        var gcontactId = window.location.hash.split('/').pop();
        var func = existing ? this.updateContact : this.createContact;

        getById(gcontactId)
        .then(entry => {
            this.state.gcontact = entry;
            return entry;
        }, err => Promise.reject(err))
        .then(entry => func.call(this, entry, contact), err => Promise.reject(err))
        .then(contact => this.setState({contact}), err => Promise.reject(err))
        .then(getSAPGroupId, err => Promise.reject(err))
        .then(this.addToSAPGroup, err => Promise.reject(err))
        .then(res => showNotification('Contact added to SAP Anywhere group.'), err => console.log(err))
        .catch(err => {
            console.log(err);
        })
    }
})

class GContactPushToSAP extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'GContactPushToSAP';
    }
    componentDidMount() {
        Store.load();
    }
    onClick() {
        Store.pushGcontact();
    }
    render() {
        var {isLoaded, contact} = this.props;
        if (!this.props.isLoaded) {
            return null;
        }
        var styles = {
            root: {
                background: '#537BCD',
                color: 'white',
                cursor: 'pointer'
            },
            text: {
                fontWeight: 500,
                fontSize: 12
            },
            img: {
                height: 18,
                width: 92,
                display: 'inline-block',
                position: 'relative',
                top: 4,
                margin: '0 5px'
            }
        };
        var imgSrc = chrome.extension.getURL('/images/sap-anywhere-logo-white.png');
        return(
            <div className="T-I J-J5-Ji T-I-ax7 L3 tk3N6e-LgbsSe VIpgJd-TzA9Ye-eEGnhe tk3N6e-LgbsSe-n2to0e ipG21e" style={styles.root}>
                <div onTouchTap={this.onClick.bind(this)}>
                    <div style={styles.text}>
                        {contact ? 'Update ' : 'Save to '}
                        <img src={imgSrc} style={styles.img}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Container(GContactPushToSAP, Store);
