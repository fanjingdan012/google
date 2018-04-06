import React from 'react';
import SidebarRouter from './SidebarRouter/SidebarRouter';
import SidebarRoute from './SidebarRouter/SidebarRoute';

import Base from 'sap/components/sidebar/Base';

import Authentication from 'sap/components/sidebar/Authentication';
import Home from 'sap/components/sidebar/Home';
import Customers from 'sap/components/sidebar/Customers';
import Customer from 'sap/components/sidebar/Customer';
import Contacts from 'sap/components/sidebar/Contacts';
import Contact from 'sap/components/sidebar/Contact';
import Search from 'sap/components/sidebar/Search';
import Opportunities from 'sap/components/sidebar/Opportunities';
import Settings from 'sap/components/sidebar/Settings';
import Credentials from 'sap/components/sidebar/Credentials';

import SidebarActions from 'core/actions/sidebar';


class Sidebar extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var props = this.props;
        var styles = {
            root: {
                height: '100%'
            },
            handle: {
                backgroundColor: 'white',
                top: 'calc(50% - 16px)',
                height: 32,
                left: -18,
                overflowX: 'hidden',
                overflowY: 'hidden',
                position: 'absolute',
                width: 32,
                transition: 'background-color 0.2s cubic-bezier(0.55, 0, 0, 1)',
                cursor: 'pointer',
                zIndex: 4,
                borderRadius: '50%',
                border: '2px solid rgb(233, 233, 233)',
                textAlign: 'center'
            },
            icon: {
                lineHeight: '28px',
                width: 30,
                color: '#6F5F4F',
                transform: 'rotate(0)',
                transition: 'transform 1s cubic-bezier(0.55, 0, 0, 1)'
            }
        }
        var handle = (
            <div className="wizy-sidebar-handle" style={styles.handle} onTouchTap={() => SidebarActions.SidebarToggle()}>
                <span className="material-icons" style={styles.icon}>chevron_left</span>
            </div>
        )
        return (
            <Base {...props} handle={handle}/>
        )
    }
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
        return (
            <SidebarRouter path='/' component={Sidebar}>
                <SidebarRoute path='login' component={Authentication} />
                <SidebarRoute path='home' component={Home} />
                <SidebarRoute path='customers' component={Customers} />
                <SidebarRoute path='customer' component={Customer} />
                <SidebarRoute path='contacts' component={Contacts} />
                <SidebarRoute path='contact' component={Contact} />
                <SidebarRoute path='search' component={Search} />
                <SidebarRoute path='opportunities' component={Opportunities} />
                <SidebarRoute path='settings' component={Settings} />
                <SidebarRoute path='credentials' component={Credentials} />
            </SidebarRouter>
        );
	}
}
