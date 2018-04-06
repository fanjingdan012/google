import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import RawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
class SmallAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SmallAppBar';
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
        this.setTheme();
    }
    componentWillReceiveProps(nextProps) {
        this.setTheme();
    }
    setTheme() {
        var newMuiTheme = ThemeManager.modifyRawThemeSpacing(this.state.muiTheme, {desktopGutter: 12, iconSize: 21})
        newMuiTheme.appBar.height = 30;
        this.setState({
            muiTheme: newMuiTheme
        });
    }
    render() {
        var {title, ...props} = this.props;
        title = <label style={{fontSize: 14}}>{title}</label>
        return <AppBar {...props} title={title}/>
    }
}
SmallAppBar.childContextTypes = {
    muiTheme: React.PropTypes.object,
}
export default SmallAppBar;
