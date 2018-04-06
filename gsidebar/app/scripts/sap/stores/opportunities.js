import {createStore} from 'reflux';
import api from 'sap/api/opportunities';
import StoreStateMixin from 'core/mixins/store-state';

import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';
import HomeActions from 'sap/actions/home';
import OpportunityActions from 'sap/actions/opportunities';


var status = ['OPEN', 'MISSED', 'SOLD'];

const sortOpps = (opps) => opps.sort((a,b) => {
    if (status.indexOf(a.status) < status.indexOf(b.status)) {
        return -1;
    }
    if (status.indexOf(a.status) > status.indexOf(b.status)) {
        return 1;
    }
    if (moment(a.startDate).unix() < moment(b.startDate).unix()) {
        return 1;
    } else if (moment(a.startDate).unix() > moment(b.startDate).unix()) {
        return -1;
    } else {
        return 0;
    }
});


var Store = createStore({
    mixins: [StoreStateMixin],
    listenables: [
        ContactActions,
        CustomerActions,
        HomeActions,
        OpportunityActions,
    ],
    init() {

    },
    getInitialState() {
        return {
            opportunities: [],
            opportunitiesLoaded: false,
            visibleOpps: [],
            visibleOppsLoaded: false,
            idFilter: null,
        }
    },
    preEmit(state) {
        return {
            ...state,
            visibleOpps: sortOpps(state.visibleOpps),
            opportunities: sortOpps(state.opportunities),
        }
    },
    onShowCustomer(id) {
        this.onCardShow(id, 'customer');
    },
    // onReloadContactPage() {
    //     this._onReloadPage();
    // },
    onReloadCustomerPage() {
        this._onReloadPage();
    },
    _onReloadPage() {
        this.setState({
            visibleOpps: [],
            visibleOppsLoaded: false
        });
        this.onCardShow(this.getState('idFilter'));
    },
    // onShowContactPage(id) {
    //     this.onCardShow(id)
    // },
    onCardShow(id) {
        this.setState({
            visibleOpps: [],
            visibleOppsLoaded: false,
            idFilter: id
        });
        api.loadByCustomerId(id)
        .then(visibleOpps => {
            this.setState({
                visibleOpps,
                visibleOppsLoaded: true,
            });
        });
    },
    _filterByCustomerId(opps, customerId) {
        return _.filter(opps, opp => opp.customer && opp.customer.id === 304)
    },
    onClickedSection(route) {
        if (route === 'opportunities') {
            /// load only when not yet loaded
            if (!this.getState('opportunitiesLoaded')) {
                this._load();
            }
        }
    },
    onCreateOpportunityCompleted(opp) {
        var { visibleOpps, idFilter } = this.getState();
        if (idFilter) {
            this.onCardShow(idFilter);
        }

    },
    _load() {
        api.load()
            .then(opportunities => this.setState({opportunitiesLoaded: true, opportunities}))
    },
    reload() {
        this.setState({
            opportunities: [],
            opportunitiesLoaded: false
        });
        this._load();
    }
});

export default Store;