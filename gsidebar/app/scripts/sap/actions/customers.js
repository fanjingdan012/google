import React from 'react';
import Reflux from 'reflux';
import CreateCustomerModal from 'sap/components/modals/create-customer';
import CustomerApi from 'sap/api/customers';
import ModalActions from 'core/actions/modal';

const CustomerActions = Reflux.createActions([
    'ShowCustomer', /// id
    'ShowCustomerFormModal',
    'LoadCustomers',
    'ReloadCustomerPage',
    'ReloadCustomers'
]);


CustomerActions.CreateCustomer = Reflux.createAction({children: ["completed","failed"]});
CustomerActions.CreateCustomer.listenAndPromise(CustomerApi.createCustomer);

CustomerActions.UpdateCustomer = Reflux.createAction({children: ["completed","failed"]});
CustomerActions.UpdateCustomer.listenAndPromise(CustomerApi.updateCustomer);

CustomerActions.ShowCustomerFormModal.listen(params => ModalActions.RenderModal(<CreateCustomerModal {...params}/>))


export default CustomerActions;