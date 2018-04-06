export default {
    setState: function (state) {
        var changed = false;
        var prevState = _.extend({}, this.state);
        for (var key in state) {
            if (state.hasOwnProperty(key)) {
                if (this.state[key] !== state[key]) {
                    changed = true;
                }
            }
        }

        if (changed) {
            this.state = _.extend(this.state, state);
            if (_.isFunction(this.storeDidUpdate)) {
                this.storeDidUpdate(prevState);
            }
            this.trigger(this.state);
        }
    },
    getState: function (key) {
        var state = (_.isFunction(this.preEmit) && this.preEmit(this.state)) || this.state;
        return key ? state[key] : state;
    },
    init: function () {
        if (_.isFunction(this.getInitialState)) {
            this.state = this.getInitialState();
        }
    }
}