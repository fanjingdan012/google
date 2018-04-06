const resolved = 'resolved';
const rejected = 'rejected';

var RE_EMAIL =  /([a-z0-9!#$%&'\*+\-\/=?\^_`\{\|\}~\.]+@(?:[a-z0-9\-]+)(?:\.[a-z0-9\-]+)+)/i,
    REGEX_EMAILADDRESS =  new RegExp(RE_EMAIL.source + '>?', 'i'),
    RE_PUNCT = new RegExp('([\"\'/\\\\~|.<>:;\\-=#_' + ['\u00a6', '\u00ab', '\u00b7', '\u00bb', '\u2010', '\u2011', '\u2012', '\u2013', '\u2014', '\u2015', '\u2016', '\u2022', '\u2023', '\u2039', '\u203a'].join('') + '])', 'g');


export const AllSettledPromise = (promises) => {
    var len =promises && promises.length;
    var count = 0;
    var results = [];
    return new Promise((resolve, reject) => {
        if (!len) {
            return;
        }
        _.each(promises, function (promise, i) {
            promise
                .then(res => {
                    results[i] = { status: resolved, data: res};
                    count += 1;
                    if (count === len) {
                        resolve(results);
                    }
                })
                .catch(err => {
                    results[i] = { status: rejected, data: err};
                    count += 1;
                    if (count === len) {
                        resolve(results);
                    }
                })
        })
    })
}

export const getGravatar = email => 'https://www.gravatar.com/avatar/' + md5(email) + '?s=55';

export const isValidEmail = input => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
}

export const extractEmails = (input) => {
    return _((input || '').split(RE_EMAIL)).chain().select(function(str, index) {
        return index % 2 === 1;
    }).invoke('toLowerCase').value();
}

export const getEmailFromDom = () => {
    var email = _(extractEmails($('a[href^="https://accounts.google.com/SignOutOptions"]').attr('title'))).last();
    email = email ||  _(extractEmails($('title', window.top.document).text())).last();
    return email || $("span:contains('Change photo')").parent().next().find('div:nth-child(2)').text();
}

export const getQueryParameters = (str) => {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

export const getCurrentTimezone = () => {
    // var cities = moment.tz.names(),
    //     timezone = '',
    //     len = cities.length,
    //     i, city;

    // for (i = 0; i < len; i++) {
    //     city = cities[i];
    //     if (moment().utcOffset() === moment.tz(city).utcOffset()) {
    //         timezone = city;
    //         break;
    //     }
    // }
    return moment.tz.guess();
}