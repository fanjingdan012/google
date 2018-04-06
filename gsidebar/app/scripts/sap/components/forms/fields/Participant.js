import React from 'react';
import colors from 'sap/styles/colors';

export default ({ displayName, customerId, onRemove, participantId }) => (
    <div style={{lineHeight: '35px'}}>
        <a
            style={{textDecoration: 'none', color: colors.link, fontSize: 14, position: 'relative', top: 2, cursor: 'pointer'}}
            className="material-icons"
            onTouchTap={ev => onRemove(customerId || participantId)}
        >
            clear
        </a>
        <span
            href="javascript:void(0)"
            style={{marginLeft: 10}}>
            {displayName}
        </span>
    </div>
);