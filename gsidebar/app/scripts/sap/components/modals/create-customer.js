import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import Form from 'core/components/form';
import {default as CustomersApi, STAGE_OPTIONS, MARKETING_STATUS_OPTIONS, CUSTOMER_TYPES, STATUS_OPTIONS} from 'sap/api/customers';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import LinearProgress from 'material-ui/lib/linear-progress';
import CustomerActions from 'sap/actions/customers';
import FormModal from 'sap/components/modals/form';
import {showNotification} from 'core/actions/notification';

class CreateCustomerModal extends FormModal {
    constructor(props) {
        super(props);
        this.displayName = 'CreateCustomerModal';
    }
    onSubmit(data) {
        var action = this.isEdit() ? CustomerActions.UpdateCustomer : CustomerActions.CreateCustomer;
        var model = _.extend({}, this.getModel());
        var newData = _.extend(model, data);
        action(newData)
            .then(res => {
                this.onRequestSuccess();
                if (!this.isEdit()) {
                    CustomerActions.ShowCustomer(res.id);
                }
                CustomerActions.ReloadCustomerPage();
            })
            .catch((err) => this.onRequestFail(err))
    }
    getModel() {
        return this.props.model || {email: this.props.email};
    }
    getTitle() {
        return this.isEdit() ? 'Edit Customer' : 'New Customer';
    }
    isEdit() {
        return this.props.model;
    }
    getFields() {
        return {
            customerCode: { label: 'Customer Code'}, // required
            customerType: { label: 'Customer Type', type: 'select', options: CUSTOMER_TYPES},
            stage: { label: 'Stage', type: 'select', options: STAGE_OPTIONS},
            customerName: { label: 'Company'},
            // title: { label: 'Salutation'},
            firstName: { label: 'First Name'},
            lastName: { label: 'Last Name'},
            status: { label: 'Status', type: 'select', options: STATUS_OPTIONS },
            // position: { label: 'Position' },
            marketingStatus: { label: 'Opt-in Status', type: 'select', options: MARKETING_STATUS_OPTIONS, defaultValue: MARKETING_STATUS_OPTIONS[3].payload},
            // serviceLevel: { label: 'Service Level'}, cant find the property
            remark: { label: 'Remark'},

            // contact information
            phone: { label: 'Phone'},
            // fax: { label: 'Fax'},
            mobile: { label: 'Mobile' },
            email: { label: 'Email'},
            // webSite: {label: 'Website'},
            // twitter: { label: 'Twitter'}, // customerSocialAccountInfo obj {id, account}
            // sinaWeibo: { label: 'Sina Weibo'}, cant find
            // customerGroup: {label: 'Target Group'}, // CustomerGroupInfo {id}

            //sales and service data
            // cant find
            // paymentTerm: { label: 'Payment Term'},
            // paymentMethod: { label: 'Payment Method'},
            // creditLimit: { label: 'Credit Limit'},
            // checkDuplication: { label: 'Check Duplication', type: 'checkbox'},

            // membership information
            // membershipId: {label: 'Membership Id'}, // unique identifier of customer
        }
    }
}

export default CreateCustomerModal;
