import React from 'react';

export default class SapAnywhereButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {children, style, ...other} = this.props;
    var styles = {
       root: {
            lineHeight: '32px',
            border: '1px solid #dddddd',
            padding: '0 18px',
            color: '#4a90e2',
            margin: '0 5px',
            cursor: 'pointer'
       }
    }
    return (
        <div style={_.extend(styles.root, style)} {...other}>
            {children}
        </div>
    );
  }
}
