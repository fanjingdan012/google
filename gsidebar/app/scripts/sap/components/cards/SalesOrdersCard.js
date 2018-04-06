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


const Store = createStore({
    mixins: [StoreStateMixin],
    listenables: [CustomerActions],
    getInitialState() {
        return {
            isLoaded: false,
            orders: []
        }
    },
    // onShowCustomer(customerId) {
    //     this.setState({
    //         customerId,
    //         isLoaded: false,
    //         orders: []
    //     });
    //     this.load();
    // },
    load(type, id) {
        this.setState(this.getInitialState());
        var filter = `${type}.id eq ${id}`;
        api.query(filter)
            .then(orders => this.setState({orders, isLoaded: true}));
    }
})


class SalesOrdersCard extends React.Component {

    static propTypes = {
        type: React.PropTypes.oneOf(['customer', 'contact']),
        id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    };

    constructor(props) {
        super(props);
        this.displayName = "SalesOrdersCard"
    }

    componentDidMount() {
        var {type, id} = this.props;
        Store.load(type, id);
    }

    render() {
        var {isLoaded, orders} = this.props
        var title = 'Sales Orders';
        var items = _.map(orders, order => {
            var iconInfo = sapUtils.getIconInfo(order.status);
            var iconStyle = {
                fontSize: 15,
                marginRight: 5,
                verticalAlign: 'text-bottom',
                color: iconInfo.color,
            };
            var amount = sapUtils.formatCurrency(order.grossTotal.amount);
            return (
                <ListItem
                    key={order.id}
                    primaryText={
                        <div style={{ fontSize: 14 }}>
                            <i className={iconInfo.iconName} style={iconStyle} data-tooltip={order.status}/>
                            <span style={{ marginRight: 5 }}>{order.currency.code}</span>
                            {amount}
                        </div>
                    }
                    secondaryText={
                        <div style={{fontSize: 12}}>
                            {order.docNumber} - {sapUtils.formatDate(order.orderTime)}
                        </div>
                    }
                    onTouchTap={() => window.open(sapUtils.getPermaLink('SalesOrder', order.id))}
                />
        )})
        return (
            <ListCard
                length={orders.length || 0}
                isLoaded={!isLoaded}
                listTitle={title}>
                    {items}
            </ListCard>
        );
    }
}
export default Container(SalesOrdersCard, Store);



