import * as Reflux from 'reflux';
import $ from 'jquery';
import wizyUtil from '../utils/wizy'
import {setComposeValues} from 'core/utils/compose';

let GmailActions = Reflux.createActions([
    /// outbound
    'GmailComponentsInjected',
    'GmailEmailHovered',
    'GmailComposeOpened',
    'GmailReplyOpened',
    'GmailEmailOpened',
    'GmailGContactChanged',
    'GmailNotificationDiscarded',
    'PreGmailViewChange',
    'GmailViewChange',
    'GmailPopoutContainerClick',

    'GmailClickedEmailButton',

    /// inbound
    'GmailOpenCompose', /// openFor, params {to, cc, bcc, etc.}
    'GmailSetDiscardNotification', /// discardFor
    'GmailOpenThread',
    'GmailFindOpenedComposed', // used on login success
    'GmailSetDOMListeners',
    'InjectCss'
]);
GmailActions['GmailPageSetup'] = Reflux.createAction({children: ['completed', 'failed']});

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
            this.insertContainer(this.target, container);
            this.insertButton(container);
        }
    },
    insertContainer: function(target, container) {
        $(target).prepend(container);
    },
    insertButton: function(container) {
        React.render(
            <Components.EmailButton emailData={this.emailData}/>,
            container
        );
        //this.reset();
    },
    findOpenedEmail: function() {
        var openedEmails = $('.nH.hx .nH .h7');
        var self = this;
        if (openedEmails.length > 0) {
            openedEmails.each(function() {
                var $el = $(this);
                if ($el.find('.btn-wizy-email').length === 0) {
                    self.setTarget($el.find('td.gH.acX')[0]);
                    self.start();
                }
            })
        }
    }
}

const _EMAIL_ELEMENTS = [
    '.F.cf.zt .yP[email]',
    '.F.cf.zt .zF[email]',
    '.nH.if span[email],.person-icon',
    '.aoD.hl',
    '.vN.Y7BVp',
    'a[href*="mailto"]',
    '.gs .gE .cf .go',
    'span.aaf > .aai[title]',
    '.aju .ajn',
    'span.vN, .oL.aDm > span',
    '.nH.if span[email] ~ .go',
];
const actionMethods = {
    gmailEl: null,
    triggerOnAddRecipient: true,
    _mouseoverEmailTimeout: null,
    _currViewType: null,
    _currViewHash: null,
    _gcontactHasChange: false,
    openFor: '',
    discardFor: '',
    startPageSetup: function() {
        var self = this;
        // wait for gmail
        return new Promise((resolve, reject) => {
             self.waitForGmailPage()
                .then(function(){

                    // initialize _currViewHash
                    var hash = window.location.hash;
                    self._currViewHash = (hash.indexOf('?') > -1) ? hash.substring(0, hash.indexOf('?')) : hash;

                    //self.setDOMEventListeners();
                    self.injectWizyContainers();
                    resolve();
                })
                .catch(function() {
                    reject();
                });
        })
    },

    _fireAction: function(action, params) {
        /// central action dispatcher
        action.apply(null, Array.prototype.slice.call(arguments).slice(1));
    },

    _isGmailPageLoaded: function(gmailBody) {
        var v, leftMenu;
        if ( gmailBody && gmailBody.length ) {
            v = gmailBody.find('div[role=navigation]');
            if (v.length > 0) { // gmail page loaded
                leftMenu = v.first().closest('div');
            }
            if (leftMenu && leftMenu.length > 0) {
                // gmail page is fully loaded
                return true;
            }
            return false;
        }
    },

    _readViewType: function() {
        if ($('div.Cq.RdSZF').length > 0 || $('div.A1.D.E').length > 0 || $('div[gh=tl]').length > 0) {
            return 'list';
        } else if ($('.nH.qZ.G-atb').length > 0) {
            return 'settings';
        } else if ($('table.Bs.nH.iY').length > 0) {
            return 'conversation';
        } else if ($('div.fN').length > 0) {
            return 'compose';
        } else {
            return null;
        }
    },

    _clearMouseOverTimeout: function() {
        if (this._mouseoverEmailTimeout) {
            clearTimeout(this._mouseoverEmailTimeout);
            this._mouseoverEmailTimeout = null;
        }
    },
    DOMMutationListener: function(event) {
        if (event.animationName === 'gmail-compose-dialog'){
            /// hide compose el for sometime for injecting app elements

            if ($(event.target).hasClass('wizified')) {return;}
            $(event.target).css('visibility', 'hidden').addClass('wizified');

            setTimeout(function() {
                // this triggers another gmail-compose-dialog mutation
                $(event.target).css('visibility', 'visible');
            }, 10);

            this._fireAction(GmailActions['GmailComposeOpened'], event.target, this.openFor, false, this.composeParams);
            this.openFor = '';
            this.composeParams = {};
        }
        if(event.animationName === 'gmail-reply-open'){
            this._fireAction(GmailActions['GmailReplyOpened'], event.target);
        }
        if (event.animationName === 'email-inserted') {
            this._fireAction(GmailActions['GmailEmailOpened'], event.target);
        }
        if (event.animationName === 'recepient-added') {
            if (this.triggerOnAddRecipient) {
                this._fireAction(GmailActions['GmailEmailHovered'], $(event.target).attr('email'));
            } else {
                this.triggerOnAddRecipient = true;
            }
        }
        if (event.animationName === 'gmail-notification') {
            if (this._currViewHash && this._currViewHash.indexOf('#contact') === 0) {
                this._gcontactHasChange = true;
                var id = '';
                var index = this._currViewHash.indexOf('/');
                if (index > -1) {
                    id = this._currViewHash.substring(index+1, this._currViewHash.length);
                    this._fireAction(GmailActions['GmailGContactChanged'], {id: id});
                }
            } else {
                if (event.target.textContent.toLowerCase().indexOf('your message has been discarded') > -1) {

                    // $(event.target).css('visibility', 'hidden');
                    // setTimeout(function() {
                    //     $(event.target).css('visibility', 'visible');
                    // }, 10);

                    this._fireAction(GmailActions['GmailNotificationDiscarded'], event.target, this.discardFor);
                    this.discardFor = '';
                }
            }
        }
    },
    setMouseoverEmailListener: function() {
        var self = this;

        //console.log('Gmail.View.initMouseoverEmailListener');
        function triggerMouseoveEvent(email) {
            if (email) {
                self._clearMouseOverTimeout();
                self._mouseoverEmailTimeout = setTimeout(function() {
                    self._fireAction(GmailActions['GmailEmailHovered'], email);
                }, 400);
            }
        }

        _EMAIL_ELEMENTS.forEach(function(email_el) {

            $(email_el).off('.gmaileEmailHover').on('mouseenter.gmaileEmailHover', function(ev) {
                var email = wizyUtil.cleanEmail( $(this).attr('email') || $(this).text() );
                if (email) {
                    triggerMouseoveEvent(email);
                }
            }).on('mouseleave.gmaileEmailHover', self._clearMouseOverTimeout.bind(self));
        });

        $('textarea[name=to], textarea[name=cc], textarea[name=bcc]').on('click', function() {
            var textarea = $(this),
                selectionStart = this.selectionStart,
                email = wizyUtil.getEmailAddressAtPosition(textarea.val(), selectionStart);
            if (email) {
                //Ext.vent.trigger('Gmail:mouseover:email', email);
                this._fireAction(GmailActions['GmailEmailHovered'], email);
            }
        });
    },
    setDOMEventListeners: function() {
        var self = this;

        // if ($('.nH.Hd[role=dialog]').length) {
        //     this.DOMMutationListener({
        //         animationName: 'gmail-compose-dialog',
        //         target: $('.nH.Hd[role=dialog]')[0]
        //     });
        // }

        document.addEventListener('webkitAnimationStart',this.DOMMutationListener.bind(this), false);

        //listener for switch tabs
        $('td[role=heading]').click(function () {
            self.setMouseoverEmailListener();
        });

        window.top.window.addEventListener('hashchange', function() {
            var newViewType = self._readViewType();
            var newViewHash, hash = window.location.hash;
            newViewHash = (hash.indexOf('?') > -1) ? hash.substring(0, hash.indexOf('?'))
                : hash;

            // trigger Gmail:view:change if the url hash changed to setMouseoverEmailListener
            if (newViewType === self._currViewType && newViewHash === self._currViewHash) {
                return;
            }
            // Update google contact cach when transfering from gcontact page to another page
            if (hash.indexOf('#contact') === -1 && self._currViewHash.indexOf('#contact') === 0 && self._gcontactHasChange) {
                self._gcontactHasChange = false;
            }
            self._currViewType = newViewType;
            self._currViewHash = newViewHash;
            self._fireAction(GmailActions['PreGmailViewChange'], {view_type: newViewType});
            self._fireAction(GmailActions['GmailViewChange'], {view_type: newViewType});
        });
        this._currViewType =  this._readViewType();

        this.setMouseoverEmailListener();
        $('.aSs').unbind('click').click(function(ev) {
            if (ev.target.className === 'aSs') {
                GmailActions['GmailPopoutContainerClick']();
            }
        });
    },
    injectWizyContainers: function() {
        if ($('#wizy-modal-container').length === 0) {
            $(document.body).append('<div id="wizy-modal-container"></div>');
        }
        if ($('#wizy-actionButton-container').length === 0) {
            $(document.body).append('<div id="wizy-actionButton-container"></div>');
        }
        if ($('#wizy-sidebar-container').length === 0) {
            $(document.body).append('<div id="wizy-sidebar-container" style="padding-top: 108px;"></div>');
        }
        if ($('#wizy-tooltip').length === 0) {
            $('#wizy-sidebar-container').before('<div id="wizy-tooltip" class="white"></div>');
        }
        if ($('#wizy-popout-container').length === 0) {
            $('.aSs .aSt').prepend('<div id="wizy-popout-container" style="height: 100%;"></div>');
        }
        if ($('#wizy-notification-container').length === 0) {
            $(document.body).append('<div id="wizy-notification-container"></div>');
        }
        if ($('#wizy-account-info-container').length === 0) {
            var bannerEl = $('div[role=banner] > div > div > div');
            if (bannerEl && bannerEl.length) {
                $(bannerEl[0]).prepend('<div id="wizy-account-info-container"></div>');
            }
        }
    },
    waitForGmailPage: function() {
        // wait for gmail page to be completely loaded
        var self = this;
        return new Promise((resolve, reject) => {
            var delayed_loader_count = 0;
            // Here we do delayed loading until success. This is in the case
            // that our script loads after Gmail has already loaded.

            var delayed_loader = setInterval(function() {

                var canvas = document.getElementById('canvas_frame');
                canvas = canvas ? $(canvas.contentDocument) : $(document);

                var gmailBody = $(canvas.find('body').first());

                // Utils.Gmail.setGmailEl(gmailBody);

                if (self._isGmailPageLoaded(gmailBody) ) {
                    self.gmailEl = gmailBody;
                    clearInterval(delayed_loader);
                    resolve();
                } else {
                    delayed_loader_count += 1;
                }
                if (delayed_loader_count > 60) { // wait until 30 secs for gmail to load
                    console.warn('gmail took too long to load. aborting');
                    clearInterval(delayed_loader);
                    reject();
                }
            }, 500);
        })

    },
    openGmailCompose: function(openFor, params){
        this.openFor = openFor;
        this.composeParams = params;
        this.triggerOnAddRecipient = _.isEmpty(params);
        var composeEl = $('.T-I.J-J5-Ji.T-I-KE.L3')[0];
        if  (composeEl) {
          //Trigger mouse down event
          var mouseDown = document.createEvent('MouseEvents');
          mouseDown.initEvent( 'mousedown', true, false );
          composeEl.dispatchEvent(mouseDown);

          //Trigger mouse up event
          var mouseUp = document.createEvent('MouseEvents');
          mouseUp.initEvent( 'mouseup', true, false );
          composeEl.dispatchEvent(mouseUp);
          return true;
        }
        return false;
    },
    findOpenedCompose: function() {
        var self = this, composeDialogs = $('.nH.Hd[role=dialog]');
        if (composeDialogs && composeDialogs.length > 0) {
            composeDialogs.each(function(el) {
                self._fireAction(GmailActions['GmailComposeOpened'], this, self.openFor, false, self.composeParams);
            })
        }
    },
    injectCss: function (css) {
        var head  = document.getElementsByTagName('body')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = `${chrome.runtime.getURL('styles/' + css)}`;
        link.media = 'all';
        head.appendChild(link);
    }
}

const GmailListener = Reflux.createStore({
    listenables: [GmailActions],
    onInjectCss(css) {
        if (_.isArray(css)) {
            _.each(css, c => actionMethods.injectCss(c))
        } else {
            actionMethods.injectCss(css);
        }
    },
    onGmailOpenCompose() {
        actionMethods.openGmailCompose.apply(actionMethods, arguments);
    },
    onGmailComposeOpened(target, openFor, isReply, params) {
        if (!_.isEmpty(params)) {
            setTimeout(() => {
                setComposeValues(target, params, params.bodyForceClear, params.bodyForceAppend);
            }, 10);
        }
    },
    onGmailEmailOpened(emailEl) {
        emailController.setTarget($(emailEl).find('td.gH.acX')[0]);
        emailController.start();
        actionMethods.setMouseoverEmailListener();
    },
    onGmailViewChange(params) {
        if (params.view_type === 'list' && !!~location.hash.indexOf('inbox')) {
            emailController.reset();
        }
        /// init mouse over on viewchange
        actionMethods.setMouseoverEmailListener();
    },
    onGmailOpenThread() {
        window.location.hash = '#inbox/' + threadId;
    },
    onGmailFindOpenedComposed() {
        actionMethods.findOpenedCompose();
    },
    onGmailSetDOMListeners() {
        actionMethods.setDOMEventListeners();
    }
})

GmailActions.GmailPageSetup.listen(function() {
    console.debug('initializing gmail...');
    actionMethods.startPageSetup()
                    .then(() => {
                        this.completed();
                    }).catch(this.failed)
});
// GmailActions.GmailOpenCompose.listen(function() {
//     actionMethods.openGmailCompose.apply(actionMethods, arguments);
// });

// GmailActions['GmailComposeOpened'].listen(function(target, openFor, isReply, params) {
//     if (!_.isEmpty(params)) {
//         setTimeout(() => {
//             setComposeValues(target, params, params.bodyForceClear, params.bodyForceAppend);
//         }, 10);
//     }
// });

// GmailActions['GmailEmailOpened'].listen(function(emailEl) {
//     emailController.setTarget($(emailEl).find('td.gH.acX')[0]);
//     emailController.start();
//     actionMethods.setMouseoverEmailListener();
// });

// GmailActions['GmailViewChange'].listen(function(params) {
//     /// clear email data on when going back to gmail list view
//     if (params.view_type === 'list' && !!~location.hash.indexOf('inbox')) {
//         emailController.reset();
//     }

//     /// init mouse over on viewchange
//     actionMethods.setMouseoverEmailListener();
// });

// GmailActions.GmailOpenThread.listen(function(threadId) {
//     window.location.hash = '#inbox/' + threadId;
// });

// GmailActions['GmailSetDiscardNotification'].listen(function(discardFor){
//     actionMethods.discardFor = discardFor;
// });

// GmailActions.GmailFindOpenedComposed.listen(function() {
//     actionMethods.findOpenedCompose();
// })
// GmailActions.GmailNotificationDiscarded.listen(function(target, discardFor) {
//     if (discardFor) {
//         $(target).parent().css('visibility', 'hidden');
//     } else {
//         $(target).parent().css('visibility', 'visible');
//     }
// });

// GmailActions.GmailSetDOMListeners.listen(function() {
//     actionMethods.setDOMEventListeners();
// });

// GmailActions.GmailPageSetup.completed.listen(func)

export default GmailActions