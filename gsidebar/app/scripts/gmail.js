import './init';
import Reflux from 'reflux';
import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import GmailActions from 'core/actions/gmail';
import OauthAction from 'sap/actions/oauth';


import AppActions from 'sap/actions/app';
import HomeActions from 'sap/actions/home';
import SidebarActions from 'core/actions/sidebar';

import ComposeBar from 'sap/stores/compose-bar';

/// modules
import Authentication from 'sap/stores/authentication';
import Home from 'sap/stores/home';
import Customers from 'sap/stores/customers';

import App from 'sap/components/App';
import Hash from 'sap/components/SidebarRouter/Hash';
import HashActions from 'sap/components/SidebarRouter/HashActions';

import GContactPushToSAP from 'sap/components/buttons/GContactPushToSAP';
import './injector';

import {SAP_GROUP_NAME} from 'sap/utils/google-contact';

import ConfigStore from 'sap/stores/config';

var previousHash = '';

export default Reflux.createStore({
    listenables: [
        GmailActions,
        AppActions,
        HomeActions,
        SidebarActions,
        OauthAction
    ],
    init() {
        console.debug('initializing app...');
        this.setListeners();

        injectTapEventPlugin();
        GmailActions.GmailPageSetup();

        this.setListeners();

        this.state = {
            isSidebarVisible: true
        };
        // this.setSidebarVisibility(!(this.isOnContactPage() || this.isOnContactsPage()));
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.setSidebarVisibility(this.state.isSidebarVisible)
    },
    setListeners() {
        window.top.window.addEventListener('hashchange', this.onHashChange.bind(this));
    },
    onHashChange() {
        if (window.location.hash === previousHash) {
            return;
        }
        if (this.isOnContactPage() || this.isOnContactsPage()) {
            this.setSidebarVisibility(false);
            if (this.isOnContactPage()){
                this.onContactViewPage();
            }
        } else {
            this.setSidebarVisibility(this.getState('isSidebarVisible'));
        }
        if (this.isOnContactPage(previousHash)) {
            console.log('unmounting components');
            this.unmountSaveTOGContactBtn();
        }
        previousHash = window.location.hash;
    },
    isOnContactsPage() {
        return window.location.hash.indexOf('#contacts') === 0;
    },
    isOnContactPage(hash) {
        return (hash || window.location.hash).indexOf('#contact/') === 0;
    },
    onContactViewPage() {
        var self = this;
        const btnContainerSelectors = [
            'div.XoqCub.SvcCX.ieCXse.VP5otc-pzeoBf > div.XoqCub.gfqccc > div > div.IY0d9c > div > div',
            'div.nH.Nn.E.G-atb > div.nH.Cq > div > div.no > div > div',
        ]
        setTimeout(() => {
            $(btnContainerSelectors.join(', ')).each(function() {
                if (!$(this).hasClass('push-contact-to-sap-btn')) {
                    self.insertSaveToGContactBtn($(this));
                }
            })
        }, 0);
    },
    onSidebarToggle() {
        this.setState({isSidebarVisible: !this.state.isSidebarVisible});
    },
    setSidebarVisibility(isSidebarVisible) {
        $('body')[ isSidebarVisible ? 'addClass' : 'removeClass' ]( 'wizy-sidebar-open' );
    },
    onGmailPageSetupCompleted() {
        this.onHashChange();
        GmailActions.InjectCss([
            'main.css',
            'sap-icons.css',
            'wizy.materialize.css'
        ]);
        if (window.location.href.indexOf('https://www.google.com/contacts/') === -1) {
            ConfigStore.getConfigFromLS()
                .then(res => this.renderSidebar( AppActions.AppStart ));
        } else {
            AppActions.AppStart();
        }
    },
    renderSidebar(rendered) {
        ReactDom.render(
            <App/>,
            document.getElementById('wizy-sidebar-container'),
            rendered
        );
    },
    onClickedSection(section) {
        HashActions.ChangePath(section);
    },
    onTwoStepAuthCompleted() {
        HashActions.ChangePath('home');
        GmailActions.GmailFindOpenedComposed();
        GmailActions.GmailSetDOMListeners();
        AppActions.InjectScripts();
    },
    onTwoStepAuthFailed() {
        console.log('login');
        HashActions.ChangePath('login', null, false);
    },
    insertSaveToGContactBtn(el) {
        var inSAPGroup = false;
        var container = document.createElement('span');
        el.addClass('push-contact-to-sap-btn').children(':eq(0)').after(container);
        ReactDom.render(<GContactPushToSAP />, container);

    },
    unmountSaveTOGContactBtn() {
        $('.push-contact-to-sap-btn').each(function () {
            if ($(this).children().length) {
                ReactDom.unmountComponentAtNode(this);
            }
            $(this).remove();
        })
    }
})