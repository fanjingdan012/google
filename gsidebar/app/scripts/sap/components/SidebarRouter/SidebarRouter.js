import React from 'react';
import SidebarRouterContext from './SidebarRouterContext';

export default class SidebarRouter extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            this.props.component ?
                React.createElement(
                    this.props.component,
                    {},
                    <SidebarRouterContext routes={this.props.children} />
                )
                : <SidebarRouterContext routes={this.props.children} />
        );
    }
}

// SidebarRouter.propTypes = {
//     path: React.PropTypes.string,
//     component: React.PropTypes.element
// }