import React from 'react';
import Button from 'material-ui/lib/flat-button'

import colors from 'sap/styles/colors';



class FlatButton extends React.Component {

    state = {
        color: colors.btn.color
    };

    constructor(props) {
        super(props);

    }

    onMouseEnter(ev) {
        this.setState({ color: colors.btn.hover });
        this.props.onMouseEnter && this.props.onMouseEnter(ev);
    }

    onMouseLeave(ev) {
        this.setState({ color: colors.btn.color });
        this.props.onMouseLeave && this.props.onMouseLeave(ev);
    }

    render() {
        var { style, children, ...other } = this.props,
            { color } = this.state,
            btnStyle = _.extend({ color }, style);

        return (
            <Button
                {...other}
                style={btnStyle}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
            >
                {children}
            </Button>
        );
    }
}
export default FlatButton;