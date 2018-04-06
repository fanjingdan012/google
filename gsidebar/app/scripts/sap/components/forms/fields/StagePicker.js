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

const URL = `${BASE_URL}/Stages`;

const Store = createStore({
    mixins: [StoreStateMixin],
    getInitialState() {
        return { stages: [], stagesLoaded: false };
    },
    load() {
        if (this.getState('stagesLoaded')) return;
        baseApi.apiCall({ url: URL })
            .then(
                stages => this.setState({ stages, stagesLoaded: true }),
                err => this.setState({ stagesLoaded: false })
            )

    }
})


class StagePicker extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = "StagePicker";

        var defaultValue  = this.props.defaultValue;
        var storeState = Store.getState();

        if (!defaultValue && storeState.stagesLoaded && storeState.stages.length) {
            defaultValue = storeState.stages[0];
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
            if (!value && newState.stagesLoaded && newState.stages && newState.stages.length) {
                value = newState.stages[0];
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

    buildItems(stages, filter) {
        var items = filter ? _.filter(stages, c => c.name && c.name.indexOf(filter) > -1) : stages;
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
        var { stages, stagesLoaded, filter, value } = this.state;
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
                    isLoaded={stagesLoaded}
                    onSelect={ value => this.onSelect(value) }
                >
                    { this.buildItems(stages, filter) }
                </Picker>
            </div>

        );
    }
}
export default StagePicker;