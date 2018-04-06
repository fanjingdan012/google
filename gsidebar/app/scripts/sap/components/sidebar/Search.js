import React from 'react';

import SidebarAppbar from './Appbar';
import Body from './Body';
import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';
import Container from 'core/components/Container';

import Store from 'sap/stores/search';

import HashActions from 'sap/components/SidebarRouter/HashActions';
import ContactActions from 'sap/actions/contacts';
import CustomerActions from 'sap/actions/customers';

import RaisedButton from 'material-ui/lib/raised-button';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';

import InfoHeader from 'sap/components/cards/InfoHeader';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Search';
    }
    onClickBack() {
        HashActions.RevertPath();
    }
    onCreateContact() {
        ContactActions.ShowContactFormModal({email: this.props.email});
    }
    onCreateCustomer(){
        CustomerActions.ShowCustomerFormModal({email: this.props.email});
    }
    render() {
        var {customerResult, contactResult, isLoaded} = this.props;
        var body = null;
        if (!customerResult && !contactResult) {
            body = this._buildEmptyView();
        }
        return(
            <SidebarWrap>
                <SidebarAppbar title="Search Result"/>
                <Body loading={!isLoaded}>
                    {body}
                </Body>
            </SidebarWrap>
        );
    }
    _buildEmptyView() {
        var {email} = this.props;
        return (
            <Paper style={{background:'#EAF3FE', padding:10, color:'#474747', display:'flex', flexDirection:'column', boxShadow:'none'}}>
                <InfoHeader
                    type="search"
                    email={email}/>
                <div>
                    <div style={{margin: '20px 0'}}>
                        <RaisedButton
                            label="Add to SAP as Customer"
                            secondary={true}
                            onTouchTap={this.onCreateCustomer.bind(this)}
                            fullWidth={true}
                            backgroundColor="#4A90F2"/>
                    </div>
                    <div style={{margin: '20px 0'}}>
                        <RaisedButton
                            label="Add to SAP as Contact"
                            secondary={true}
                            onTouchTap={this.onCreateContact.bind(this)}
                            fullWidth={true}
                            backgroundColor="#4A90F2"/>
                    </div>
                </div>
            </Paper>
        )
    }
    _buildLoadingView() {
        return (
            <div>
                <RefreshIndicator top={180} left={125} status="loading"/>
            </div>
        )
    }
}

export default Container(Search, Store);
