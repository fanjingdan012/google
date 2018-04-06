import React from 'react';
import {createStore} from 'reflux';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import TooltipActions from 'core/actions/tooltip';
import StoreStateMixin from 'core/mixins/store-state';

import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';

import Container from 'core/components/Container';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

import sapUtils from 'sap/utils';
import colors from 'sap/styles/colors';

var formatDate = (d) => moment(d).format('MMM D, YYYY h:mm a');

const Link = ({ id, style, tooltip }) => (
    <IconButton
        style={style}
        data-tooltip={tooltip}
        iconStyle={{ color: colors.link }}
        onTouchTap={ ev => window.open(sapUtils.getPermaLink('Activity', id)) }
    >
        <FontIcon className="material-icons">open_in_new</FontIcon>
    </IconButton>
)

const TooltipStore = createStore({
    mixins: [StoreStateMixin],
    getInitialState() {
        return {
            contacts: [],
            contactsLoaded: false,

            customers: [],
            customersLoaded: false
        }
    },
    fetchRelatedBOs(contactIds, customerIds) {
        var contactFilter = this.createIdFilter(contactIds);
        var customerFilter = this.createIdFilter(customerIds);
        var select = 'id,displayName';

        if (customerFilter) {
            CustomersApi.queryCustomers(customerFilter, select)
                .then(customers => this.setState({customers, customersLoaded: true}))
        }

        if (contactFilter) {
            ContactsApi.queryContacts(contactFilter, select)
                .then(contacts => this.setState({contacts, contactsLoaded: true}))
        }

    },
    reset() {
        this.setState(this.getInitialState());
    },
    createIdFilter(ids) {
        return ids && ids.length ? ids.map(id => `id eq ${id}`).join(' or ') : null;
    }
});

const Field = ({label, value, icon}) => (
    <div style={{width: '100%', minHeight: 35}}>
        <div style={{width: 110, display: 'inline-block', lineHeight: '35px', position: 'absolute'}}>
            <i className="material-icons" style={{fontSize: 14, color: '#757575'}}>{icon}</i>
            {label}
        </div>
        <div style={{paddingLeft: 150, fontSize: 12, lineHeight: '35px'}}>
            {value}
        </div>
    </div>
);
const Participant = ({displayName, id, type}) => (
    <div>
        <a href="javascript:void(0)" style={{textDecoration: 'none', color: '#4a90e2', lineHeight: '35px'}} onTouchTap={() => type === 'customer' ? CustomerActions.ShowCustomer(id) : ContactActions.ShowContactPage(id)}>
            {displayName}
        </a>
    </div>
)

class ActivityTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ActivityTooltip';
    }
    componentDidMount() {
        TooltipStore.reset();
        this.fetchRelatedBOs(this.props);
    }
    fetchRelatedBOs(props) {
        var contactIds = _.filter(props.activity.participants, al => al.participantType === 'ContactPerson').map(al => al.participantId);
        var customerIds = _.map(props.activity.activityCustomers, cl => cl.customerId);
        TooltipStore.fetchRelatedBOs(contactIds, customerIds);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.activity.id !== nextProps.activity.id) {
            TooltipStore.reset();
            this.fetchRelatedBOs(nextProps)
        }
    }
    render() {
        var {activity, contacts, contactsLoaded, customers, customersLoaded, type} = this.props;
        var startTime = formatDate(activity.startTime);
        var endTime = formatDate(activity.endTime);
        var customersEl = _.map(customers, c => (
            <Participant key={c.id} {...c} type="customer"/>
        ));
        var participantsEl = _.map(contacts, c => (
            <Participant key={c.id} {...c} type="contact"/>
        ));

        var styles = {
            title: {
                container: {
                    position: 'relative',
                },
                label: {
                    width: 'calc(100% - 36px)',
                },
                iconBtn: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 36,
                    height: 36,
                    padding: 6,
                },
                icon: { position: 'relative', top: 4, marginRight: 8, color: '#757575' }
            },
        }

        return (
            <div>
                <CardTitle
                    style={{paddingTop: 0}}
                    title={
                        <div style={styles.title.container}>
                            <div style={styles.title.label}>
                                <span
                                    className="material-icons"
                                    style={styles.title.icon}>
                                        {type ==='email' ? 'email' : 'event'}
                                </span>
                                {activity.title}
                            </div>
                            <Link id={activity.id} tooltip="Open in SAP Anywhere" style={styles.title.iconBtn} iconStyle={styles.title.icon}/>
                        </div>
                    }/>
                <div style={{padding: '0 16px'}}>
                    <Divider/>
                </div>
                <CardText >
                    {type === 'email' ? null : <Field label="Start Time" value={startTime}/>}
                    {type === 'email'? null : <Field label="End Time" value={endTime}/>}
                    <Field label="Customers" value={customersEl}/>
                    {type === 'email'? null : <Field label="Participants" value={participantsEl}/>}
                </CardText>
                {activity.content ?
                    <div>
                        <div style={{padding: '0 16px'}}>
                            <Divider/>
                        </div>
                        <CardText>
                            <div style={{whiteSpace: 'pre-line', fontSize: 14, wordBreak: 'break-word'}} dangerouslySetInnerHTML={{__html: activity.content}}/>
                        </CardText>
                        <div style={{padding: '0 16px'}}>
                            <Divider/>
                        </div>
                    </div>
                    : null}
            </div>
        )
    }
}
export default Container(ActivityTooltip, TooltipStore);
