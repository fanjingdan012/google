import Comms from 'lib/comms';

const request = params => Comms.send({action: 'base_gcontact_request', data: params});
const getPhotoUrl = contact => Comms.send({action: 'get_gcontact_photo', data: {contact}});
const getId = str => str.split('/').pop();

const formatContact = raw => {
    var givenName,
        familyName,
        fullName,
        title,
        id,
        phoneNumbers,
        emails,
        link,
        photoUrl,
        address,
        company,
        orgTitle,
        primaryEmail,
        mainPhone;
    var name = raw['gd$name'];
    if (name) {
        givenName = name['gd$givenName'] && name['gd$givenName']['$t'];
        familyName = name['gd$familyName'] && name['gd$familyName']['$t'];
        fullName = name['gd$fullName'] && name['gd$fullName']['$t'];
    }
    title = raw.title && raw.title['$t'];
    id = getId(raw.id && raw.id['$t']);
    _.each(raw.link, l => l.rel === 'edit' ? link = l.href : null);
    phoneNumbers = _.map(raw['gd$phoneNumber'], p => p['$t']);
    emails = _.map(raw['gd$email'], e => e.address);
    address = _.map(raw['gd$structuredPostalAddress'], addr => addr['gd$formattedAddress'] && addr['gd$formattedAddress']['$t']);
    if (raw['gd$organization'] && raw['gd$organization'][0]) {
        company = raw['gd$organization'][0]['gd$orgName'] && raw['gd$organization'][0]['gd$orgName']['$t'];
        orgTitle = raw['gd$organization'][0]['gd$orgTitle'] && raw['gd$organization'][0]['gd$orgTitle']['$t'];
    }

    mainPhone = _.filter(raw['gd$phoneNumber'], p => p.rel.split('#').pop() === 'main')[0];
    primaryEmail = _.filter(raw['gd$email'], e => e.primary)[0];

    return {
        givenName,
        familyName,
        fullName,
        title,
        id,
        phoneNumbers,
        emails,
        link,
        address,
        company,
        orgTitle,
        raw,
        mainPhone,
        primaryEmail,
    }
}


export const getByEmail = email => {
    var contact;
    return new Promise((resolve, reject) => {
        request({
            params: {
                q: email
            }
        })
        .then(res => {
            var {data} = res;
            var feed = data.feed;
            if (feed && feed.entry) {
                var entry = feed.entry;
                if (entry[0]) {
                    // resolve(formatContact(entry[0]))
                    contact = entry[0];
                    return contact;
                }
            }
            console.log(res)
            return null;
        }, err => {
            console.log('err on get gcontact by email', email)
            reject(err);
            return Promise.reject(err);
        })
        .then(getPhotoUrl, err => Promise.reject(err))
        .then(res => {
                if (contact) {
                    contact.photoUrl = res.data;
                    resolve(formatContact(contact));
                } else {
                    resolve();
                }

        }, err => resolve(formatContact(contact))
        ).catch(reject)
    })
}
export const getById = id => {
    return new Promise((resolve, reject) => {
        request({ path: 'm8/feeds/contacts/default/full/' + id})
            .then(res => resolve(formatContact(res.data.entry)), reject)
    })
}
export const create = entry => {
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            body: {
                entry: entry
            }
        })
        .then(res => formatContact(res.data.entry))
        .then(entry => {
            resolve(entry)
        }, err=> {
            reject(err)
        })
    })
}

export const updateContact = entry => {
    return new Promise((resolve, reject) => {
        request({
            method: 'PUT',
            path: 'm8/feeds/contacts/default/full/' + getId(entry.id && entry.id['$t']),
            body: {
                entry: entry
            }
        }).then(res => formatContact(res.data.entry))
        .then(resolve, reject);
    })
}

export const loadGroups = () => {
    return new Promise((resolve, reject) => {
        request({
            path: 'm8/feeds/groups/default/full',
            params: {
                'max-results': 1000
            }
        })
        .then(res => resolve(res.data.feed.entry), err => reject(err));
    })
}
export const createGroup = (groupName) => {
    var entry = {
        category : [
            {
                scheme : 'http://schemas.google.com/g/2005#kind',
                term : 'http://schemas.google.com/contact/2008#group'
            }
        ],
        title : {
            $t : groupName
        }
    }
    return new Promise((resolve, reject) => {
        request({
            method : "POST",
            path : '/m8/feeds/groups/default/full/',
            body : {
                "version" : "3.0",
                "encoding" : "UTF-8",
                "entry" : entry,
            }
        })
        .then(res => resolve(res.data.entry), err => reject(err))
    })
}
export default {getByEmail, getById, create, loadGroups, createGroup}