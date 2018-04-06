import Reflux from 'reflux';
import React from 'react';
import ReactDom from 'react-dom';
import GmailActions from 'core/actions/gmail';
import Tooltip from 'core/components/tooltip'

const Actions = Reflux.createActions([
    'TooltipShow',
    'TooltipHide'
]);

const Store = Reflux.createStore({
    listenables: [Actions, GmailActions],
    getInitialState() {
        return {
            mustClose: true,
            parentOut: false,
            selfFocus: false,
            parentEl: {},
            element: null
        };
    },
    init() {
        this.state = this.getInitialState();
    },
    getState(key) {
        return key ? this.state[key] : this.state;
    },
    onTooltipShow: function(data) {
        if (!this.rendered) {
            this.renderTooltip();
        }
        this.state = data;
        this.trigger(this.state);
    },
    onTooltipHide() {
        this.trigger({parentOut: true});
    },
    renderTooltip() {
        this.rendered = true;
        ReactDom.render(
            <Tooltip store={this}/>,
            document.getElementById('wizy-tooltip')
        );
    }
});

export default Actions;