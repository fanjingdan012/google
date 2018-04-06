import React from 'react';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

class EmailButton extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'EmailButton';
    }
    // onMenuItemClick(payload) {
    //     switch (payload) {
    //         case 'quick_save':
    //             this.props.onQuickSave(this.props.emailData, this.props.msgId);
    //             break;
    //         default:
    //             console.log(payload);
    //     }
    // }
    onClick() {
        this.props.onQuickSave(this.props.emailData, this.props.msgId);
    }
    render() {
        var menuItems = [
            {text: 'Save to SAP Anywhere', payload: 'quick_save'}
        ];
        var styles = {
            paper: {
                //position: 'absolute',
                zIndex: 1,
                //right: 72,
                //display: this.state.mustOpen ? 'block' : 'none'
            },
            img: {
                // width: '18px',
                height: 17,
                position: 'relative',
                top: 4
            },
            root: {
                background: '#537BCD',
                cursor: 'pointer'
            },
            label: {
                color: 'white',
                fontWeight: 'lighter',
                fontSize: 12,
                fontFamily: '"Roboto", sans-serif'
            }
        };
        return (
            <div
                className="btn-wizy-email T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3"
                onTouchTap={() => this.onClick()}
                style={styles.root}
                data-tooltip="Save email to SAP Anywhere">
                    <span style={styles.label}>Save to </span>
                    <img style={styles.img} src={chrome.extension.getURL('images/sap-anywhere-logo-white.png')}/>
            </div>
        );
    }
}

export default EmailButton;
