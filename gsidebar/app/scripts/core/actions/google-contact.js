import Reflux from 'reflux';

import gcontactApi from 'core/api/google-contact';

const Actions = Reflux.createActions({
    GetContactByEmail: {asyncResult: true},
    CreateContact: {asyncResult: true},
    LoadGroups: {asyncResult: true},
    CreateGroup: {asyncResult: true}
})
Actions.CreateContact.listenAndPromise(gcontactApi.create);
Actions.CreateGroup.listenAndPromise(gcontactApi.createGroup);

export default Actions;