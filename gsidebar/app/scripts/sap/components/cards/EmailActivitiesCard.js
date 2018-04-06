import React from 'react';
import {createStore} from 'reflux';
import EmailActivitiesStore from 'sap/stores/email-activities';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Actions from 'sap/actions/email-activities';

import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import TooltipActions from 'core/actions/tooltip';
import StoreStateMixin from 'core/mixins/store-state';

import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

import Container from 'core/components/Container';

import ListCard from './ListCard';
import ActivityTooltip from 'sap/components/tooltips/ActivityTooltip'
import Badge from 'material-ui/lib/badge';

import sapUtils from 'sap/utils';

var formatDate = (d) => moment(d).format('MMM D, YYYY h:mm a');

class EmailActivitiesCard extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'EmailActivitiesCard';
        this.state = EmailActivitiesStore.getState();
    }
    onMouseEnter(ev, item) {
        TooltipActions.TooltipShow({
            parentEl: ev.target,
            element: <ActivityTooltip activity={item} type="email"/>
        })
    }
    render() {
        var {emailActivitiesLoaded, visibleActivities, ...other} = this.props;
        var title = 'Email Activities';
        var styles= {
            icon: {
                fontSize: 14,
                marginRight: 5,
                verticalAlign: 'text-bottom',
                color: '#757575'
            }
        }
        var activities = _.map(visibleActivities, act => {
            var content = $('<div></div>').html(act.content).text();
            return <ListItem
                key={act.id}
                secondaryTextLines={2}
                primaryText={
                    <div style={{fontSize: 14}}>
                        <span className="material-icons" style={styles.icon}>email</span>
                        {act.title}
                    </div>
                }
                onTouchTap={(ev) => window.open(sapUtils.getPermaLink('Activity', act.id))}
                secondaryText={
                    <div style={{fontSize: 12}}>
                        <div className="truncate">{content}</div>
                        <div>{sapUtils.formatDate(act.startTime)}</div>
                    </div>
                }
                onMouseEnter={ev => this.onMouseEnter(ev, act)}
            />
        })
        var list = <List>{activities}</List>
        return (
            <ListCard
                length={visibleActivities.length}
                listTitle={title}
                isLoading={!emailActivitiesLoaded}
                disabled={activities.length === 0}>
                {activities}
            </ListCard>
        );
    }
}

export default Container(EmailActivitiesCard, EmailActivitiesStore);
