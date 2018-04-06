import React from 'react';

import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import GContactIconButton from 'sap/components/buttons/GContactIconButton';

import EmailLink from 'sap/components/buttons/EmailLink';

var styles = {
    root: {
        background: '#EAF3FE',
        padding: 10,
        color: '#474747',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none'
    },
    containers: {
        flex: {
            display: 'flex',
            flexDirection: 'row'
        },
        text: {
            marginTop: 10,
            marginLeft: 11,
            width: 172,
            overflow: 'hidden'
        },
        icons: {
            float: 'right',
            display:' flex',
            flexDirection: 'row'
        }
    },
    texts: {
        displayName: {
            fontSize: 16
        },
        email: {
            fontSize: 12,
            marginTop: 4,
            color:'#4a90e2',
            display: 'block'
        },
        customerType: {
            fontSize: 12,
            marginTop: 4
        }
    },
    appIcon: {
        width: 40,
        height: 40
    },
    icon: {
        color:'#4a90e2',
        fontSize:20
    }

}

const ShortcutIcon = ({iconName, onTouchTap, tooltip}) => (
    <SidebarAppbarIcon
        style={styles.appIcon}
        iconStyle={styles.icon}
        data-tooltip={tooltip}
        onTouchTap={onTouchTap}>
            {iconName}
    </SidebarAppbarIcon>
)

export default class InfoHeader extends React.Component {

    static propTypes = {
        type: React.PropTypes.oneOf(['contact', 'customer', 'search']), // info header for ?
        displayName: React.PropTypes.string,
        email: React.PropTypes.string,
        customerType: React.PropTypes.string,
        permaLink: React.PropTypes.string,
        onIconClick: React.PropTypes.func,
        showIcons: React.PropTypes.bool
    };

    static defaultProps = {
        onIconClick: () => {}
    };

    constructor(props) {
        super(props);
    }

    render() {
        var {onIconClick, type, permaLink, customerType, displayName, email, children} = this.props;
        var icons = [
            {type: 'activity', iconName: 'event_note', tooltip: 'Activities'},
            {type: 'note', iconName: 'assignment', tooltip: 'Notes'},
            {onTouchTap: () => window.open(permaLink), iconName: 'open_in_new', tooltip: 'Open in SAP Anywhere'}
        ];
        var shortcutIcons = [];
        _.each(icons, (icon, index) => {
            if (!(type === 'contact' && icon.type === 'note')) {
                shortcutIcons.push(
                    <ShortcutIcon
                        key={index}
                        {...icon}
                        onTouchTap={icon.onTouchTap || (() => onIconClick && onIconClick(icon.type)) }/>
                )
            }
        })
        return (
            <Paper style={styles.root}>
                <div style={styles.containers.flex}>
                    <Avatar size={66} src={chrome.extension.getURL('images/default-customer.png')}/>
                    <div style={styles.containers.text}>
                        <div style={styles.texts.displayName} className="truncate">{displayName}</div>
                        <EmailLink style={styles.texts.email} className="truncate" email={email}/>
                        <div style={styles.texts.customerType} className="truncate">{customerType}</div>
                    </div>
                </div>
                {type !== 'search' ? <div>
                    <div style={styles.containers.icons}>
                        <GContactIconButton
                            style={styles.appIcon}
                            data-tooltip="Google Contacts Details"
                            onTouchTap={(ev) => { onIconClick && onIconClick('gcontact')}}/>
                        {shortcutIcons}
                    </div>
                </div> : null}
            </Paper>
        );
    }
}
