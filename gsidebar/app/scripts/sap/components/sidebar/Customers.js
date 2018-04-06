import React from 'react';

import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

import IconButton from 'material-ui/lib/icon-button';

import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import Appbar from './Appbar';
import Body from './Body';

import CustomersActions from 'sap/actions/customers';
import HashActions from 'sap/components/SidebarRouter/HashActions';

import Container from 'core/components/Container';
import CustomerStore from 'sap/stores/customers';

class Customers extends React.Component {
    constructor(props) {
        super(props);
    }
    onCustomerClick(id) {
        console.log(id);
        CustomersActions.ShowCustomer(id);
    }
    onClickBack() {
        console.log('clicked back from customers list');
        HashActions.RevertPath();
    }
    render() {
        var {customers, isCustomersLoaded, ...others} = this.props;
        var styles = {
            innerDiv: { paddingTop: 16 },
            primaryText: { fontSize: 14 },
            secondaryText: { fontSize: 12 },
            listItem: { WebkitFontSmoothing:'antialiased' },
            icon: { color: '#fff' }
        }
        var items = _.map(customers, c => {
            return [
                <ListItem
                    primaryText={<div style={styles.primaryText}>{c.displayName}</div>}
                    secondaryText={<div style={styles.secondaryText}>{c.email || ''}</div>}
                    onTouchTap={() => this.onCustomerClick(c.id)}
                    style={styles.listItem}
                    innerDivStyle={styles.innerDiv}
                />,
                <Divider/>
            ]
        });

        return (
            <SidebarWrap>
                <Appbar
                    title="Customers"
                    onRefresh={CustomersActions.ReloadCustomers}
                />
                <Body loading={!isCustomersLoaded}>
                {
                    this.props.hasError ?
                        <div>error in loading</div>
                    :   <List style={{height:'100%', overflow:'auto'}}>
                            {items}
                        </List>
                }
                </Body>
            </SidebarWrap>
        );
    }
}
export default Container(Customers, CustomerStore);
