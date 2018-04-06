import React from 'react';
import {createStore} from 'reflux';
import StoreStateMixin from 'core/mixins/store-state';
import Container from 'core/components/Container';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import ListCard from './ListCard';
import Badge from 'material-ui/lib/badge';
import CustomerActions from 'sap/actions/customers';
import api from 'sap/api/sales-orders';
import sapUtils from 'sap/utils';

import {BASE_URL, default as baseApi} from 'sap/api/base';
const PAYMENT_URL = BASE_URL + '/Payments';

const Store = createStore({
    mixins: [StoreStateMixin],
    listenables: [CustomerActions],
    getInitialState() {
        return {
            isLoaded: false,
            payments: []
        }
    },
    load(type, id) {
        this.setState(this.getInitialState());
        var filter = `${type}.id eq ${id}`;

        baseApi.apiCall({
            url: PAYMENT_URL,
            data: {
                expand: 'customer',
                filter: filter
            }
        }).then( payments => this.setState({ payments, isLoaded: true }), this.setState({ isLoaded: true }) )
    }
})


class PaymentsCard extends React.Component {

    static propTypes = {
        type: React.PropTypes.oneOf(['customer', 'contact']),
        id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    };

    constructor(props) {
        super(props);
        this.displayName = "PaymentsCard"
    }

    componentDidMount() {
        var {type, id} = this.props;
        Store.load(type, id);
    }

    render() {
        var {isLoaded, payments} = this.props
        var title = 'Payments';
        var items = _.map(payments, payment => {
            var { id, status, docNumber, creationTime, amount, currency, amount } = payment;
            var iconInfo = sapUtils.getIconInfo(status);

            var iconStyle = {
                fontSize: 15,
                marginRight: 5,
                verticalAlign: 'text-bottom',
                color: iconInfo.color,
            };
            var amount = sapUtils.formatCurrency(amount.amount);
            return (
                <ListItem
                    key={id}
                    primaryText={
                        <div style={{ fontSize: 14 }}>
                            <i className={iconInfo.iconName} style={iconStyle} data-tooltip={status}/>
                            <span style={{ marginRight: 5 }}>{currency.code}</span>
                            {amount}
                        </div>
                    }
                    secondaryText={
                        <div style={{fontSize: 12}}>
                            {docNumber} - {sapUtils.formatDate(creationTime)}
                        </div>
                    }
                    onTouchTap={() => window.open(sapUtils.getPermaLink('Payment', id))}
                />
        )})
        return (
            <ListCard
                length={payments.length || 0}
                isLoaded={!isLoaded}
                listTitle={title}>
                    {items}
            </ListCard>
        );
    }
}
export default Container(PaymentsCard, Store);



