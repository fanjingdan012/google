import React from 'react';
import SidebarBody from 'core/components/SidebarBody';
import Appbar from './Appbar';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';
import styles from 'sap/styles';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';

import HashActions from 'sap/components/SidebarRouter/HashActions';
import HashStore from 'sap/components/SidebarRouter/Hash';
import Container from 'core/components/Container';

const Home = ({ onTouchTap }) => (
    <FloatingActionButton
        mini={true}
        onTouchTap={onTouchTap}
        style={{ bottom: 20, right: 20, position: 'absolute', zIndex: 6, backgroundColor: 'transparent' }}
    >
      <FontIcon className="material-icons">home</FontIcon>
    </FloatingActionButton>
)

class Body extends React.Component {
    constructor(props) {
        super(props);
    }
    onClickHome() {
        HashActions.ChangePath('home');
    }
    render() {
        var { active, children, ...other } = this.props;
        return (
            <SidebarBody {...other}>
                {children}
            </SidebarBody>
        );
    }
}

export default Container(styles.applyTheme(Body), HashStore);