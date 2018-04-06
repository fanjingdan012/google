import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'reflux';
import BaseCard from 'core/components/base-card';
import Store from 'sap/stores/appointment-activities';
import CalendarEventStore from 'sap/stores/calendar-events';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Badge from 'material-ui/lib/badge';
import Actions from 'sap/actions/appointment-activities';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';

import TooltipActions from 'core/actions/tooltip';
import ModalActions from 'core/actions/modal';

import Container from 'core/components/Container';

import ListCard from './ListCard';
import FlatButton from 'sap/components/buttons/FlatButton';

import StoreStateMixin from 'core/mixins/store-state';

import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

import ActivityTooltip from 'sap/components/tooltips/ActivityTooltip';
import CreateAppointmentModal from 'sap/components/modals/CreateAppointment';

import sapUtils from 'sap/utils';
import calendarUtil from 'sap/utils/google-calendar';

const iconStyle = {
        fontSize: 18,
        marginLeft: 9,
        marginTop: 8,
        width: 18,
        height: 18
    },
    menuItemProps = {
        innerDivStyle: {
            paddingLeft: 38,
        },
        style: {
            lineHeight: '36px',
            fontSize: 14
        }
    },
    openIcon = <FontIcon className="material-icons" style={iconStyle}>open_in_new</FontIcon>,
    editIcon = <FontIcon className="material-icons" style={iconStyle}>edit</FontIcon>,
    gcalImg = <img src={chrome.extension.getURL('images/google_calendar.png')} style={iconStyle}/>,
    formatDate = (d) => moment(d).format('MMM D, YYYY h:mm a');

class AppointmentItem extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'AppointmentItem';
    }
    render() {
        var styles = {
                iconButton: {
                    icon: {  fill: '#272727', width: 18, height: 18 },
                    root: { top: 4, right: -10 }
                },
                icon: {
                    fontSize: 14,
                    marginRight: 5,
                    verticalAlign: 'text-bottom',
                    color: '#757575'
                },
            },
            origin = { horizontal: 'right', vertical: 'top' },
            { activity, onMouseEnter, eventId } = this.props,
            { id, title, content, startTime, endTime } = activity,
            startTime = formatDate(startTime),
            endTime = formatDate(endTime);

        var iconButton = <IconButton iconStyle={styles.iconButton.icon}><MoreVertIcon /></IconButton>;
        // var sapImg = <img src="http://a2.mzstatic.com/us/r30/Purple2/v4/8c/3f/f5/8c3ff5aa-1fbc-3922-ead9-488a6326a099/icon175x175.jpeg" />;

        // var menuItems = [
        //     <MenuItem
        //         {...menuItemProps}
        //         key="edit"
        //         primaryText="Edit"
        //         onTouchTap={() => this.props.onEditActivity(activity, eventId)}
        //         leftIcon={editIcon}
        //     />,
        //     <Divider key="divider"/>,
        //     <MenuItem
        //         {...menuItemProps}
        //         key="open-sap"
        //         primaryText="SAP Anywhere"
        //         onTouchTap={() => window.open(sapUtils.getPermaLink('Activity', id))}
        //         leftIcon={openIcon}
        //     />
        // ];
        // if (!!!eventId) {
        //     menuItems = [
        //         <MenuItem
        //             {...menuItemProps}
        //             key="save"
        //             primaryText="Save"
        //             onTouchTap={() => calendarUtil.createEventFromActivity(activity)}
        //             leftIcon={gcalImg}
        //             data-tooltip="Save to Google Calendar"
        //             data-tooltip-align="l,c"
        //         />,
        //         ...menuItems,
        //     ];
        // } else {
        //     menuItems = [
        //         ...menuItems,
        //         <MenuItem
        //             {...menuItemProps}
        //             key="open-gcal"
        //             primaryText="Google Calendar"
        //             onTouchTap={() => window.open(calendarUtil.getPermaLink(eventId))}
        //             leftIcon={openIcon}
        //         />,
        //     ];
        // }
        var menuItems = [
            <MenuItem
                {...menuItemProps}
                key="edit"
                primaryText="Edit"
                onTouchTap={() => this.props.onEditActivity(activity, eventId)}
                leftIcon={editIcon}
            />,
            <MenuItem
                {...menuItemProps}
                key="save"
                primaryText={!!!eventId ? 'Save to Google Calendar' : 'Update Google Calendar'}
                onTouchTap={() => calendarUtil.updateEventFromActivity(eventId, activity)}
                leftIcon={gcalImg}
            />
        ];
        var rightIconButton = (
            <IconMenu
                anchorOrigin={origin}
                targetOrigin={origin}
                iconButtonElement={iconButton}
                desktop={false}
                autoWidth={false}
                style={{ top: 4, right: -10 }}>
                    { menuItems }
            </IconMenu>
        );
        var primaryText = (
            <div style={{fontSize: 14}}>
                <span className="material-icons" style={styles.icon}>event</span>
                {title}
            </div>
        );

        return <ListItem
                    key={id}
                    primaryText={primaryText}
                    rightIconButton={rightIconButton}
                    onTouchTap={(ev) => window.open(sapUtils.getPermaLink('Activity', id))}
                    secondaryText={<div style={{fontSize: 12}}>{`${startTime} - ${endTime}`}</div>}
                    secondaryTextLines={2}
                    onMouseEnter={ev => onMouseEnter && onMouseEnter(ev)}
                    innerDivStyle={{ paddingRight: 36 }}
                />
    }
}
// AppointmentItem = Container(AppointmentItem, CalendarEventStore)

class AppointmentActivitiesCard extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'AppointmentActivitiesCard';
        // this.state = Store.getState();
    }
    onCreateActivity(ev) {
        var {contact, customer} = this.props;
        var startTime = sapUtils.getNearest30Min();
        var model = {
            startTime: startTime,
            endTime: moment(startTime).add('hours', 1),
            title: `Meeting with ${customer ? customer.displayName : contact.displayName}`,
        };
        if (contact) {
            model.participants = [{
                boNamespace: "com.sap.sbo",
                participantType: "ContactPerson",
                participantId: contact.id,
                displayName: contact.displayName
            }];
        } else {
            model.activityCustomers = [{
                customerId: customer.id,
                displayName: customer.displayName
            }];
        }
        ModalActions.RenderModal(<CreateAppointmentModal model={model}/>);
    }
    onEditActivity(act, eventId) {
        var customerFilter = _.map(act.activityCustomers, cl => `id eq ${cl.customerId}`).join(' or ');
        var contactFilter = _.filter(act.participants, al => al.participantType === 'ContactPerson').map(al => `id eq ${al.participantId}`).join(' or ');
        var select = 'id,displayName';
        var defaultPromise = Promise.resolve([]);

        var customersQuery = customerFilter ? CustomersApi.queryCustomers(customerFilter, select) : defaultPromise;
        var contactQuery = contactFilter ? ContactsApi.queryContacts(contactFilter, select) : defaultPromise;

        Promise.all([customersQuery, contactQuery])
            .then(res => {
                var [customers, contacts] = res;

                _.each(customers, c => {
                    _.each(act.activityCustomers, cl => {
                        if (cl.customerId === c.id) {
                            cl.displayName = c.displayName;
                        }
                    })
                });

                _.each(contacts, c => {
                    _.each(act.participants, al => {
                        if (al.participantId === c.id && al.participantType === 'ContactPerson') {
                            al.displayName = c.displayName;
                        }
                    })
                });

                ModalActions.RenderModal(<CreateAppointmentModal model={act} eventId={eventId}/>);
            })
        ModalActions.RenderModal(<CreateAppointmentModal model={act} eventId={eventId}/>);
    }
    onMouseEnter(ev, item) {
        TooltipActions.TooltipShow({
            parentEl: ev.target,
            element: <ActivityTooltip activity={item} type="appointment"/>
        })
    }
    render() {
        var {visibleActivities, activitiesLoaded, calendarEvents, ...other} = this.props,
            title = 'Appointments',
            styles= {
                icon: {
                    fontSize: 14,
                    marginRight: 5,
                    verticalAlign: 'text-bottom',
                    color: '#757575'
                }
            },
            visibleActivities = _.sortBy(visibleActivities, act => Math.abs(moment().diff(moment(act.startTime)))),
            eventIds = {};

        _.each(calendarEvents, (id, eventId) => eventIds[id] = eventId);

        var activities = _.map(visibleActivities, act => (
            <AppointmentItem
                key={act.id}
                activity={act}
                onMouseEnter={ev => this.onMouseEnter(ev, act)}
                onEditActivity={(act, eventId) => this.onEditActivity(act, eventId)}
                eventId={eventIds[act.id]}
            />
        ))

        let createBtn = <FlatButton onTouchTap={() => this.onCreateActivity()}>Create</FlatButton>
        return (
            <ListCard
                length={visibleActivities.length}
                rightButtonEl={createBtn}
                listTitle={title}
                isLoading={!activitiesLoaded}
                type="list"
                disabled={activities.length === 0}>
                    {activities}
            </ListCard>
        )
    }
}

export default Container(Container(AppointmentActivitiesCard, Store), CalendarEventStore);
