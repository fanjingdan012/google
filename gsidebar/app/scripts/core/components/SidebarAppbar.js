import React from 'react';

import IconButton from 'material-ui/lib/icon-button';
import AppBar from 'material-ui/lib/app-bar';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import RawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

export default class SidebarAppbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            muiTheme: ThemeManager.getMuiTheme(RawTheme)
        };
    }
    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }
    componentWillMount() {
        let newMuiTheme = this.state.muiTheme;
        newMuiTheme.appBar.height = 47;
        this.setState({
            muiTheme: newMuiTheme
        });
    }
    render() {
        return (
            <div id='sidebarappbar'>
                <AppBar
                    {...this.props}
                    style={_.extend({padding: '0 15px', zIndex: 4}, this.props.style)}
                />
            </div>
        );
    }
}

SidebarAppbar.childContextTypes = {
    muiTheme: React.PropTypes.object
};
