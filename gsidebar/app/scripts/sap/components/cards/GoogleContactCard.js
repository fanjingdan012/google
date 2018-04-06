import React from 'react';
import ListCard from './ListCard';
import Container from 'core/components/Container';
import Store from 'core/stores/google-contacts';

import GContactActions from 'core/actions/google-contact';

import ListItem from 'material-ui/lib/lists/list-item';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import Card from 'material-ui/lib/card/card';

import ModalActions from 'core/actions/modal';
import CreateGContactModal from 'sap/components/modals/CreateGContact';

import EmailLink from 'sap/components/buttons/EmailLink';


import GContactSyncWarning from 'sap/components/modals/GContactSyncWarning';

class GoogleContactCard extends React.Component {

    static propTypes = {
        contact: React.PropTypes.object,
        customer: React.PropTypes.object,
        currentContactLoaded: React.PropTypes.bool,
        currentContact: React.PropTypes.object,
    };

    static defaultProps = {
        expanded: false,
    };

    constructor(props) {
        super(props);
        this.displayName = 'GoogleContactCard';
        this.unsubscribe = GContactActions.CreateContact.completed.listen(
            () => setTimeout(
                () => GContactActions.GetContactByEmail(this.props.email, false)
            , 0)
        );
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    componentDidMount() {
        GContactActions.GetContactByEmail(this.props.email, false);
    }
    onAdd() {
        var c = this.props.contact || this.props.customer || {};
        var {firstName, lastName, email, salutation, position, customerName, remark, phone, mobile} = c;
        var phoneNumbers = [];
        if (phone) {
            phoneNumbers = [phone]
        }
        if (mobile) {
            phoneNumbers = [...phoneNumbers, mobile]
        }
        var model = {
            firstName,
            lastName,
            phoneNumbers,
            emails: [email],
            title: position,
            company: customerName,
            note: remark
        }

        ModalActions.RenderModal(<CreateGContactModal model={model} />)
    }
    getDiff() {
        var { contact, customer, currentContact } = this.props;
        var diffs = [];
        var gcontact = currentContact;
        // skipped phone number for now
        _.each(contact || customer, (value, field) => {
            if ((field === 'customerName' && customer && gcontact.company && value !== gcontact.company)
                || (field === 'firstName' && gcontact.givenName && value !== gcontact.givenName)
                || (field === 'lastName' && gcontact.familyName && value !== gcontact.familyName) ) {
                    var gcontactValue;

                    switch (field) {
                        case 'customerName':
                            gcontactValue = gcontact.company;
                            break;
                        case 'lastName':
                            gcontactValue = gcontact.familyName;
                            break;
                        case 'firstName':
                            gcontactValue = gcontact.givenName;
                            break;
                        default:
                            break;
                    };

                    diffs.push({ field,  value: gcontactValue, origVal: value });

            } else if (field === 'phoneNumber') {

            } else if (field === 'mobile') {

            }
        });
        console.log('Diffs ', diffs);
        console.debug('gcontact', gcontact);
        return diffs;
    }

    showSyncModal() {
        var diffs = this.getDiff();
        var { customer, contact } = this.props;
        var title = `Update ${contact ? 'Contact' : 'Customer'}`;
        ModalActions.RenderModal(<GContactSyncWarning diffs={diffs} title={title} customer={customer} contact={contact} />)
    }

    render() {
        var {currentContact, currentContactLoaded, customer, contact } = this.props;
        var info, addBtn;
        var diffs = (currentContactLoaded && currentContact && this.getDiff()) || [];
        var hasDiff = Boolean(diffs.length);
        var gcontactFieds = {
            givenName: 'First Name',
            familyName: 'Last Name',
            company: 'Company',
            emails: 'Emails',
            phoneNumbers: 'Contact Number',
            address: 'Address',
        }
        var styles = {
            label: {
                color: 'rgba(0, 0, 0, 0.54)',
                fontSize: 12
            },
            value: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: 14,
            },
            container: {
                padding: '17px 16px 13px 16px'
            }
        }
        if (currentContactLoaded && currentContact) {
            info = _.map(gcontactFieds, (field, key) => {
                var value = currentContact[key];
                if (_.isArray(value)) {
                    value = key === 'emails' ? _.map(value, (e, i, emails) => (
                        <div style={{ paddingBottom: 3 }}>
                            <EmailLink email={e} key={e}/>
                        </div>
                    )) : value[0];
                }

                // return <ListItem
                //             key={key}
                //             disabled={true}
                //             primaryText={ <div style={{fontSize:12, color: 'rgba(0, 0, 0, 0.54)'}}>{field}</div> }
                //             secondaryText={<div style={{fontSize:14, color: 'rgba(0, 0, 0, 0.87)'}}>{(value || '--')}</div>}/>
                return (
                    <div style={styles.container} key={key}>
                        <div style={styles.label}>{field}</div>
                        <div style={styles.value}>{value || '--'}</div>
                    </div>
                )
            });
            if (hasDiff) {
                let iconStyle = {
                    color: 'orange',
                    marginRight: 5,
                    verticalAlign: 'text-top',
                    fontSize: 18,
                };
                let containerStyle = {
                    marginTop: 8,
                    padding: 12,
                };
                let warning = (
                    <Card style={containerStyle} key='warning'>
                        <div style={{ display: 'flex' }}>
                            <span
                                className="material-icons"
                                style={iconStyle}
                            >
                                warning
                            </span>
                            <span>
                                Some information is different from SAP Anywhere {`${customer ? 'Customer' : 'Contact'} . `}
                                <a href="javascript:void(0)" onTouchTap={ ev => this.showSyncModal() } style={{ textDecoration: 'underline' }}>sync</a>
                            </span>
                        </div>
                    </Card>
                );
                info = [ warning, ...info ];
            }
        } else if (currentContactLoaded && !currentContact) {
            addBtn = <RaisedButton
                        fullWidth={true}
                        secondary={true}
                        backgroundColor="#4A90F2"
                        hoverColor="#4A90F2"
                        onTouchTap={this.onAdd.bind(this)} style={{zIndex: 1}}
                        label="Save to Google Contacts"
                        style={{marginTop: 12}}/>
        }

        return(
            <ListCard
                listTitle="Google Contact"
                isLoading={!currentContactLoaded}
                expanded={(currentContactLoaded && !currentContact) || hasDiff}
                expandable>
                {info}
                {addBtn}
            </ListCard>
        );
    }
}

export default Container(GoogleContactCard, Store);
