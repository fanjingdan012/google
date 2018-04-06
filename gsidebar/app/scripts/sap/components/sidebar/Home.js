import React from 'react';

import Paper from 'material-ui/lib/paper';
import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

import AppActions from 'sap/actions/app';
import HomeActions from 'sap/actions/home';

// import SidebarAppbar from 'core/components/SidebarAppbar';
import Appbar from './Appbar';
// import SidebarBody from 'core/components/SidebarBody';
import Body from './Body';
import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import Store from 'sap/stores/home';
import Container from 'core/components/Container';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    onSectionClick(route) {
        console.debug('clicked section in home', route);
        HomeActions.ClickedSection(route);
    }
    render() {
        return (
            <SidebarWrap>
                <Appbar
                    style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                    // showMenuIconButton={false}
                    title={<div style={{height: 48, backgroundImage:`url(${chrome.extension.getURL('images/sap-anywhere-logo-white.png')})`, backgroundSize:'148px 27px', backgroundRepeat:'no-repeat', backgroundPosition:'0 center'}}/>}
                />
                <Body>
                    <List style={{padding:'0 20px', backgroundColor:'transparent'}}>
                    {
                        this.props.sections.map( (section) => {
                            return <Paper key={section.route} style={{margin:'10px 0'}}>
                                <ListItem
                                    style={{color:'#4A4A4A'}}
                                    primaryText={section.name}
                                    onTouchTap={this.onSectionClick.bind(this, section.route)}
                                />
                            </Paper>;
                        })
                    }
                    </List>
                </Body>
            </SidebarWrap>
        );
    }
}

export default Container(Home, Store);
