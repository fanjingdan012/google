import Reflux from 'reflux';
import {BASE_URL, default as api} from 'sap/api/base';
import CustomerStore from 'sap/stores/customers';
import ContactStore from 'sap/stores/contact-persons';
import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';


export default Reflux.createStore({
	init() {
		this.listenTo(CustomerStore, this.onCustomerStoreChange);
		this.state = {
			onPendingSearch: false
		};
	},
	onCustomerStoreChange() {
		console.log('customer store change');
	},
	search(term) {
		/// temporary search api
		/// iterates customers and contacts list

		return new Promise( (resolve, reject) => {

			if ( CustomerStore.getState('isCustomersLoaded') ) {
				let matchedCustomers = CustomerStore.getState('customers').filter( cust => !!~cust.displayName.toLowerCase().indexOf( term.toLowerCase() ) );
				resolve(matchedCustomers);
			} else {
				this.state.onPendingSearch = true;
				CustomerActions.LoadCustomers();
			}

		} );

	}
});