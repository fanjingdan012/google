import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
var jQuery = $;

var RE_EMAIL =  /([a-z0-9!#$%&'\*+\-\/=?\^_`\{\|\}~\.]+@(?:[a-z0-9\-]+)(?:\.[a-z0-9\-]+)+)/i,
    REGEX_EMAILADDRESS =  new RegExp(RE_EMAIL.source + '>?', 'i'),
    RE_PUNCT = new RegExp('([\"\'/\\\\~|.<>:;\\-=#_' + ['\u00a6', '\u00ab', '\u00b7', '\u00bb', '\u2010', '\u2011', '\u2012', '\u2013', '\u2014', '\u2015', '\u2016', '\u2022', '\u2023', '\u2039', '\u203a'].join('') + '])', 'g');
    
export default {
        removeTags: function(context) {
            var text = $("<div>").html(context).text();
            return text;
        },
        extractName: function(input) {
            if (input.indexOf('<') > -1) {
                return input.substring(0, input.indexOf('<'));
            } else {
                return null;
            }
        },
        extractEmails: function(input) {
            return _((input || '').split(RE_EMAIL)).chain().select(function(str, index) {
                return index % 2 === 1;
            }).invoke('toLowerCase').value();
        },
        cleanEmail: function(input) {
            return this.extractEmails(input)[0] || null;
        },
        cleanDomain : function(input) {
            input = input.indexOf('@') === -1 ? input : input.split('@')[1];
            return (typeof input !== "undefined" ?
                        input.split('.')[input.split('.').length-2] + "." + input.split('.')[input.split('.').length-1]
                        : '');
        },
        checkValidEmail: function (input) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(input);
        },
        getCompanyFromEmail : function(input) {
            /* must be an email */
            var address = this.cleanDomain(input) || '';
            return {
                domain : address,
                name   : address.split('.')[address.split('.').length-2].capitalize()
            };
        },
        getEmailAddressAtPosition: function(text, offset) {
            var fragments = text.split(REGEX_EMAILADDRESS), prefix, email;
            if (fragments.length === 1) {
                return false;
            }
            do {
                prefix = fragments.shift();
                email = fragments.shift();
                offset -= prefix.length + email.length;
                if (offset <= 0) {
                    return email.replace(/>$/, '');
                } else if (fragments.length === 1) {
                    return email.replace(/>$/, '');
                }
            } while (fragments.length);
        },

        getCurrencySymbol: function(value) {
            if (_.contains(['USD', 'SGD'], value)) {
                return '$';
            } else if (_.contains(['PHP'], value)) {
                return 'P';
            } else {
                return value;
            }
        },

        getEmailName: function(thread, email) {
            var people = {};
            if (thread) {
                thread.people_involved.forEach(function(p) {
                    people[p.Email] = p.Name;
                });

                return people[email] || '';
            }
            return '';
        },

        getEmailFirstLastName: function(thread, email) {
            var name = this.getEmailName(thread, email), firstName = '', lastName = '';
            if (name) {
                var nameSep = name.split(' ');
                firstName = nameSep[0];
                if (nameSep.length > 0) {
                    for(var ind = 1; ind < nameSep.length; ind+=1) {
                        lastName += nameSep[ind] + ' ';
                    }
                }
            }
            return {
                first: firstName,
                last: lastName.trim()
            }
        },

        getGravatar: function(email) {
            return 'https://www.gravatar.com/avatar/' + md5(email) + '?s=55';
        },

        getLanguage: function(value) {
            if (value === 'en') { return 'English'; }
            else if (value === 'fr') { return 'French'; }
            else if (value === 'da') { return 'Danish'; }
            else if (value === 'nl') { return 'Dutch'; }
            else if (value === 'et') { return 'Estonian'; }
            else if (value === 'de') { return 'German'; }
            else if (value === 'it') { return 'Italian'; }
            else if (value === 'no') { return 'Norwegian'; }
            else if (value === 'pt') { return 'Portuguese'; }
            else if (value === 'es') { return 'Spanish'; }
            else if (value === 'es-419') { return 'Spanish (Latin America)'; }
            else if (value === 'sv') { return 'Swedish'; }
            else { return value; }
        },
        getTemplate: function(id, values) {
            if(typeof values === "undefined") {
                values = {};
            }
            if (Marionette.TemplateCache.templateCaches[id]) {
                return Marionette.TemplateCache.templateCaches[id].compiledTemplate(values);
            }
            var src = $(id).html();
            var tpl = Handlebars.compile(src);
            return tpl(values || {})
        },
        compileTemplate: function(id) {
            if (Marionette.TemplateCache.templateCaches[id]) {
                return Marionette.TemplateCache.templateCaches[id].compiledTemplate;
            }
            var src = $(id).html();
            return Handlebars.compile(src);
        },


        //WIZY FORMATTERS
        format : {
            dateNoLocal: function(value) {
                return moment(value).format('MMMM D, YYYY');
            },

            dateTime: function(value) {
                return moment.utc(value).format('MMM D, YYYY h:mm a')
            },

            dateTimeNoLocal: function(value, params) {
                var str = params.sec === true ? 'MMMM D, YYYY, h:mm:ss a' : 'MMMM D, YYYY, h:mm a'
                return moment.utc(value).format(str);
            },

            dateTimeLocal: function(value) {
                return moment.utc(value).toDate();
            },

            dateDescriptive: function(value) {
                return this.dateWeeksPassed(value) > 0 ? this.dateTimeNoLocal(value, {sec: false}) : moment(value).fromNow();
            },

            dateWeeksPassed: function(value) {
                return (moment(Date.now())).diff(moment(value), 'week');
            },

            number: function(value, sep) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep || ',');
            },

            numberFixedDecimal: function(value, decimal, sep) {
                return this.number(parseFloat(value).toFixed(decimal || 2), sep || ',');
            },

            toLocalTime: function(value, format) {
                format = format || 'MMM D, YYYY h:mm a';
                return moment(this.dateTimeLocal(value)).format(format);
            },

            // currentTimezone: {
            //     names: moment.tz.names(),
            //     matches: function(base){
            //         var results = [], now = Date.now(), makekey = function(id){
            //             return [0, 4, 8, -5*12, 4-5*12, 8-5*12, 4-2*12, 8-2*12].map(function(months){
            //                 var m = moment(now + months*30*24*60*60*1000);
            //                 if (id) m.tz(id);
            //                 return m.format("DDHHmm");
            //             }).join(' ');
            //         }, lockey = makekey(base);
            //         util.format.currentTimezone.names.forEach(function(id){
            //             if (makekey(id)===lockey) results.push(id);
            //         });
            //         return results;
            //     }
            // }
        },
        timezone : {
            init : function(cities, formatName){
              this.cities = [];
              this.formatName = formatName;

              for(var key in cities) {
                if(!isNaN(key)) {
                    this.cities.push({
                      name: cities[key],
                      offset: moment.tz(cities[key]).format('Z')
                    });
                }
              }

              this.cities.sort(function(a, b){
                return parseInt(a.offset.replace(":", ""), 10) - parseInt(b.offset.replace(":", ""), 10);
              });

              this.html = this.getHTMLOptions();
              this.currentTimezone = this.getCurrentTimezoneKey();
            },
            getHTMLOptions : function(){
              var html = '';
              var offset = 0;
              var i, c = this.cities.length, city;

              for(i = 0; i < c; i++) {
                city = this.cities[i];
                html += '<option data-offset="' + city.offset + '" value="'+ city.name +'">(GMT ' + city.offset + ') ' + this.formatName(city.name) +'</option>';
              }

              return html;
            },
            addNames : function(select){
              return $(select).empty().append($(this.html));
            },
            selectValue : function(select, value){
              value = value || this.currentTimezone;

              var match = $(select).find('option[data-offset="' + value + '"]');

              if (match.length){
                $(select).val(match.val());
              }

              return $(select);
            },
            getCurrentTimezoneKey : function(){
              return moment().format('Z');
            },
            getCurrentOffset : function(){
              return parseInt(this.currentTimezone, 10);
            }
        },
        arrange : {
            byDate : function(array) {
                array.sort(function(a,b){
                    //arrays must have activityTime object
                    return new Date(b.activityTime) - new Date(a.activityTime);
                });
                return array;
            }
        },
        // this merge will concat array instead of replacing it
        // uniques: [
        //     {
        //         name: 'items' // name of array field
        //         field: 'subject', // field on each object
        //     }
        // ]
        // By default it uses JSON.stringify to check
        merge: function(src, dst, isUniqueArrays, uniques) { // src = obj, dst = obj || arr
            var doMerge = function(obj1, obj2) {
                var src = _.extend({}, obj2),
                    dst = _.extend({}, obj1), // use _.extend to make it pass by value
                    p, i = 0, j = 0;
                var uniqueFields = _.map(uniques, function (u){
                    return u.name;
                });
                if (toString.call(src) == '[object Object]') {
                    for (p in src) {
                        if (src.hasOwnProperty(p)) {
                            if( Object.prototype.toString.call( src[p] ) == '[object Array]' ) {
                                if (dst[p]) {
                                    dst[p] = src[p].concat(dst[p]);
                                    if (uniqueFields.indexOf(p) > -1){
                                        dst[p] = _.unique(dst[p], false, function (o) {
                                            var f = uniques[uniqueFields.indexOf(p)];
                                            return o[f.field];
                                        });
                                    } else if (isUniqueArrays){
                                        dst[p] = _.unique(dst[p], false, function (o) {
                                            return JSON.stringify(o);
                                        });
                                    }
                                } else {
                                    dst[p] = src[p];
                                }
                            } else if (Object.prototype.toString.call(src[p]) == '[object Object]') {
                                dst[p] = doMerge(dst[p] || {}, src[p]);
                            } else {
                                dst[p] = src[p];
                            }
                        }
                    }
                }
                return dst;
            };
            var res;
            if (Object.prototype.toString.call(dst) == '[object Array]') {
                _.each(dst, function (o) {
                    res = doMerge(o, res || src);
                });
            } else {
                res = doMerge(dst, src);
            }
            return res;
        },
        htmlDecode: function (s) {
            return $('<div/>').html(s).text();
        },
        getDriveIcon: function(mimeType) {
            var icons = {
                'application/vnd.google-apps.audio': null,
                'application/vnd.google-apps.document' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_document_list.png',
                'application/vnd.google-apps.drawing' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_drawing_list.png',
                'application/vnd.google-apps.file' : null,
                'application/vnd.google-apps.folder': 'mdi-file-folder',
                'application/vnd.google-apps.form' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_form_list.png',
                'application/vnd.google-apps.fusiontable' : null,
                'application/vnd.google-apps.photo' : null,
                'application/vnd.google-apps.presentation' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_presentation_list.png',
                'application/vnd.google-apps.script' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_script_list.png',
                'application/vnd.google-apps.sites' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_sites_list.png',
                'application/vnd.google-apps.spreadsheet' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_spreadsheet_list.png',
                'application/vnd.google-apps.unknown' : null,
                'application/vnd.google-apps.video' : 'https://ssl.gstatic.com/docs/doclist/images/icon_11_video_list.png',
                'application/pdf' : 'https://ssl.gstatic.com/docs/doclist/images/icon_12_pdf_list.png',
                'application/zip' : 'https://ssl.gstatic.com/docs/doclist/images/icon_9_archive_list.png'

            }
            if (mimeType.indexOf('image') > -1) {
                return 'https://ssl.gstatic.com/docs/doclist/images/icon_11_image_list.png';
            }
            return icons[mimeType] || "https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png";
        },
        capitalizeFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        capitalizeFirstLetters: function(string) {
            var s = string.split(' '), res = '', self = this;
            _.each(s, function(string, index) {
                s[index] = self.capitalizeFirstLetter(string);
            });
            return s.join(' ');
        },
        scriptLoader: {
            loadScript: function(url) {
                var deferred = Q.defer();
                $.get(url, function(data) {
                    var text = "(function(){" + data + "\n});"
                    eval(text + "\n//# sourceURL=" + url + "\n")();
                    deferred.resolve();
                }, 'text');
                return deferred.promise;
            }
        },
        fireEvent: function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window //problems
            if (!node) return;
            var doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to JSUtil.fireEvent: " + node.id);
            }

            if (node.fireEvent) {
                // IE-style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            } else if (node.dispatchEvent) {
                // Gecko-style approach is much more difficult.
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                    case "click":
                        // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                    case "mousedown":
                    case "mouseup":
                        eventClass = "MouseEvents";
                        break;

                    case "focus":
                    case "change":
                    case "blur":
                    case "select":
                        eventClass = "HTMLEvents";
                        break;

                    default:
                        throw "JSUtil.fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                        break;
                }
                var event = doc.createEvent(eventClass);
                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                node.dispatchEvent(event);
            }
        },
        simulateButtonClick: function(node) {
            //Fire mouseUp and mouseDown Events simultaneously
            this.fireEvent(node, 'mousedown');
            this.fireEvent(node, 'mouseup');
        },
        parseTrackedEmails: function(email, events) {
            var icons = {
                'click': 'fa fa-hand-o-up',
                'reply': 'mdi-content-reply',
                'open' : 'mdi-content-drafts'
            };
            email.id = email.details.id;
            email.to_email = WIZY.util.extractEmails(email.details.to);
            email.fromNow = moment.utc(email.details.created).fromNow();
            _.each(events, function (ev) {
                ev.subject = email.details.subject;
                ev.thread_id = email.details.gmail_msg_id;
                ev.to_emails = email.details.to;
                ev.date = WIZY.util.format.dateTime(moment.utc(ev.created));
                ev.fromNow = moment.utc(ev.created).fromNow();
                ev.event_type = ev.event === 'click' ? 'clicked'
                    : ev.event === 'reply'? 'replied'
                    :'opened';
                ev.event_type2 = ev.event === 'click' ? 'clicked the link'
                    : ev.event === 'reply'? 'replied to this message'
                    :'opened this message';
                ev.icon = icons[ev.event];
                if (ev.location && ev.location === 'you or someone near you') {
                    ev.person = ev.location;
                    ev.locationText = 'via ' + ev.browser + ' on ' + ev.platform;
                } else {
                    if (ev.location) {
                        ev.location = WIZY.util.capitalizeFirstLetters(ev.location);
                        ev.location = ev.location.replace('?, ', '').replace('?, ', '');
                        ev.locationText = 'from ' + ev.location + ' via ' + ev.browser + ' on ' + ev.platform;
                    }
                    // if the number of recipients(to, cc, bcc) == 1; we assume that the recipient open the email
                    // unless we will say that somebody opened it
                    var numOfRecipients = 0;
                    numOfRecipients += email.details.to ? email.details.to.split(';').length : 0;
                    numOfRecipients += email.details.cc ? email.details.cc.split(';').length : 0;
                    numOfRecipients += email.details.bcc ? email.details.bcc.split(';').length : 0;
                    if (numOfRecipients < 2) {
                        ev.emails = WIZY.util.extractEmails(ev.to_emails);
                        ev.person = WIZY.util.extractName(ev.to_emails);
                    } else {
                        ev.person = 'Somebody'
                    }
                }
                if (ev.browser === 'Gmail') {
                    ev.locationText = '';
                }
            });
        },
        arrayModifiers: {
            extractKeyAsObjectName : function(items) {
                return _.object(_.map(items, function(item) {
                   return [item.id, item];
                }));
            }
        },
        objectWithoutProperties: function(obj, keys) { 
            var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; 
        },
        sortObjArrayByAttr: function(arrayToSort, attrName, sortType, sortDirection) {
            /// @sortType = 'alphabetical'
            /// @sortDirection = 'asc' || 'desc'
            var sortTypes = {
                alphabetical_asc: function(arrayToSort, attrName) {
                    return arrayToSort.sort(function(a, b) {
                        return a[attrName].toLowerCase() > b[attrName].toLowerCase();
                    });
                },
                alphabetical_desc: function(arrayToSort, attrName) {
                    return arrayToSort.sort(function(a, b) {
                        return a[attrName].toLowerCase() < b[attrName].toLowerCase();
                    });
                },
                time_asc: function(arrayToSort, attrName) {
                    return arrayToSort.sort(function(a, b) {
                        return moment(a[attrName]).unix() > moment(b[attrName]).unix();
                    });
                },
                time_desc: function(arrayToSort, attrName) {
                    return arrayToSort.sort(function(a, b) {
                        return moment(a[attrName]).unix() < moment(b[attrName]).unix();
                    });
                }
            };

            return sortTypes[sortType+'_'+sortDirection](arrayToSort, attrName);

        },
        getTimezones: function() {
            var cities = moment.tz.names(), timezones = [];

            _.each(cities, function(c) {
                var offset = moment.tz(c).format('Z')
                timezones.push({
                    name: c,
                    offset: offset,
                    display: '(GMT ' + offset + ') ' + c
                });
            });
            timezones.sort(function(a, b){
                return parseInt(a.offset.replace(":", ""), 10) - parseInt(b.offset.replace(":", ""), 10);
              });
            return timezones;
        },
        getTimezone: function(offset) {
            var zone;
            this.getTimezones().forEach(function(z) {
                if (z.offset === offset) {
                    zone = z;
                }
            });
            return zone;
        }

    };
    /* Tweet parsers ------------------>*/
    // String.prototype.parseURL = function() {
    //     return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
    //         return url.link(url);
    //     });
    // };
    // String.prototype.parseUsername = function() {
    //     return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
    //         var username = u.replace("@","")
    //         return u.link("http://twitter.com/"+username);
    //     });
    // };
    // String.prototype.parseHashtag = function() {
    //     return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
    //         var tag = t.replace("#","%23")
    //         return t.link("http://search.twitter.com/search?q="+tag);
    //     });
    // };
    // /* <----------------------- Tweet parsers */
    // String.prototype.stripHTMLTags = function() {
    //     return this.replace(/<\/?[^>]+(>|$)/g, "");
    // };
    // String.prototype.capitalize = function() {
    //     return this.charAt(0).toUpperCase() + this.substring(1);
    // };

    // if (!Array.prototype.remove) {
    //   Array.prototype.remove = function(val) {
    //     var i = this.indexOf(val);
    //          return i>-1 ? this.splice(i, 1) : [];
    //   };
    // }