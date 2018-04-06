import React from 'react';
import { createStore } from 'reflux';

import StoreStateMixin from 'core/mixins/store-state';
import Container from 'core/components/Container';

import {BASE_URL, default as baseApi} from 'sap/api/base';

// components
//mui
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
// sap
import Picker from './Picker';

const URL = `${BASE_URL}/SalesSources`;

const Store = createStore({
    mixins: [StoreStateMixin],
    getInitialState() {
        return { salesSources: [], salesSourcesLoaded: false };
    },
    load() {
        if (this.getState('salesSourcesLoaded')) return;
        baseApi.apiCall({ url: URL })
            .then(
                salesSources => this.setState({ salesSources, salesSourcesLoaded: true }),
                err => this.setState({ salesSourcesLoaded: false })
            )

    }
})


class StagePicker extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = "StagePicker";

        var defaultValue  = this.props.defaultValue;

        this.state = {
            value: defaultValue,
            filter: '',
        };
    }

    componentWillMount() {
        this.unsubscibe = Store.listen(newState => this.setState(newState))
    }

    componentWillUnmount() {
        this.unsubscibe();
    }

    getValue() {
        var value = this.state.value || {};
        return { id: value && value.id };
    }

    onSelect(value) {
        return this.setState({ value });
    }

    onFilterChange(ev) {
        var filter = ev.target.value;
        this.setState({ filter });
    }

    buildItems(salesSources, filter) {
        var items = filter ? _.filter(salesSources, c => c.name && c.name.indexOf(filter) > -1) : salesSources;
        return _.map(items, c => (
            <ListItem
                key={c.id}
                value={c}
                primaryText={c.description}
            />
        ));
    }

    onClick(ev) {
        this.refs.picker.show();
        Store.load();
    }

    render() {
        var { style, defaultValue, ...other } = this.props;
        var textFieldStyle = _.extend({ cursor: 'pointer' }, style);
        var { salesSources, salesSourcesLoaded, filter, value } = this.state;
        return (
            <div>
                <TextField
                    {...other}
                    style={textFieldStyle}
                    inputStyle={textFieldStyle}
                    value={value && value.description}
                    onTouchTap={ ev => this.onClick(ev) }
                    onFocus={ev => ev.target.blur()}
                />
                <Picker
                    ref="picker"
                    title="Sales Channel"
                    filter={filter}
                    isLoaded={salesSourcesLoaded}
                    onSelect={ value => this.onSelect(value) }
                >
                    { this.buildItems(salesSources, filter) }
                </Picker>
            </div>

        );
    }
}
export default StagePicker;