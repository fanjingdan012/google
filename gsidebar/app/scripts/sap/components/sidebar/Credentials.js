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

import baseApi from 'sap/api/base';

import Container from 'core/components/Container';

import ConfigStore from 'sap/stores/config';
import HashActions from '../SidebarRouter/HashActions';

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

class Credentials extends React.Component {

    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
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

        showNotification('Validating credentials...');

        baseApi.getAuth(client_id, client_secret, refresh_token)
            .then(
                res => {
                    ConfigActions.SetConfig(data);
                    showNotification('Credentials has been saved.');
                    HashActions.ChangePath('settings');
                    Promise.resolve(res);
                },
                err => {
                    this.setState( {isLoading: false })
                    showNotification('Invalid Credentials.');
                }
            )


        // ConfigActions.SetConfig(data);
        // OauthAction.TwoStepAuth(client_id, client_secret, refresh_token)
        //     .then(() => {}, err => showNotification('Invalid Credentials'))
        //     .then(() => this.setState({isLoading: false}))
    }
    render() {
        var {client_id, client_secret, refresh_token, instanceUrl} = this.props;
        var isLoading = this.state.isLoading;
        var fields = {
            instanceUrl: { label: 'Instance Url', defaultValue: instanceUrl},
            client_id: { label: 'App ID', defaultValue: client_id},
            client_secret: {label: 'App Secret', defaultValue: client_secret},
            refresh_token: { label: 'Refresh Token', defaultValue: refresh_token}
        };
        return (
            <SidebarBase
                style={{backgroundImage: `url(${chrome.extension.getURL('images/sap-bg.jpg')})`, backgroundSize:'cover'}}
            >
                <SidebarAppbar
                    title="Credentials"
                    showRightIconButtons={false}
                />
                <div style={{overflow: 'auto', height: '100%'}}>
                    <CardText style={{ paddingTop: 0 }}>
                        <Form fields={fields} ref="form" disabled={isLoading}/>
                    </CardText>
                    <CardText>
                        <RaisedButton
                            label={isLoading ? "Validating..." : "Save"}
                            fullWidth={true}
                            secondary={true}
                            disabled={isLoading}
                            onTouchTap={this.onSubmit.bind(this)}
                            backgroundColor="#4A90F2"
                        />
                    </CardText>
                </div>
            </SidebarBase>
        );
    }
}

export default Container(Credentials, ConfigStore)
