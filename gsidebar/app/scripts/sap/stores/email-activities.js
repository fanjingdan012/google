import Reflux from 'reflux';
import EmailViewActions from 'core/actions/email-view';
import ReactDOM from 'react-dom';
import EmailButton from 'sap/components/EmailButton';
import React from 'react';
import CustomersApi from 'sap/api/customers';
import EmailActivityApi from 'sap/api/email-activities';
import AllSettledPromise from 'lib/utils';
import EmailActivityActions from 'sap/actions/email-activities';

import CustomerActions from 'sap/actions/customers';

import StoreStateMixin from 'core/mixins/store-state';

const getEmail = emailAdd => {
    return emailAdd;
}

export default Reflux.createStore({
    mixins: [StoreStateMixin],
    listenables: [EmailViewActions, EmailActivityActions, CustomerActions],
    init(){
        this.state = {
            emailActivities: [],
            emailActivitiesLoaded: false,

            visibleActivities: [],
            cardType: '',
            idFilter: null

        }
    },
    preEmit(state) {

        return {
            ...state,
            visibleActivities: this._getVisibleActivities(state).sort((a, b) => {
                var aTime = moment(a.startTime);
                var bTime = moment(b.startTime);
                if (aTime.isBefore(bTime)) {
                    return 1;
                } else {
                    return -1;
                }
            })
        }
    },

    // onReloadContactPage() {
    //     this._onReloadPage();
    // },
    onReloadCustomerPage() {
        this._onReloadPage();
    },
    _onReloadPage() {
        this.setState({ emailActivitiesLoaded: false, emailActivities: [], visibleActivities: [] });
        this.onShowCustomer(this.getState('idFilter'));
    },
    onShowCustomer(idFilter) {
        var cardType = 'customer';
        this.setState({ idFilter, cardType });
        if (this.getState('emailActivitiesLoaded')) {
                // var newState = this._getVisibleActivities(this.getState('emailActivities'), type, id);

                // this.setState(newState);
        } else {
            // this._loadActivities()
            //     .then(list => this._getVisibleActivities(list, type, id))
            //     .then(newState => this.setState(newState))
            this._loadActivities()
                .then(emailActivities => this.setState({ emailActivities, emailActivitiesLoaded: true }))
        }
    },

    _getVisibleActivities({ emailActivities, cardType, idFilter }) {
        // var {visibleActivities} = this.getState();
        var visibleActivities = [];
        if (cardType === 'customer' && _.isNumber(idFilter)) {
            visibleActivities = _.filter(emailActivities, act => act.activityCustomers.filter(cl => cl.customerId === idFilter).length > 0)
        } else if (cardType === 'contact') {
            // visibleActivities = _.filter(emailActivities, act => act.activityCustomers.filter(cl => cl.customer.id === id).length > 0)
        }
        return visibleActivities;
        // return {
        //     visibleActivities,
        //     emailActivities,
        //     emailActivitiesLoaded: true,
        //     cardType: type,
        //     idFilter: id
        // }
    },

    // onLoadEmailActivities(force) {
    //     if (!this.getState('emailActivitiesLoaded') || force) {
    //         this._loadActivities()
    //     }
    //     return;
    // },
    onEmailBtnContainerInserted(container, emailData, msgId) {
        ReactDOM.render(<EmailButton emailData={emailData}  msgId={msgId} onQuickSave={this.onQuickSave.bind(this)}/>, container);
    },
    onQuickSave(emailData, msgId) {
        var emailsInvolved = _.map(emailData.people_involved, p => p[1] );
        var email = emailData.threads[msgId];
        var content = $('<div>').html(email.content_html).get(0).innerText;
        var emailActivity = {
            title: email.subject,
            activityCustomers: [
                // { customer: {id: 304}},
            ],
            fromAddress: email.from_email,
            toAddressList: email.to || [],
            ccAddressList:email.cc || [],
            content: content,
            // createTime: new Date(email.timestamp),
            startTime: new Date(),
            // canceled: false,
            // canceledReason: null
        }
        EmailActivityApi.quickSave(emailActivity, emailsInvolved)
            .then(
                res => EmailActivityActions.CreateEmailActivityCompleted(res),
                err => console.log(err)
            );
    },
    _loadActivities() {
        return new Promise((resolve, reject) => {
            EmailActivityApi.getEmailActivities()
            .then(resolve, reject)
        })

    },
    createEmailActivity(emailActivity) {
        if (emailActivity.ccAddressList && emailActivity.ccAddressList.length === 0) {
            delete emailActivity.ccAddressList;
        }
        return new Promise((resolve, reject) => {
            EmailActivityApi.createEmailActivity(emailActivity)
                .then(resolve)
                .catch(reject)
        })
    },
    onCreateEmailActivityCompleted(emailActivity) {
        var {emailActivities, cardType, idFilter} = this.getState();
        // var newState = this._getVisibleActivities([...emailActivities, emailActivity], cardType, idFilter);
        // this.setState(newState);
        this.setState({
            emailActivities: [...emailActivities, emailActivity]
        })
    }
})