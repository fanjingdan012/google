import React from 'react';
import ReactDom from 'react-dom';

import Appbar from './Appbar';
import Body from './Body';
import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';

import HashActions from 'sap/components/SidebarRouter/HashActions';

import {fields as ContactFields, fieldsDescription as ContactFieldsDescription} from 'sap/field-descriptions/contacts';
import InfoHeader from 'sap/components/cards/InfoHeader';
import InformationCard from 'sap/components/cards/InformationCard';
import EmailActivitiesCard from 'sap/components/cards/EmailActivitiesCard';
import AppointmentActivitiescard from 'sap/components/cards/AppointmentActivitiescard';
import GoogleContactCard from 'sap/components/cards/GoogleContactCard';

import Container from 'core/components/Container';
import Store from 'sap/stores/contact-persons';
import ContactActions from 'sap/actions/contacts';
import CustomerActions from 'sap/actions/customers';
import utils from 'sap/utils';

class Contact extends React.Component {
    constructor(props) {
        super(props);
    }
    onClickBack() {
        console.log('clicked back from customer');
        HashActions.RevertPath();
    }
    onEditClick() {
        ContactActions.ShowContactFormModal({model: this.props.currentContact});
    }
    onIconClick(type) {
        var ref = this.refs[type];
        if (ref) {
            var el = ReactDom.findDOMNode(ref);
            var body = ReactDom.findDOMNode(this.refs.body).children[0];
            $(body).scrollTo($(el), 200);
        }
    }
    onCustomerClick() {
        if (this.props.currentContact.customer ) {
            CustomerActions.ShowCustomer(this.props.currentContact.customer.id);
        }
    }
    render() {
        var {
            currentContact,
            isCurrentContactLoaded,
            // customer
        } = this.props;
        var customer = currentContact.customer;
        var contact = {
            ...currentContact,
            company: customer && customer.name
        };
        var {
            id,
            email,
            displayName
        } = contact;
        var companyEl = customer && customer.name ? <a href="javascript:void(0)" onTouchTap={ ev => this.onCustomerClick() }>{customer.name}</a> : null;
        var infos = _.extend({ company: companyEl }, currentContact);
        // console.log(infos);
        return (
            <SidebarWrap>
                <Appbar
                    title="Contact"
                    onRefresh={ContactActions.ReloadContactPage}
                />
                <Body loading={!isCurrentContactLoaded} ref="body">
                    <div style={{height:'100%', overflow:'auto',background:'#fff', borderRadius: 2}}>
                        <InfoHeader
                            displayName={displayName}
                            customerType="" email={email}
                            onIconClick={type => this.onIconClick(type)}
                            type="contact"
                            permaLink={utils.getPermaLink('ContactPerson', id)}/>
                        <InformationCard
                            cardTitle='Basic Description'
                            details={infos}
                            fields={ContactFields}
                            fieldsDescription={ContactFieldsDescription}
                            onEditClick={() => this.onEditClick()}
                        />
                        <AppointmentActivitiescard ref="activity" contact={contact}/>
                        <GoogleContactCard ref="gcontact" email={email} contact={contact}/>
                    </div>
                </Body>
            </SidebarWrap>
        )
    }
}
export default Container(Contact, Store);
