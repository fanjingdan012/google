import Reflux from 'reflux';
import HashActions from './HashActions';
import StoreStateMixin from 'core/mixins/store-state';

export default Reflux.createStore({
    mixins: [StoreStateMixin],
    listenables: [HashActions],
    init() {
        this.state = {
            history: [],
            active: {
                path: '',
                params: {}
            },
            lastViewSaved: true
        }
    },
    _historyPush(path, params, save) {
        this.state.history.push({path, params, save});
    },
    _historyPop() {
        // if (this.state.history.length > 1) {
        //     return ;
        // } else {
        //     return this.state.history.pop();
        // }
        return this.state.history.pop()
    },
    onChangePath(path, params, save=true) {
        console.debug('path change', arguments);
        var active = this.state.active;
        if (active && active.save) {
            this._historyPush(active.path, active.params, active.save);
        }
        this.setState({
            active: { path, params, save },
        });
    },
    onRevertPath() {
        console.debug('path revert');
        /// pop current view
        var active = this._historyPop();
        HashActions.PreRevertPath(active.path, active.params);
        /// set last path as active
        this.setState({active});
    }

})