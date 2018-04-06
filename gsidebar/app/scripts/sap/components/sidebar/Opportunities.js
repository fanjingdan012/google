import React from 'react';

import SidebarAppbar from './Appbar';
import Body from './Body';
import SidebarWrap from './Base';
import SidebarAppbarIcon from 'core/components/SidebarAppbarIcon';

import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import FontIcon from 'material-ui/lib/font-icon';

import HashActions from 'sap/components/SidebarRouter/HashActions';

import Container from 'core/components/Container';
import Store from 'sap/stores/opportunities';
import sapUtils from 'sap/utils';

const icons = {
    OPEN: 'icon-status-opportunity',
    MISSED: 'icon-status-reject',
    SOLD: 'icon-status-approved'
}
const colors = {
    OPEN: '#ff7f00',
    MISSED: '#fc5258',
    SOLD: '#3cbe62'
}

class Opportunities extends React.Component {
    constructor(props) {
        super(props);
    }
    onClickBack() {
        console.log('clicked back from customer');
        HashActions.RevertPath();
    }
    render() {
        var {opportunities, opportunitiesLoaded} = this.props;

        var opps = _.map(opportunities, opp => {
            var leftIcon;
            var iconClassName = icons[opp.status];
            var iconStyle = {
                fontSize: 15,
                marginRight: 5,
                verticalAlign: 'text-bottom',
                color: colors[opp.status]
            }
            var amount = sapUtils.formatCurrency(opp.potentialAmount.amount);
            return <ListItem
                        key={opp.id}
                        innerDivStyle={{ paddingTop: 16 }}
                        primaryText={
                            <div style={{fontSize: 14}}>
                                <i className={iconClassName} style={iconStyle} data-tooltip={opp.status}/>
                                {opp.customer && opp.customer.name ? <span style={{marginRight: 5}}>{`${opp.customer && opp.customer.name}`}</span> : null }
                                <span style={{marginRight: 5}}>USD</span>
                                {amount}
                            </div>
                        }
                        onTouchTap={(ev) => window.open(sapUtils.getPermaLink('Opportunity', opp.id))}
                        secondaryText={<div style={{fontSize: 12}}>{opp.description}</div>}/>
        })
        return (
            <SidebarWrap>
                <SidebarAppbar
                    title="Opportunities"
                    onRefresh={Store.reload}
                />
                <Body loading={!opportunitiesLoaded} ref="body">
                    <div style={{height:'100%', overflow:'auto',background:'#fff', borderRadius: 2}}>
                        {opps}
                    </div>
                </Body>
            </SidebarWrap>
        )
    }
}
export default Container(Opportunities, Store);
