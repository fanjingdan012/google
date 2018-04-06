import React from 'react';



export default (Component, store) => class Container extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Container';
        this.state = store.getState();
        this.unsubscribe = store.listen(newState => this.setState(store.getState()));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return <Component {...this.state} {...this.props}/>;
    }
};
