import React from 'react';

import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';
import Appbar from './Appbar';
import Body from './Body';

// import CustomersActions from 'sap/actions/customers';
import HashActions from 'sap/components/SidebarRouter/HashActions';
import Store from 'sap/stores/contact-persons';
import Container from 'core/components/Container';
import ContactActions from 'sap/actions/contacts';

class Contacts extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Contacts';
    }
    onContactClick(id) {
        // console.log(id);
        ContactActions.ShowContactPage(id);
    }
    onClickBack() {
        console.log('clicked back from customers list');
        HashActions.RevertPath();
    }
    render() {
        var {contacts, isContactsLoaded, ...others} = this.props;
        var styles = {
            innerDiv: { paddingTop: 16 },
            primaryText: { fontSize: 14 },
            secondaryText: { fontSize: 12 },
            listItem: { WebkitFontSmoothing:'antialiased' },
            icon: { color: '#fff' }
        }
        var items = _.map(contacts, c => {
            return [
                <ListItem
                    primaryText={<div style={styles.primaryText}>{c.displayName}</div>}
                    secondaryText={<div style={styles.secondaryText}>{c.email || ''}</div>}
                    onTouchTap={() => this.onContactClick(c.id)}
                    style={styles.listItem}
                    innerDivStyle={styles.innerDiv}
                />,
                <Divider/>
            ]
        });

        return (
            <SidebarWrap>
                <Appbar
                    title="Contacts"
                    onRefresh={ContactActions.ReloadContacts}
                />
                <Body loading={!isContactsLoaded}>
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

export default Container(Contacts, Store);
