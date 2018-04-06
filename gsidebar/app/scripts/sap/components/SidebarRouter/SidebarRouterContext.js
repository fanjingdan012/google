import React from 'react';
import Reflux from 'reflux';
import Hash from './Hash';

export default React.createClass({
    mixins: [Reflux.ListenerMixin],
    getInitialState() {
        return {
            pathMap: {},
            active: {
                path: '',
                params: {}
            }
        };
    },
    componentDidMount() {
        this.listenTo(Hash, this.onHashChange);
    },
    componentWillMount() {
        this._buildPathMap(this.props.routes);
    },
    onHashChange(newState) {
        console.debug('hash change', newState.active);
        this.setState(newState);
    },
    _buildPathMap(routes) {
        routes.forEach(route => {
            this.state.pathMap[route.props.path] = route.props.component;
            if (route.props.default) {
                this.state.active.path = route.props.path;
            }
        });
    },
    render() {
        return (
            this.state.active.path ?
                React.createElement(
                    this.state.pathMap[this.state.active.path],
                    this.state.active.params
                ) : null
        );
    }
});