import './init';
import ReactDOM from 'react-dom';
import React from 'react';

import Reflux from 'reflux';
import storeStateMixin from 'core/mixins/store-state';

import CalendarConnector from 'sap/actions/calendar-connector';
import CalendarActions from 'sap/actions/calendar';
import SaveToSapButton from 'sap/components/buttons/SaveToSapButton';

import { default as Comms, ping } from 'lib/comms';

import AppActions from 'sap/actions/app';

import CalendarUtil from 'sap/utils/activity';
import CalendarApi from 'core/api/calendar';

import {showNotification} from 'core/actions/notification';

import ConfigStore from 'sap/stores/config';

// setTimeout(() => {
    ConfigStore.getConfigFromLS()
        .then(res => AppActions.AppStart())
// }, 10);

const {createActivity, updateActivity} = CalendarUtil;

const Controller = Reflux.createStore({
    mixins: [storeStateMixin],
    init() {
        Comms.send({
            action: 'load_calendar_api',
            data: {}
        });
        this.listenTo(CalendarActions.EventOpened, this.onEventOpened.bind(this));
        this.listenTo(CalendarConnector.CalendarConnEventUpdated, this.onCalendarConnEventUpdated.bind(this))
    },
    getInitialState() {
        return {
            events: {}, // calendar events to sync
        }
    },
    onEventOpened(el) {
        var $el = $(el);
        if ($el.hasClass('sap-anywhere')) {
            return;
        }
        $el.addClass('sap-anywhere');
        var btnContainer = $el.children().first();
        var saveBtn = document.createElement('div');
        saveBtn.className = 'ep-ea-btn-wrapper';
        btnContainer.children(':eq(2)').after(saveBtn);
        ping()
            .then(res =>
                ReactDOM.render(<SaveToSapButton eid={$el.data('eid')} onTouchTap={this.onSaveToSap.bind(this)}/>, saveBtn)
            ).catch(err =>
                ReactDOM.render(<SaveToSapButton eid={$el.data('eid')} onTouchTap={this.onSaveToSap.bind(this)} broken/> , saveBtn)
            );
        // ReactDOM.render(<SaveToSapButton eid={$el.data('eid')} onTouchTap={this.onSaveToSap.bind(this)}/>, saveBtn);
    },
    onSaveToSap(eid, activity) {
        return new Promise((resolve, reject) => {
            if (eid === 'newEvent') {
            // create
            // trigger save
                var unsubscribe = CalendarConnector.CalendarConnEventCreated.listen(eid => {
                    CalendarApi.getEventByEid(eid)
                        .then(calendarEvent => createActivity.call(CalendarUtil, calendarEvent), err => { throw err; })
                        .then(res => {
                            console.log(res);
                            resolve(res);
                        }, err => { throw err; })
                        .catch(err => {
                            console.log(err);
                            reject(err)
                        });
                    unsubscribe();
                })
            } else {
                this.state.events[eid] = activity;
                var func = activity && activity.id ? updateActivity : createActivity;
                var promise = CalendarApi.getEventByEid(eid)
                    .then(event => {

                        return event;
                    }, err => { throw err; })
                    .then(event => func.call(CalendarUtil, event, activity), err => { throw err; })
                    .then(resolve)
                    .catch(reject)
            }
        });

    },
    onCalendarConnEventUpdated(eid, xhr) {
        var act = this.state.events[eid];
        if (act) {
            CalendarApi.getEventByEid(eid)
            .then(event => updateActivity.call(CalendarUtil, event, act))
            .then(activity => {
                showNotification('Event saved to SAP Anywhere.');
                return activity;
            }).then(activity => delete this.state.events[eid])
        }
    }
})
