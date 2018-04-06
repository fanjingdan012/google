import React from 'react';

import Snackbar from 'material-ui/lib/snackbar';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Notification';
        this.state = {
            open: !!this.props.message
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.message && !this.state.open) {
            this.setState({
                open: true
            })
        }
    }
    handleRequestClose() {
        this.setState({open: false})
    }
    render() {
        var {message, action, autoHideDuration, onActionTouchTap} = this.props;
        var {open} = this.state
        return(
            <Snackbar
                open={open}
                message={message}
                action={action}
                autoHideDuration={autoHideDuration}
                onActionTouchTap={onActionTouchTap}
                onRequestClose={() => this.handleRequestClose()}/>
        );
    }
}

export default Notification;
