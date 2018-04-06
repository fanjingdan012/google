import React from 'react';
import Reflux from 'reflux';
import ModalActions from 'core/actions/modal';
import CreateContactModal from 'sap/components/modals/create-contact';
import ContactApi from 'sap/api/contact-persons';

const Actions = Reflux.createActions([
    'ShowContactPage',
    'ShowContactFormModal',
    'ReloadContactPage',
    'ReloadContacts',
    'LoadContacts',
])

Actions.ShowContactFormModal.listen(params => {
    ModalActions.RenderModal(<CreateContactModal {...params}/>)
})

Actions.CreateContact = Reflux.createAction({children: ["completed","failed"]});
Actions.CreateContact.listenAndPromise(ContactApi.createContactPerson);

Actions.UpdateContact = Reflux.createAction({children: ["completed","failed"]});
Actions.UpdateContact.listenAndPromise(ContactApi.updateContactPerson);
Actions.GetContactsByCustomerId = Reflux.createAction({children: ["completed","failed"]});
Actions.GetContactsByCustomerId.listenAndPromise(ContactApi.getContactsByCustomerId);

export default Actions;