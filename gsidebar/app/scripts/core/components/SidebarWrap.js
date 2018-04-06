import React from 'react';

export default class SidebarWrap extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id='sidebarWrap' style={{height: '100%'}}>
                {this.props.children}
            </div>
        );
    }
}
