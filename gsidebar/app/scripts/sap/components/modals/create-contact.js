import React from 'react';
import FormModal from 'sap/components/modals/form';
import CustomerField from 'sap/components/forms/fields/CustomerField';
import {default as ContactPersonsApi, STATUS_OPTIONS, MARKETING_STATUS_OPTIONS} from 'sap/api/contact-persons';
import ContactActions from 'sap/actions/contacts';

class CreateContactModal extends FormModal {
    constructor(props) {
        super(props);
        this.displayName = 'CreateContactModal';
    }
    getFields() {
        var gender = [
            {text: 'Male', payload: 'MALE'},
            {text: 'Female', payload: 'FEMALE'}
        ];
        return {
            firstName: { label: 'First Name'},
            lastName: { label: 'Last Name'},
            customer: { label: 'Customer', component: CustomerField},
            // title: { label: 'Salutation'},
            // position: { label: 'Position' },
            mobile: { label: 'Mobile' },
            phone: { label: 'Phone'},
            email: { label: 'Email'},
            // fax: { label: 'Fax'},
            // webSite: {label: 'Website'},
            status: { label: 'Status', type: 'select', options: STATUS_OPTIONS}, // required
            // language: { label: 'Language'},
            // gender: { label: 'Gender', type: 'select', options: gender},
            // dateOfBirth: { label: 'Date Of Birth', type: 'date'},
            marketingStatus: { label: 'Opt-in Status', type: 'select', options: MARKETING_STATUS_OPTIONS}, // required
            remark: { label: 'Remark' }
        };
    }
    getTitle() {
        return this.isEdit() ? 'Edit Contact Person' : 'New Contact Person';
    }
    onSubmit(data) {
        console.log('create contact modal', data);
        if (this.isEdit()) {
            var model = _.extend({}, this.props.model);
            var contactPerson = _.extend(model, data);
            ContactActions.UpdateContact(contactPerson)
                .then(res => {
                    this.onRequestSuccess();
                    ContactActions.ReloadContactPage()
                })
                .catch(() => this.onRequestFail())
        } else {
            ContactActions.CreateContact(data)
                .then(res => {
                    this.onRequestSuccess();
                    ContactActions.ShowContactPage(res.id);
                    ContactActions.ReloadContactPage();
                }).catch(() => this.onRequestFail())
        }
    }
    getModel() {
        return this.props.model || { email: this.props.email };
    }
    isEdit() {
        return this.props.model;
    }
}

export default CreateContactModal;
