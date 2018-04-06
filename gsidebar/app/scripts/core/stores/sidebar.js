import GmailActions from '../actions/gmail';
import Reflux from 'reflux';
import React from 'react';
import ReactDom from 'react-dom';
import _ from 'underscore';
import SidebarComponent from 'core/components/sidebar';
import SidebarActions from 'core/actions/sidebar';

export default Reflux.createStore({
        listenables: [GmailActions, SidebarActions],
        init(){
            this.state = {
                active: false,
                currentView: {
                    topbar: {
                        component: 'div',
                        _props: {},
                        children: null
                    },
                    appbar: {

                    },
                    body: {
                        component: 'div',
                        _props: {},
                        children: null
                    }
                },
                isVisible: true,
                viewHistory: []
            }

        },
        getState(key) {
            return key ? this.state[key] : this.state;
        },
        setState(newState) {
            this.state = _.extend(this.state, newState);
            this.trigger(this.getState());
            this.renderSidebar();
        },
        _changeCurrentView(view, forceShow) {
            var {viewHistory, currentView, isVisible} = this.getState();
            if (currentView.body.component !== 'div' && currentView.body.component.name !== 'LoadingPage') {
                viewHistory = [...viewHistory, _.extend({}, currentView)];
            }
            isVisible = forceShow ? true: isVisible;
            currentView = _.extend(currentView, view);
            this.setState({viewHistory, currentView, isVisible});
            // this._onVisibilityChange(visibility)
        },
        onSidebarToggle(isForce) {
            var visibility = isForce ? true : !this.getState('isVisible')
            this.setState({
                isVisible: visibility
            });
            // this._onVisibilityChange(visibility);
        },
        // _onVisibilityChange: function (visibility) {
        //     var gmailView = Utils.Gmail.getCurrentView();
        //     var sidebarConfig = Stores.Settings.getState('sidebarVisibility');
        //     if (gmailView && sidebarConfig.hasOwnProperty(gmailView)) {
        //         sidebarConfig[gmailView] = visibility;
        //     }
        //     // Actions.Settings.SettingsUpdate({sidebarVisibility: sidebarConfig});
        // },
        onSidebarSetActive() {
            if (this.getState('active')) {
                return
            }
            this.setState({ active: true });
        },
        onShowLoading() {
            var newView = {
                body: {
                    component: LoadingPage,
                    _props: {}
                }
            }
            this._changeCurrentView(newView);
        },
        onSidebarSetView(view, forceShow) {
            /// change view
            this._changeCurrentView(view, forceShow);
        },
        // _onPreGmailViewChange: function (params) {
        //     var gmailView = params.view_type;
        //     var sidebarConfig = Stores.Settings.getState('sidebarVisibility');
        //     if (gmailView && sidebarConfig.hasOwnProperty(gmailView)) {
        //         this.setState({
        //             isVisible: sidebarConfig[gmailView]
        //         });
        //     }
        // },
        onGmailPageSetupCompleted() {
            this.renderSidebar();
        },
        onShowPrevious() {
            var viewHistory = this.getState('viewHistory');
            var currentView = viewHistory.pop();
            this.setState({viewHistory, currentView});
        },
        renderSidebar() {
            ReactDom.render(
                <SidebarComponent {...this.getState()}/>,
                document.getElementById('wizy-sidebar-container')
            );
        }
    });