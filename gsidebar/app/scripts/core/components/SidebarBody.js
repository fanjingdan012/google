import React from 'react';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

const loadingStyle = {
    top: 'calc(50% - 10000px - 20px)',
    left: 'calc(50% - 10000px - 20px)'
}

export default class SidebarBody extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id='sidebarbody' style={{height:'calc(100% - 50px)', overflow: 'auto', padding: '0 2px'}}>
                {this.props.loading ?
                    <RefreshIndicator top={0} left={0} status="loading" style={loadingStyle}/>
                : this.props.children}
            </div>
        );
    }
}
SidebarBody.propTypes = {
    loading: React.PropTypes.bool
}
SidebarBody.defaultProps = {
    loading: false
}