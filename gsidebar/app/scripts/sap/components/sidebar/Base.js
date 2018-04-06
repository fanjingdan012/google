import React from 'react';
import SidebarBase from 'core/components/SidebarBase';
import styles from 'sap/styles';

class Base extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SidebarBase
                style={{backgroundImage: `url(${chrome.extension.getURL('images/sap-bg.jpg')})`, backgroundSize:'cover'}}
                {...this.props}/>
        );
    }
}

export default styles.applyTheme(Base);