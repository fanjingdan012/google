import React from 'react';
import GmailActions from 'core/actions/gmail';

import colors from 'sap/styles/colors';

class EmailButton extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'EmailButton';
    }
    onTouchTap = (ev) => {
        var {email, onTouchTap} = this.props;
        GmailActions.GmailOpenCompose(null, {to: email});
        onTouchTap && onTouchTap(ev);
    };
    render() {
        var {email, onTouchTap, style, ...other} = this.props;
        var anchorStyle = _.extend({ color: colors.link }, style);
        return(
            <a href="javascript:void(0)" {...other} onTouchTap={this.onTouchTap} style={anchorStyle}>
                {email}
            </a>
        );
    }
}

export default EmailButton;
