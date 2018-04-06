import {createActions} from 'reflux';
import api from 'sap/api/opportunities';

const Actions = createActions({
    CreateOpportunity: { asyncResult: true },
})

Actions.CreateOpportunity.listenAndPromise(api.create);

export default Actions;