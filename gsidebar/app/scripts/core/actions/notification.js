import Reflux from 'reflux';
import React from 'react';
import ReactDOM from 'react-dom';

import NotificationComponent from 'core/components/Notification';
import Container from 'core/components/Container';

const Action = Reflux.createActions([
    'show'
]);

const Store = Reflux.createStore({
    listenables: [Action],
    init() {
        this.state = {
            message: '',
            onActionTouchTap: () => {},
            autoHideDuration: 3000
        }
    },
    getState() {
        return this.state;
    },
    setState(newState) {
        this.state = _.extend(this.state, newState);
        this.trigger(this.getState());
    },
    onShow(message, action, onActionTouchTap, autoHideDuration=3000) {
        this.setState({ message, action, onActionTouchTap, autoHideDuration })
    }

});

const el = document.createElement('div');
$('body').append(el);

var Component = Container(NotificationComponent, Store)

ReactDOM.render(<Component />, el);

export default Action;
export const showNotification = Action.show;
