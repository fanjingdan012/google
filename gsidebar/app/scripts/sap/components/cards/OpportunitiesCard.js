import React from 'react';
import {createStore} from 'reflux';

import ModalActions from 'core/actions/modal';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';

import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import StoreStateMixin from 'core/mixins/store-state';

import Container from 'core/components/Container';

import ListCard from './ListCard';

import Badge from 'material-ui/lib/badge';

import sapUtils from 'sap/utils';

import Store from 'sap/stores/opportunities';
import FlatButton from 'sap/components/buttons/FlatButton';

import CreateOpportunity from 'sap/components/modals/CreateOpportunity';

var formatDate = (d) => moment(d).format('MMM D, YYYY h:mm a');

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

class OpportunitiesCard extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'OpportunitiesCard';
    }
    onCreateOpportunity() {
        var { id, displayName } = this.props.customer;
        var model = {
            customer: { id, displayName },
            startDate: new Date(),
            predictedClosingDate: new Date(),
            potentialAmount: '0.00',
        };
        ModalActions.RenderModal(<CreateOpportunity model={model}/>);
    }
    render() {
        var {visibleOpps, visibleOppsLoaded, ...other} = this.props;
        var title = "Opportunities";
        var opps = _.map(visibleOpps, opp => {
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
                            <div style={{ fontSize: 14 }}>
                                <i className={iconClassName} style={iconStyle} data-tooltip={opp.status}/>
                                <span style={{ marginRight: 5 }}>USD</span>
                                {amount}
                            </div>
                        }
                        onTouchTap={(ev) => window.open(sapUtils.getPermaLink('Opportunity', opp.id))}
                        secondaryText={<div style={{ fontSize: 12 }}>{opp.description}</div>}/>
        })
        let createBtn = <FlatButton onTouchTap={() => this.onCreateOpportunity()}>Create</FlatButton>;
        return (
            <ListCard
                length={visibleOpps.length}
                listTitle={title}
                isLoading={!visibleOppsLoaded}
                disabled={opps.length === 0}
                rightButtonEl={createBtn}
            >
                {opps}
            </ListCard>
        );
    }
}

export default Container(OpportunitiesCard, Store);
