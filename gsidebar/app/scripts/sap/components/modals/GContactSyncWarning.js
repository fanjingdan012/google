import React from 'react';
import BaseDialog from './BaseDialog';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import LinearProgress from 'material-ui/lib/linear-progress';
import FlatButton from 'sap/components/buttons/FlatButton';
import colors from 'sap/styles/colors';

import customerApi from 'sap/api/customers';
import contactApi from 'sap/api/contact-persons';

import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';
import {showNotification} from 'core/actions/notification';

class ModalForm extends React.Component {

    static propTypes = {
        type: React.PropTypes.oneOf(['contact', 'customer']),
        diffs: React.PropTypes.array,
        contact: React.PropTypes.object,
        customer: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.displayName = 'ModalForm';
        this.state= {
            open: true,
            isLoading: false
        }
        this.columns = 2;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({open: true});
    }
    close() {
        this.setState({open: false});
    }
    onDialogSubmit() {
        this.setState({isLoading: true});
        var { diffs, type, contact, customer } = this.props;
        var fields = {};
        _.each(diffs, diff => {
            fields[diff.field] = diff.value;
        })
        var { company, ...other } = fields;

        if (contact) {
            var promises = [
                this.patchContact(contact.id, other)
            ];
            if (company && contact.customerId) {
                promises.push(
                    this.patchCustomer(contact.customerId, { customerName: company })
                );
            }
            Promise.all(promises)
                .then(
                    res => {
                        showNotification('Contact updated.');
                        ContactActions.ReloadContactPage();
                        this.onRequestSuccess();
                    },
                    err => {
                        console.log(err);
                        this.onRequestFail();
                    }
                );
        } else {
            this.patchCustomer(customer.id, {
                customerName: company,
                ...other
            }).then(
                res => {
                    showNotification('Customer updated.');
                    CustomerActions.ReloadCustomerPage();
                    this.onRequestSuccess();
                },
                err => {
                    showNotification(err.message);
                    this.onRequestFail();
                }
            );
        }
    }
    patchCustomer(id, values) {
        return customerApi.updateCustomer({ id, ...values });
    }
    patchContact(id, values) {
        return contactApi.updateContactPerson({ id, ...values });
    }

    showLoading(bool=true) {
        this.setState({isLoading: bool});
    }
    onRequestFail() {
        this.showLoading(false);
    }
    onRequestSuccess() {
        this.setState({
            open: false,
            isLoading: false
        });
    }
    render() {
        var {open, isLoading} = this.state,
            { type, diffs, title } = this.props,
            titleStyle = {
                margin: 0,
                color: colors.text,
                fontSize: 24,
                lineHeight: '32px',
                fontWeight: 400,
                padding: 24
            },
            iconStyle = {
                color: 'orange',
                marginRight: 5,
                verticalAlign: 'text-top',
                fontSize: 18,
            },
            dialogTitle = (
                <div>
                    <h3 style={titleStyle}>{title}</h3>
                    {isLoading ? <LinearProgress mode="indeterminate" /> : null}
                </div>
            );

        var actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.close()}
                disabled={isLoading}
            />,
            <FlatButton
                label="Update"
                primary={true}
                disabled={isLoading}
                onTouchTap={() => this.onDialogSubmit()}
            />
        ];

        var fields = _.map(diffs, diff => {
            var { value, field, origVal } = diff;
            var label = diff.field.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
            label = label === 'Customer Name' ? 'Company Name' : label;
            var value = diff.value;
            return (
                <div key={field} style={{ padding: '3px 0' }}>

                    <span style={{ marginRight: 5 }}>{`${label}: `}</span>
                    <span style={{ color: 'grey' }}>{origVal}</span>
                    <span className="material-icons" style={{fontSize: 17, margin: '0 5px', verticalAlign: 'sub'}}>arrow_forward</span>
                    <span>{value}</span>
                </div>
            )
        })

        return (
            <BaseDialog
                open={open}
                actions={actions}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                bodyStyle={{ paddingTop: 5, borderBottom: `1px solid ${colors.border}` }}
                onRequestClose={this.close.bind(this)}
                title={dialogTitle}
            >
                <CardText style={{paddingTop: 0}}>
                    <div>
                        <span
                            className="material-icons"
                            style={iconStyle}
                        >
                            warning
                        </span>
                        This will permanently update the following fields:
                    </div>
                    <CardText>
                        {fields}
                    </CardText>
                </CardText>
            </BaseDialog>
        );
    }
}

export default ModalForm;
