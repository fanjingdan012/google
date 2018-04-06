import React from 'react';
import IconButton from 'material-ui/lib/icon-button';

export default class SidebarAppbarIcon extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <IconButton
                iconClassName="material-icons"
                style={{padding:0}}
                {...this.props}
            >
                {this.props.children}
            </IconButton>
        );
    }
}
