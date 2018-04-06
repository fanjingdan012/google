import React from 'react';

import {getEventByEid} from 'core/api/calendar';

import {showNotification} from 'core/actions/notification';

import {saveToLocalStorage, getLocalStorage, ping} from 'lib/comms';

const lsKey = 'calendarEvents';
const CONNECTION_ERROR_MESSAGE = 'An ERROR occured. Please try refreshing this page.';
const FAILED_TO_SAVE_MESSAGE = 'Failed to save event to SAP Anywhere';
// for calendar
class SaveToSapButton extends React.Component {

    static propTypes = {
        eid: React.PropTypes.string,
        onTouchTap: React.PropTypes.func,
        broken: React.PropTypes.bool, // if comms is disconnected
    };

    static defaultProps = {
        broken: false,
    };

    constructor(props) {
        super(props);
        this.displayName = 'SaveToSapButton';
        this.state = {
            savedToSAP: false,
            broken: props.broken,
        }
    }
    componentDidMount() {
        if (this.isNewEvent) {
            this.getEventsFromLs().then(res => {
                if (res && res[this.props.eid]) {
                    this.setState({
                        savedToSAP: true,
                        activityId: res[this.props.eid]
                    })
                }
            })
        }
    }
    componentWillReceiveProps({ broken }) {
        if (broken !== this.props.broken) {
            this.setState({ broken });
        }
    }
    isNewEvent() {
        return this.props.eid === 'newEvent';
    }
    onClick(ev) {
        ping()
            .then(this._processClick.bind(this))
            .catch(err => {
                this.setState({ broken: true });
                showNotification(CONNECTION_ERROR_MESSAGE, null, null, 5000);
            });
    }
    _processClick() {
        var { eid, onTouchTap } = this.props;
        var { activityId, savedToSAP } = this.state;
        if (this.isNewEvent()) {
            // showNotification('Saving event to SAP Anywhere...');
            onTouchTap(eid)
            .then(res => {
                showNotification('Event saved to SAP Anywhere.');
                this.saveToLS(res);
            }, err => showNotification(FAILED_TO_SAVE_MESSAGE))
        } else {
            // if (this.state.savedToSAP) {
            //     showNotification('Updating event on SAP Anywhere');
            // } else {
            //     showNotification('Saving event to SAP Anywhere...');
            // }
            onTouchTap(eid, { id: activityId })
                .then(this.saveToLS.bind(this), err => { throw err; })
                .then(
                    act => {
                        if (savedToSAP) {
                            // showNotification('Event updated.')
                        } else {
                            this.setState({ savedToSAP: true, activityId: act.id })
                        }
                    },
                    err => showNotification( (err && err.message) || FAILED_TO_SAVE_MESSAGE )
                );
        }
        $("[id*='save_top']").children().click();
    }
    // for created/updated
    // onCalendarCreated(eid) {
    //     getEventByEid(eid)
    //         .then(res => createActivity(res, this.state.activityId), err => console.log(err))
    //         .then(this.saveToLS.bind(this))
    //         .then(this.unsubscribe);
    // }
    getEventsFromLs() {
        return getLocalStorage({
            key: lsKey
        }).then(res => res.data);
    }
    saveToLS(act) {
        this.getEventsFromLs().then(res => {
            var events = res || {};
            events[act.eid] = act.id;
            saveToLocalStorage({
                key: lsKey,
                value: events
            })

        })
        return act;

    }
    render() {
        var { savedToSAP, broken } = this.state;
        var tooltip = savedToSAP ? 'Update Google Calendar and SAP Anywhere.' : 'Save to Google Calendar and SAP Anywhere';
        var btnLabel = savedToSAP ? 'Update' : 'Save to';
        var styles = {
            img: {
                height: 18,
                width: 92,
                display: 'inline-block',
                position: 'relative',
                top: 4,
                margin: '0 5px',
            },
            label: {
                fontWeight: 500,
                fontSize: 12,
            },
            root: {
                background: '#537BCD',
                color: 'white',
                top: 1,
            }
        };
        if (broken) {
            styles.root = {
                ...styles.root,
                opacity: 0.5,
                cursor: 'initial'
            };
            tooltip = CONNECTION_ERROR_MESSAGE;
        }
        return (
            <div
                className="goog-inline-block goog-imageless-button"
                role="button"
                onClick={ broken ? null : this.onClick.bind(this) }
                style={styles.root}
                data-tooltip={tooltip}
            >
                <div className="goog-inline-block goog-imageless-button-outer-box">
                    <div className="goog-inline-block goog-imageless-button-inner-box">
                        <div className="goog-imageless-button-pos">
                            <div className="goog-imageless-button-top-shadow">&nbsp;</div>
                            <div className="goog-imageless-button-content" style={styles.label}>
                                {btnLabel}
                                <img src={chrome.extension.getURL('/images/sap-anywhere-logo-white.png')} style={styles.img}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaveToSapButton;
