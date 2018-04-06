import React from 'react';

export default class SidebarBase extends React.Component {
	render() {
		return (
			<div id="wizy-sidebar-panel" className="z-depth-1">
                <div className='main panel' {...this.props}>
                	{this.props.children}
                </div>
                {this.props.handle}
            </div>
		);
	}
}
