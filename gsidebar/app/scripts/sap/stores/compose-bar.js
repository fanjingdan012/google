import Reflux from 'reflux';
import GmailActions from 'core/actions/gmail';
import React from 'react';
import ReactDOM from 'react-dom';
import {getComposeId} from 'core/utils/compose';
import ComposeBar from 'sap/components/ComposeBar';
import {getEmailFromDom, extractEmails} from 'lib/utils';
import api from 'sap/api/email-activities';
import GmailConnActions from 'core/actions/gmail-connector';
import EmailActivityActions from 'sap/actions/email-activities';
import ConfigStore from 'sap/stores/config';
// export default const Actions = Reflux.createActions({

// })
var save_outgoing_emails = true;

ConfigStore.listen(function (config) {
    save_outgoing_emails = config.save_outgoing_emails;
});

var Controller = Reflux.createStore({
    listenables: [GmailActions, GmailConnActions],
    init() {
        this.state = {
            emailsToSave: {}
        }
    },
    onGmailReplyOpened(target, openFor, isReply, composeValues) {
        this.onGmailComposeOpened(target, openFor, true, composeValues);
    },
    onGmailComposeOpened(target, openFor, isReply, composeValues) {
        if ($(target).find('.wizy-barcontainer').length) {
            return;
        }
        var afterWizyBar = $(target).find('.aDh'),
            container = document.createElement('div'),
            composeId = getComposeId(target),
            props = {
                composeId: composeId,
                target: target,
                isReply: isReply,
                isChecked: save_outgoing_emails
            };


        container.setAttribute('class', `wizy-barcontainer ${isReply ? 'aDh' : ''}`);
        // insert container
        afterWizyBar.before(container);

        if (isReply) {
            $(target).append('<div class="wzpadder" style="height: 50px"></div>');
        }
        ReactDOM.render(
            <ComposeBar {...props} onComposeSend={(composeId, email) => this.onComposeSend(composeId, email)}/>,
            container
        );
    },
    onComposeSend(composeId, email) {
        this.state.emailsToSave[composeId] = email;
    },
    onGmailConnEmailSent(data) {
        var emailsToSave = this.state.emailsToSave;
        var composeId = data.composeid;
        var email = emailsToSave[composeId];
        if (email) {
            console.log('email sent', data);
            this._saveToSap(email);
        }
    },
    _saveToSap(email) {
        var toAddressList = ((email.to && email.to.split(';')) || []).map(e => extractEmails(e)[0]).filter( e => e);
        var ccAddressList = ((email.cc && email.cc.split(';')) || []).map(e => extractEmails(e)[0]).filter( e => e);;
        // var bccEmails = email.bcc.split(';');
        var fromAddress = getEmailFromDom();
        var emailAddrs = [...toAddressList, ...ccAddressList, fromAddress];

        var activity = {
            fromAddress,
            toAddressList,
            ccAddressList,
            title: email.subject,
            content: email.content,
            activityCustomers: [],
            startTime: new Date(),
        }
        api.quickSave(activity, emailAddrs)
            .then(
                res => EmailActivityActions.CreateEmailActivityCompleted(res),
                err => console.log('failed to create email activity', err)
            )
    }

})