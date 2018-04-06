import React from 'react';

import FlatButton from 'material-ui/lib/flat-button';
import GContactIconButton from './GContactIconButton';

class GContactAddButton extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'GContactAddButton';
    }
    render() {
        return(
            <FlatButton label="Add to google contacts">
                <GContactIconButton style={{padding: 0}} disabled={true}/>
            </FlatButton>
        );
    }
}

export default GContactAddButton;
