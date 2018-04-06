import React from 'react';
import GmailActions from 'core/actions/gmail';

import SidebarAppbar from 'core/components/SidebarAppbar';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import TextField from 'material-ui/lib/text-field';

import {isValidEmail} from 'lib/utils';
import {showNotification} from 'core/actions/notification';
import styles from 'sap/styles';
import HashActions from 'sap/components/SidebarRouter/HashActions';
import HashStore from 'sap/components/SidebarRouter/Hash';
import Container from 'core/components/Container';

const IconButton = ({ onTouchTap, icon }) => (
    <SidebarAppbarIcon
        iconStyle={{ color: '#fff' }}
        style={{ width: 32, height: 32, padding: 4 }}
        onTouchTap={onTouchTap}>
            {icon}
    </SidebarAppbarIcon>
)

class Appbar extends React.Component {

    static propTypes = {
        showRightIconButtons: React.PropTypes.bool,
        title: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string,
        ])
    };

    static defaultProps = {
        showRightIconButtons: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            isSearching: false
        }
    }
    onSearchClick(ev) {
        this.toggleSearch(true, () => this.refs.searchField.focus());
    }
    onClear(ev) {
        this.toggleSearch(false);
    }
    toggleSearch(isSearching, callback) {
        this.setState({isSearching}, callback);
    }
    onSearch(ev) {
        var value = ev.target.value;
        if (isValidEmail(value)) {
            GmailActions.GmailEmailHovered(value);
        } else {
            showNotification('Please enter a valid email.');
        }
    }
    setHash(path) {
        HashActions.ChangePath(path);
    }
    onClickBack() {
        HashActions.RevertPath();
    }
    render() {
        var {
            iconElementRight,
            title,
            onRefresh,
            iconElementLeft,
            history,
            active,
            showRightIconButtons,
            ...other
        } = this.props
        var { isSearching } = this.state;
        var hasBack = history && history.length ;
        var rightElement = showRightIconButtons ? (
            <div style={{ padding: 8 }}>
                {isSearching ?
                    <IconButton
                        icon="clear"
                        onTouchTap={(ev) => this.onClear(ev)}
                    />
                : <div>
                        <IconButton
                            icon="search"
                            onTouchTap={(ev) => this.onSearchClick(ev)}
                        />
                        { onRefresh ?
                            <IconButton
                                icon="refresh"
                                onTouchTap={(ev) => onRefresh(ev)}
                            />
                        : null }
                        { active.path === 'home' ?
                            <IconButton
                                icon="settings"
                                onTouchTap={ ev => this.setHash('settings') }
                            />
                        : <IconButton
                                icon="home"
                                onTouchTap={ ev => this.setHash('home') }
                            />
                        }
                    </div>
                }
            </div>
        ) : null;
        var titleEl;
        if (isSearching) {
            titleEl = <TextField
                        ref="searchField"
                        fullWidth={true}
                        hintStyle={{ color: '#A7BFEE', fontWeight: 200 }}
                        inputStyle={{ color: 'white' }}
                        underlineFocusStyle={{ display: 'none' }}
                        style={{display: 'block'}}
                        hintText="Search"
                        onEnterKeyDown={ev=> this.onSearch(ev)}/>;
        } else {
            titleEl = <div style={{color:'#fff',fontSize:18, overflow:'hidden', textOverflow:'ellipsis'}}>{title}</div>;
        }
        var iconElementLeft = (
            <div style={{padding: '8px 0 8px 8px'}}>
                <IconButton
                    icon="arrow_back"
                    onTouchTap={ ev  => this.onClickBack() }
                />
            </div>
        );
        return (
            <SidebarAppbar
                style={{ backgroundColor: 'rgba(0,0,0,.06)' }}
                {...other}
                title={titleEl}
                showMenuIconButton={hasBack}
                iconElementRight={rightElement}
                iconElementLeft={hasBack ? iconElementLeft : null}
            />
        );
    }
}
export default Container(styles.applyTheme(Appbar), HashStore);
