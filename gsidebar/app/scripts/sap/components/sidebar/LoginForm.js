import React from 'react';
import Form from 'core/components/form';
import CardText from 'material-ui/lib/card/card-text';
import RaisedButton from 'material-ui/lib/raised-button';

import OauthAction from 'sap/actions/oauth';
import ConfigActions from 'sap/actions/config';

import SidebarAppbar from './Appbar';
import SidebarBase from 'core/components/SidebarBase';

import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import RawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

import {showNotification} from 'core/actions/notification';



class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SapLogo'
    }
    render() {
        var style = {
            backgroundImage: `url(${chrome.extension.getURL('images/sap-anywhere-logo-white.png')})`,
            width: 220,
            height: 46,
            backgroundSize: '220px 46px',
            backgroundRepeat: 'no-repeat',
            margin: 'auto',
        }
        return (
            <div style={{paddingTop: 70}}>
                <div style={style}/>
            </div>
        )
    }
}

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
        this.state = {
            muiTheme: ThemeManager.getMuiTheme(RawTheme)
        };
    }
    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };
    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }
    componentWillMount() {
        let newMuiTheme = this.state.muiTheme;
        newMuiTheme.textField.disabledTextColor = 'rgba(255, 255, 255, 0.24)';
        newMuiTheme.textField.textColor = 'white';
        newMuiTheme.textField.floatingLabelColor = 'white';
        newMuiTheme.textField.focusColor = 'white';
        newMuiTheme.textField.hintColor = 'rgba(255, 255, 255, 0.70)';
        this.setState({
            muiTheme: newMuiTheme
        });
    }
    onSubmit() {
        this.setState({
            isLoading: true
        })
        var data = this.refs.form.getValues();
        var {client_id, client_secret, refresh_token} = data;
        ConfigActions.SetConfig(data);
        OauthAction.TwoStepAuth(client_id, client_secret, refresh_token)
            .then(() => {}, err => showNotification('Invalid Credentials'))
            .then(() => this.setState({isLoading: false}))
    }
    onGoogleSignIn() {
        if (this.props.googleAuthStatus === 'failed') {
            OauthAction.GoogleSignIn();
        }
    }
    render() {
        var {client_id, client_secret, refresh_token, instanceUrl} = this.props.credentials;
        var googleAuthStatus = this.props.googleAuthStatus;
        var fields = {
            instanceUrl: { label: 'Instance Url', defaultValue: instanceUrl},
            client_id: { label: 'App ID', defaultValue: client_id},
            client_secret: {label: 'App Secret', defaultValue: client_secret},
            refresh_token: { label: 'Refresh Token', defaultValue: refresh_token}
        };
        var styles = {
            googleBtn: {
                color: googleAuthStatus === 'failed' ? 'white' : 'rgb(229,229,229)',
                textDecoration: 'underline',
                cursor: googleAuthStatus === 'failed' ? 'pointer' : 'initial',
                opacity: googleAuthStatus === 'failed' ?  1 : 0.5
            },
            googleBtnContainer: {
                paddingBottom: 16,
                // display: googleAuthStatus === 'failed' ? 'block': 'none'
            }
        }
        return (
            <SidebarBase
                style={{backgroundImage: `url(${chrome.extension.getURL('images/sap-bg.jpg')})`, backgroundSize:'cover'}}
            >
                <div style={{overflow: 'auto', height: '100%'}}>
                    <div>
                        <Logo />
                    </div>
                    <CardText>
                        <Form fields={fields} ref="form" disabled={this.state.isLoading}/>
                    </CardText>
                    <CardText>
                        <div style={styles.googleBtnContainer}>
                            <div style={styles.googleBtn} onTouchTap={this.onGoogleSignIn.bind(this)}>{googleAuthStatus === 'authenticating' ? 'Signing in...' : 'Sign in with Google'}</div>
                        </div>
                        <RaisedButton
                            label={this.state.isLoading ? "Authenticating..." : "Submit"}
                            fullWidth={true}
                            secondary={true}
                            disabled={this.state.isLoading || googleAuthStatus !== 'authenticated'}
                            onTouchTap={this.onSubmit.bind(this)}
                            backgroundColor="#4A90F2"
                            data-tooltip={googleAuthStatus !== 'authenticated' ? 'Please sign in with Google first.' : ''}
                            />
                    </CardText>
                </div>
            </SidebarBase>
        );
    }
}
