import React from 'react';

import FormModal from './form';

import GContactActions from 'core/actions/google-contact';

import ListTextField from 'core/components/ListTextField';

import GContactSore from 'core/stores/google-contacts';

import {getSAPGroupId} from 'sap/utils/google-contact';

class CreateGContactModal extends FormModal {
    constructor(props) {
        super(props);
        this.displayName = 'CreateGContactModal';
    }
    componentDidMount() {
        GContactActions.LoadGroups();
    }
    getFields() {
        return {
            firstName: { label: 'First Name'},
            lastName: { label: 'Last Name'},
            company: { label: 'Company'},
            title: { label: 'Title'},
            emails: { label: 'Emails', component: ListTextField},
            phoneNumbers: { label: 'Phone', component: ListTextField},
            note: {label: 'Note', type: 'textarea'}
        };
    }
    getModel() {
        return this.props.model || {};
    }
    getTitle() {
        return 'Google Contact';
    }
    onSubmit(data) {
        var {emails, firstName, lastName, phoneNumbers, company, title, note} = data;
        var entry = {
            'gd$email': _.map(emails, (email, index) => ({
                address: email,
                primary: index === 0,
                rel: 'http://schemas.google.com/g/2005#work'
            })),
            'gd$name': {
                'gd$familyName': {
                    '$t': lastName
                },
                'gd$givenName': {
                    '$t': firstName
                },
                'gd$fullName': {
                    '$t': `${firstName} ${lastName}`
                }
            },
            'gd$organization': [{
                'gd$orgName': {'$t': company},
                'gd$orgTitle': {'$t': title},
                'rel': "http://schemas.google.com/g/2005#work"
            }],
            'gd$phoneNumber': _.map(phoneNumbers, num => ({
                '$t': num,
                'rel' : 'http://schemas.google.com/g/2005#work'
            })),
            content: {
                '$t': note
            }
        }
        entry['gd$phoneNumber'] = _.filter(entry['gd$phoneNumber'], pn => pn['$t']);

        getSAPGroupId()
        .then(groupID => {
            entry['gContact$groupMembershipInfo'] = [{
                href: groupID,
                deleted: false
            }];
            return GContactActions.CreateContact(entry)
        }, err => console.log(err))
        .then(res => this.onRequestSuccess(), err => this.onRequestFail())
    }
}
export default CreateGContactModal;
