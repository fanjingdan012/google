import React from 'react';

import Appbar from './Appbar';
// import SidebarBody from 'core/components/SidebarBody';
import Body from './Body';
import SidebarWrap from './Base';

import ConfigStore from 'sap/stores/config';
import ConfigActions from 'sap/actions/config';

import Container from 'core/components/Container';

import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import Checkbox from 'material-ui/lib/checkbox';

import HashActions from '../SidebarRouter/HashActions';


class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = "Settings"
    }

    onTap(ev) {
        HashActions.ChangePath('credentials', null, false);
    }

    onChecked(checked) {
        ConfigActions.SetConfig({save_outgoing_emails: checked});
    }

    render() {
        var { instanceUrl, save_outgoing_emails, ...other } = this.props;
        var buttonField = (
            <FlatButton
                label="Configure Credentials"
                secondary={true}
                onTouchTap={ev => this.onTap(ev)}
            />
        )

        return (
            <SidebarWrap>
                <Appbar title="Settings" />
                <Body>
                    <List style={{height: '100%'}}>
                        <ListItem
                            secondaryText="Check 'Save to SAPAnywhere' checkbox by default"
                            secondaryTextLines={2}
                            rightToggle={
                                <Checkbox
                                    style={{right:0, top:20}}
                                    defaultChecked={save_outgoing_emails}
                                    onCheck={(ev, checked) => this.onChecked(checked)}
                                />
                            }
                        />
                        <ListItem
                            style={{paddingLeft:2}}
                            primaryText={buttonField}
                            disabled={true}
                        />
                    </List>
                </Body>
            </SidebarWrap>
        );
    }
}
export default Container(Settings, ConfigStore);
