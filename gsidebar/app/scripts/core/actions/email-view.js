import Reflux from 'reflux';
import GmailActions from 'core/actions/gmail';
import GmailConnActions from 'core/actions/gmail-connector';

const EmailViewActions = Reflux.createActions([
    'EmailBtnContainerInserted'
])
export default EmailViewActions;

const emailController = {
    emailData: {},
    target: {},
    waitingForEmailData: false,
    firstLoad: true,
    reset: function() {
        this.emailData= {};
        this.target= {};
        this.waitingForEmailData= false;
    },
    setEmailData: function(emailData) {
        this.emailData = emailData;

        if (this.firstLoad) {
            this.findOpenedEmail();
            this.firstLoad = false;
        }

        if (this.waitingForEmailData) {
            this.waitingForEmailData = false;
            this.start();
        }
    },
    setTarget: function(target) {
        this.target = target;
    },
    start: function() {

        if (!Object.keys(this.emailData).length) {
            this.waitingForEmailData = true;
            return;
        }

        if (this.target && $(this.target).find('.btn-wizy-email').length === 0) {
            var container = document.createElement('span');
            container.className = 'btn-wizy-email';
            this.insertContainer(this.target, container);
            // this.insertButton(container);
            var msgId = $(this.target).find('.ii.gt.adP').attr('class').match(/m(.+?) /)[1];
            EmailViewActions.EmailBtnContainerInserted(container, this.emailData, msgId);
        }
    },
    insertContainer: function(target, container) {
        $(target).find('td.gH.acX').prepend(container);
    },
    findOpenedEmail: function() {
        var openedEmails = $('.nH.hx .nH .h7');
        var self = this;
        if (openedEmails.length > 0) {
            openedEmails.each(function() {
                var $el = $(this);
                if ($el.find('.btn-wizy-email').length === 0) {
                    self.setTarget(this);
                    self.start();
                }
            })
        }
    }
}

GmailActions['GmailEmailOpened'].listen(function(emailEl) {

    emailController.setTarget(emailEl);
    emailController.start();
});

GmailActions['GmailViewChange'].listen(function(params) {
    /// clear email data on when going back to gmail list view
    if (params.view_type === 'list') {
        emailController.reset();
    }
});
GmailConnActions['GmailConnThreadOpen'].listen(function(emailData) {
    emailController.setEmailData(emailData);
});
// GmailConnActions['GmailConnInboxOpen'].listen(function(data) {
//     console.log(data);
// })
