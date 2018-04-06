import React from 'react';
import CustomerStore from 'sap/stores/customers';
import CustomerActions from 'sap/actions/customers';
import Dialog from 'material-ui/lib/dialog';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';
import Divider from 'material-ui/lib/divider';
import Participant from './Participant';
import FlatButton from 'sap/components/buttons/FlatButton';
import colors from 'sap/styles/colors';

class CustomerPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = _.extend({
            open: props.defaultOpen || false,
            filter: ''
        },CustomerStore.getState());
    }
    componentWillMount() {
        this.unsubscribe = CustomerStore.listen(this.onStoreDidChange.bind(this))
        if (!this.state.customersLoaded) {
            CustomerActions.LoadCustomers();
        }
    }
    componentWillUnmount() {
        this.unsubscribe()
    }
    onStoreDidChange(newState) {
        this.setState(newState);
    }
    onSelect(customer) {
        this.props.onSelect && this.props.onSelect(customer);
        this.close();
    }
    show() {
        this.setState({open: true});
    }
    close() {
        this.setState({open: false});
    }
    render() {
        var standardActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.close()}
            />
        ];
        var {customers, open, isCustomersLoaded, filter, ...others} = this.state;
        var selectedIds = this.props.selectedIds;
        var titleStyle = {
            margin: 0,
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: 24,
            lineHeight: '32px',
            fontWeight: 400
        }
        var title = (
            <div style={{padding: '24px 24px 0 24px'}}>
                <h3 style={titleStyle}>{`Customers(${customers.length})`}</h3>
                <TextField
                    hintText="Search"
                    fullWidth={true}
                    value={filter}
                    onChange={(ev) => this.setState({filter: ev.target.value})}/>
            </div>
        )
        return (
            <Dialog
                open={open}
                actions={standardActions}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                onRequestClose={this.close.bind(this)}
                title={title}
                bodyStyle={{paddingTop: 0}}
                contentStyle={{width: 420}}>
                {isCustomersLoaded ?
                    this._buildContent(customers, filter, selectedIds)
                    : <div style={{textAlign: 'center'}}><CircularProgress mode="indeterminate" /></div>
                }
            </Dialog>
        );
    }
    _buildContent(customers, filter, selectedIds=[]) {
        var items = [];
        filter = (filter || '').toLowerCase();
        _.each(customers, c => {
            if (c.displayName && !!~c.displayName.toLowerCase().indexOf(filter) && selectedIds.indexOf(c.id) === -1) {
                items = [...items,
                    <ListItem
                        key={c.id}
                        primaryText={c.displayName}
                        onTouchTap={this.onSelect.bind(this, c)}/>,
                    <Divider key={`divider-${c.id}`}/>
                ]
            }
        }).sort((a, b) => a.displayName > b.displayName ? 1 : a.displayName < b.displayName ? -1 : 0);
        return [
            <List style={{maxHeight: 'calc(100% - 48px)', overflowY: 'auto'}}>
                {items}
            </List>
        ]
    }
}
class CustomerField extends React.Component {
    static propTypes = {
        multi: React.PropTypes.Bool
    };
    constructor(props) {
        super(props);
        this.displayName = 'CustomerPicker';
        var defaultValue = this.props.defaultValue;
        var customer = _.isObject(defaultValue) ? defaultValue : { id: defaultValue };
        this.state = { customer };
    }
    onCustomerSelected(customer) {
        this.setState({customer});
    }
    onClick(ev) {
        this.refs.customerPicker.show();
    }
    getValue() {
        if (this.props.multi) {
            return this.refs.customerLines.getValue();
        }
        return {id: this.state.customer.id};
    }
    render() {
        if (this.props.multi) {
            return <CustomerLinesField ref="customerLines" {...this.props}/>;
        }
        var customer = this.state.customer;
        var tfStyle = {
            cursor: 'pointer',
        }
        return (
            <div>
                <TextField {...this.props} value={customer.displayName || ''}
                    onTouchTap={this.onClick.bind(this)}
                    style={tfStyle}
                    inputStyle={tfStyle}
                    onFocus={ev => ev.target.blur()}/>
                <CustomerPicker ref="customerPicker" onSelect={this.onCustomerSelected.bind(this)}/>
            </div>
        )
    }
}



class CustomerLinesField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityCustomers: this.props.defaultValue || []
        }
        console.log(this.props.defaultValue);
    }
    onCustomerSelected({ displayName, id }) {
        this.setState({
            activityCustomers: [...this.state.activityCustomers, { displayName, customerId: id }]
        });
    }
    getValue() {
        return _.map(this.state.activityCustomers, ({ customerId }) => ({ customerId }));
    }
    onClickAdd() {
        this.refs.picker.show();
    }
    onRemove(id) {
        var activityCustomers = _.reject(this.state.activityCustomers, c => c.customerId === id);
        this.setState({ activityCustomers });
    }
    getStyles() {
        return {
            containers: {
                root: {
                    display: 'flex',
                    minHeight: 48
                },
                label: {
                    margin: '14px 24px 0 0',
                    fontSize: 14,
                    width: 120
                },
                customers: {
                    paddingLeft: 18,
                    paddingTop: 4
                },
                addBtn: {
                    color: colors.link,
                    cursor: 'pointer',
                    marginLeft: 10,
                    textDecoration: 'none',
                    float: 'right',
                }
            },
            addBtn: {
                fontSize: 12,
                color: colors.link,
            },
            addIcon: {
                fontSize: 12
            }
        }
    }
    render() {
        var { activityCustomers } = this.state;
        var { floatingLabelText, label, ...others} = this.props;
        var customers = _.map(activityCustomers, c => (
            <Participant {...c} onRemove={(id) => this.onRemove(id)} />
        ));
        var styles = this.getStyles();
        return (
            <div style={styles.containers.root}>
                <div style={styles.containers.label}>
                    <span>{floatingLabelText || label}</span>
                    <span style={styles.containers.addBtn}>
                        <span className="material-icons" style={styles.addIcon}>add</span>
                        <a href="javascript:void(0)" onTouchTap={ev => this.onClickAdd()} style={styles.addBtn}>Add</a>
                    </span>
                </div>
                <List style={styles.containers.customers}>
                    {customers}
                </List>
                <CustomerPicker
                    ref="picker"
                    onSelect={this.onCustomerSelected.bind(this)}
                    selectedIds={ _.map(activityCustomers, cl => cl.customerId) }
                />
            </div>
        )
    }
}

export default CustomerField;
export { CustomerPicker, CustomerLinesField };