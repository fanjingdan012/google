import React from 'react';

import EnhancedButton from 'material-ui/lib/enhanced-button';

class GContactIconButton extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'GContactIconButton';
    }
    render() {
        var {style} = this.props;
        return(
            <EnhancedButton {...this.props} style={_.extend({padding: 12, position: 'relative'}, style)} centerRipple={true}>
                <img src={chrome.extension.getURL('images/google_contact.png')} style={{height: 20, width: 20}}/>
            </EnhancedButton>
        );
    }
}

export default GContactIconButton;
