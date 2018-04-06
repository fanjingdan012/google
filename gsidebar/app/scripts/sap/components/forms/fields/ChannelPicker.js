import React from 'react';
import { createStore } from 'reflux';

import StoreStateMixin from 'core/mixins/store-state';
import Container from 'core/components/Container';

import channelApi from 'sap/api/sales-channels';

// components
//mui
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
// sap
import Picker from './Picker';

const Store = createStore({
    mixins: [StoreStateMixin],
    getInitialState() {
        return { channels: [], channelsLoaded: false };
    },
    load() {
        if (this.getState('channelsLoaded')) return;
        channelApi.load()
            .then(
                channels => this.setState({ channels, channelsLoaded: true }),
                err => this.setState({ channelsLoaded: false })
            )

    }
})


class ChannelPicker extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = "ChannelPicker";

        var defaultValue  = this.props.defaultValue;
        var storeState = Store.getState();

        if (!defaultValue && storeState.channelsLoaded && storeState.channels.length) {
            defaultValue = storeState.channels[0];
        }

        this.state = {
            ...storeState,
            value: defaultValue,
            filter: '',
        };

    }

    componentWillMount() {
        this.unsubscibe = Store.listen(newState => {
            var value = this.state.value;
            if (!value && newState.channelsLoaded && newState.channels && newState.channels.length) {
                value = newState.channels[0];
            }
            this.setState({ ...newState, value });
        });
        Store.load();
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

    buildItems(channels, filter) {
        var items = filter ? _.filter(channels, c => c.name && c.name.indexOf(filter) > -1) : channels;
        return _.map(items, c => (
            <ListItem
                key={c.id}
                value={c}
                primaryText={c.name}
            />
        ));
    }

    onClick(ev) {
        this.refs.picker.show();
    }

    render() {
        var { style, defaultValue, ...other } = this.props;
        var textFieldStyle = _.extend({ cursor: 'pointer' }, style);
        var { channels, channelsLoaded, value, filter } = this.state;
        return (
            <div>
                <TextField
                    {...other}
                    style={textFieldStyle}
                    inputStyle={textFieldStyle}
                    value={value && value.name}
                    onTouchTap={ ev => this.onClick(ev) }
                    onFocus={ev => ev.target.blur()}
                />
                <Picker
                    ref="picker"
                    title="Sales Channel"
                    filter={filter}
                    isLoaded={channelsLoaded}
                    onSelect={ value => this.onSelect(value) }
                >
                    { this.buildItems(channels, filter) }
                </Picker>
            </div>

        );
    }
}
export default ChannelPicker;