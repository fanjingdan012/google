import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import Avatar from 'material-ui/lib/avatar';
import AppBar from 'material-ui/lib/app-bar';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import RawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';


import BackArrow from 'core/components/sidebar-navigation-back';

export default React.createClass({
    getInitialState() {
        return {
            muiTheme: ThemeManager.getMuiTheme(RawTheme)
        };
    },
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },
    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    },
    componentWillMount() {
        let newMuiTheme = this.state.muiTheme;
        newMuiTheme.appBar.height = 30;
        this.setState({
            muiTheme: newMuiTheme
        });
    },
    onBack() {
        SidebarActions.ShowPrevious();
    },
    render() {
        var styles = {
            appBar: {
                backgroundColor: this.props.backgroundColor || '#1BA261',
                textColor: this.props.textColor || '#FFF',
                height: this.props.height,
                minHeight: 40,
                paddingLeft: 20,
                paddingRight: 20,
                zIndex: 'initial'
            },
            iconBtn: {
                maxWidth: 34,
                maxHeight: 40,
                padding: 8,
                paddingLeft: 0,
                paddingRight: 0,
                width: 30,
                top: this.props.iconBtnTop
            },
            backIcon: {
                fontSize: 20,
                color: '#FFF',
            },
            textField: {
                maxHeight: 34,
                width: 230,
                top: 3,
                marginLeft: 3
            },
            input: {
                top: -7
            },
            leftLabelElement: {
                position: this.props.position,
                top: this.props.top,
                left: this.props.left
            }
        };
        var leftElement, iconElementRight, leftLabelElement;

        if (!this.props.peak && this.props.label2) {
            leftLabelElement = (
                <div style={styles.leftLabelElement}>
                    <Avatar src={this.props.avatar} style={{height:this.props.imageSize,width:this.props.imageSize,border:'solid '+ this.props.imageBorder+'px #fff'}}/>
                    <div style={{margin: this.props.marginLabel ,color: '#FFF', float:'right', fontSize:'16px', width:this.props.labelWidth, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow:'hidden'}}>
                        <div>{this.props.label}</div>
                        <div style={{fontSize:'12px'}}>{this.props.label2}</div>
                    </div>
                </div>
            )
        } else {
            leftLabelElement = (
                <div style={styles.leftLabelElement}>
                    {this.props.avatar ? <Avatar src={this.props.avatar} style={{height:this.props.imageSize,width:this.props.imageSize,border:'solid '+ this.props.imageBorder+'px #fff'}} /> : null}
                    <div style={{margin: this.props.marginLabel ,color: '#FFF', float:'right', fontSize:'16px', width:this.props.labelWidth, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow:'hidden'}}>{this.props.label}</div>
                </div>
            )
        }
        leftElement = (
            <div>
                <BackArrow iconBtnTop={this.props.iconBtnTop} style={styles.iconBtn} iconStyle={styles.backIcon}/>
                {leftLabelElement}
            </div>
        );
        iconElementRight = this.props.showRightIcon ? (
            <div style={{display:'flex'}}>
                <IconButton
                    style={styles.iconBtn}
                    iconStyle={styles.backIcon}
                    onClick={this.onSearchClick}
                    iconClassName="material-icons">
                    search
                </IconButton>
                <IconButton
                    style={styles.iconBtn}
                    iconStyle={styles.backIcon}
                    onClick={this.onRefreshClick}
                    iconClassName="material-icons">
                    refresh
                </IconButton>
            </div>
        ) : null;
        return (
            <div>
                <AppBar
                    title=""
                    iconElementLeft={leftElement}
                    iconElementRight={iconElementRight}
                    style={styles.appBar}/>
                {this.props.showLoading ? (<MUI.LinearProgress mode="indeterminate"/>) : (<span></span>)}
            </div>
        );
    }
})