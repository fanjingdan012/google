import React from 'react'
import $ from 'jquery';
const SidebarBody = React.createClass({
    getDefaultProps: function() {
        return {
            component: 'div',
            _props: {},
            children: null
        };
    },
    render: function() {
        var component = React.createElement(this.props.component, this.props._props, this.props.children);
        return (
            <div className='panel' style={{height: '100%', position:'relative'}}>
                {component}
            </div>
        );
    }
});
export default React.createClass({
    componentDidMount() {
        this.setGmailBodyClass(this.props.isVisible);
    },
    componentDidUpdate(prevProps, prevState) {
        this.setGmailBodyClass(this.props.isVisible);
    },
    setGmailBodyClass(isSidebarVisible) {
        $('body')[ isSidebarVisible ? 'addClass' : 'removeClass' ]( 'wizy-sidebar-open' );
    },
    render() {
        // <Components.Topbar {...this.props.currentView.topbar}/>
        //             <Components.Appbar {...this.props.currentView.appbar}/>
        //             <Components.Body {...this.props.currentView.body}/>
        //             <Components.Footer/>
        return (
            <div id="wizy-sidebar-panel" className="z-depth-1" style={{opacity: this.props.blur ? .3 : 1}}>
                <div className='main panel'>
                    <SidebarBody {...this.props.currentView.body}/>
                </div>
            </div>
        );
    }
});

