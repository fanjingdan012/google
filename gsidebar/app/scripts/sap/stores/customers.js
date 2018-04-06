import Reflux from 'reflux';
import { BASE_URL, default as api } from '../../sap/api/base';
import _ from 'underscore';
import SidebarActions from 'core/actions/sidebar';
import GmailActions from '../../core/actions/gmail';
import CustomerActions from 'sap/actions/customers';
import ContactActions from 'sap/actions/contacts';
import {default as CustomersApi, STAGE_OPTIONS, MARKETING_STATUS_OPTIONS, CUSTOMER_TYPES, STATUS_OPTIONS} from 'sap/api/customers';

import HomeActions from 'sap/actions/home';
import CustomersActions from 'sap/actions/customers';
import HashActions from 'sap/components/SidebarRouter/HashActions';

import StoreStateMixin from 'core/mixins/store-state';

export default Reflux.createStore({
    mixins: [StoreStateMixin],
    listenables: [HomeActions, CustomersActions, HashActions],
    init() {
        this.state = {
            customers: [],
            isCurrentCustomerLoaded: false,
            isCustomersLoaded: false,
            currentCustomerId: null,
            // renderCustomers: false,
            // renderCurrentCustomer: false,
            hasError: false,
            error: {}
        }
        // this.listenTo(CustomerActions.RenderCustomerPage, this.onRenderCustomerPage)
    },
    preEmit(state) {
        return {
            ...state,
            customers: state.customers.sort((a, b) => {
                var aName = (a.displayName || '').toLowerCase();
                var bName = (b.displayName || '').toLowerCase();
                if (aName < bName) {
                    return -1;
                } else if (aName > bName) {
                    return 1;
                } else {
                    return 0;
                }
            }),
            currentCustomer: _.find(state.customers, c => state.currentCustomerId === c.id) || {}
        };
    },
    /// listen to HomeActions
    onClickedSection(route) {
        if (route === 'customers') {
            this.setState({
                renderCustomers: true,
                renderCurrentCustomer: false
            });
            /// load only when not yet loaded
            if (!this.state.isCustomersLoaded) {
                this.onLoadCustomers();
            }
        }
    },

    /// listen to CustomersActions
    onReloadCustomers() {
        this.setState({
            isCustomersLoaded: false
        });
        this.onLoadCustomers();
    },
    onReloadCustomerPage() {
        this.setState({
            isCurrentCustomerLoaded: false
        })
        this.getCustomer(this.getState('currentCustomerId'))
            .then(currentCustomer => this.setState({ currentCustomer, isCuisCurrentCustomerLoaded: true }))

    },
    getCustomer(id, cached=false) {
        if (cached) {
            var customer = _.find(this.getState('customers'), c => id === c.id);
            if (customer) {
                return Promise.resolve(customer);
            }
        }
        return CustomersApi.getCustomerById(id)
            .then(res => {
                var customers = this._insertCustomer(this.getState('customers'), res);
                this.setState({
                    customers,
                    isCurrentCustomerLoaded: true
                });
                return Promise.resolve(res);
            })
    },
    onShowCustomer(id, saveToHistory=true) {
        let customer = this.state.customers.filter(cust => cust.id === id)[0];
        this.setState({
            // renderCustomers: false,
            // renderCurrentCustomer: true,
            currentCustomerId: id,
            isCurrentCustomerLoaded: !!customer
        });
        if (saveToHistory) {
            HashActions.ChangePath('customer', {id});
        }
        if (!customer) {
            this.getCustomer(id);
        }
    },
    onPreRevertPath(path, customer) {
        if (path !== 'customer') {
            return
        }
        var {currentCustomer} = this.getState();
        if (!currentCustomer || customer.id !== currentCustomer.id) {
            CustomersActions.ShowCustomer(customer.id, false);
        }
    },
    onLoadCustomers() {
        if (this.getState('isCustomersLoaded')) {
            return;
        }
        CustomersApi.getCustomers()
        .then(
            res => {
                this.setState({
                    customers: res,
                    isCustomersLoaded: true,
                    hasError: false
                });
            },
            err => {
                console.debug('err in loading customers', err);
                this.setState({
                    hasError: true,
                    error: err
                });
            }
        ).catch(err => console.log(err))
    },

    ///
    getCustomerByEmail(email) {
        this.setState({
            isCustomerLoaded: false
        });
        return new Promise( (resolve, reject) => {
            CustomersApi.getCustomerByEmail(email).then(res => {
                this.setState({
                    customers: this._insertCustomer(this.getState('customers'), res[0]),
                });
                resolve(res && res[0]);
            }).catch(err => {
                reject(err);
            });
        });
    },
    // onRenderCustomerPage(id) {
    //     SidebarActions.SidebarSetView({
    //         body: {
    //             component: CustomerPage,
    //             _props: {
    //                 customerId: id,
    //                 store: this,
    //                 actions: CustomerActions
    //             },
    //         }
    //     });
    // },
    // onRenderListPage() {
    //     SidebarActions.SidebarSetView({
    //         body: {
    //             component: CustomerListPage,
    //             _props: {
    //                 actions: CustomerActions,
    //                 store: this
    //             }
    //         }
    //     })
    // }
    onCreateCustomerCompleted(customer) {
        var {customers} = this.getState();
        this.setState({
            customers: [...customers, customer]
        });
    },
    onUpdateCustomerCompleted(customer) {
        var {customers, currentCustomer} = this.getState();
        var existingCustomer = _.find(customers, c => c.id === customer.id);
        _.extend(existingCustomer, customer);
        // if (currentCustomer && currentCustomer.id === customer.id) {
        //     currentCustomer = _.extend({}, customer);
        // }
        this.setState({ customers });
    },
    _insertCustomer(customers, customer) {
        if (!customer) {
            return customers;
        }
        var index = _.findIndex(customers, c => c.id === customer.id);
        if (index > -1) {
            customers[index] = customer;
            return customers;
        }
        return [...customers, customer];
    }
})