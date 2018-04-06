import React from 'react';
import ReactDom from 'react-dom';

import SidebarAppbar from './Appbar';
import Body from './Body';
import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';

import HashActions from 'sap/components/SidebarRouter/HashActions';

import {fields as CustomerFields, fieldsDescription as CustomerFieldsDescription} from 'sap/field-descriptions/customers';
import InformationCard from 'sap/components/cards/InformationCard';
import InfoHeader from 'sap/components/cards/InfoHeader';
import EmailActivitiesCard from 'sap/components/cards/EmailActivitiesCard';
import AppointmentActivitiescard from 'sap/components/cards/AppointmentActivitiescard';
import NotesCard from 'sap/components/cards/NotesCard';
import RelatedContactsCard from 'sap/components/cards/RelatedContactsCard';
import GoogleContactCard from 'sap/components/cards/GoogleContactCard';
import OpportunitiesCard from 'sap/components/cards/OpportunitiesCard';
import SalesOrdersCard from 'sap/components/cards/SalesOrdersCard';
import PaymentsCard from 'sap/components/cards/PaymentsCard';

import Container from 'core/components/Container';
import Store from 'sap/stores/customers';

import CustomerActions from 'sap/actions/customers';
import utils from 'sap/utils';
class Customer extends React.Component {
    constructor(props) {
        super(props);
    }
    onClickBack() {
        console.log('clicked back from customer');
        HashActions.RevertPath();
    }
    onEditClick() {
        CustomerActions.ShowCustomerFormModal({model: this.props.currentCustomer});
    }
    onIconClick(type) {
        var ref = this.refs[type];
        if (ref) {
            var el = ReactDom.findDOMNode(ref);
            var body = ReactDom.findDOMNode(this.refs.body).children[0];
            // body.children[0].scrollTop = el.offsetTop
            $(body).scrollTo($(el), 200);
        }
    }
    render() {
        var {currentCustomer, isCurrentCustomerLoaded} = this.props;
        var {id, displayName, customerType, email} = currentCustomer;
        customerType = (customerType || '').split('_').map(str => str.charAt(0) + str.slice(1).toLowerCase()).join(' ');
        return (
            <SidebarWrap>
                <SidebarAppbar
                    title="Customer"
                    onRefresh={CustomerActions.ReloadCustomerPage}
                />
                <Body loading={!isCurrentCustomerLoaded} ref="body">
                    <div style={{height:'100%', overflow:'auto',background:'#fff', borderRadius: 2}}>
                        <InfoHeader
                            displayName={displayName}
                            customerType={customerType}
                            email={email}
                            onIconClick={type => this.onIconClick(type)}
                            permaLink={utils.getPermaLink('Customer', id)}/>
                        <InformationCard
                            cardTitle='Basic Information'
                            details={{ ...currentCustomer, customerType }}
                            fields={CustomerFields}
                            fieldsDescription={CustomerFieldsDescription}
                            onEditClick={() => this.onEditClick()}
                        />
                        <EmailActivitiesCard ref="activity"/>
                        <AppointmentActivitiescard customer={currentCustomer}/>
                        <NotesCard
                            ref="note"
                            id={id}
                            type="customer"
                        />
                        <RelatedContactsCard customerId={id}/>
                        <OpportunitiesCard customer={currentCustomer} />
                        <SalesOrdersCard type="customer" id={id}/>
                        <PaymentsCard type="customer" id={id} />
                        <GoogleContactCard
                            ref="gcontact"
                            email={email}
                            customer={currentCustomer}
                        />
                    </div>
                </Body>
            </SidebarWrap>
        );
    }
}
export default Container(Customer, Store);
