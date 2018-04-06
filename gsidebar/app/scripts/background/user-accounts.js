import store from './ls-store';

export default {
    get: function(userEmail) {
        return store.get('u_a.' + userEmail);
    },
    set: function(newParams, userEmail) {
        var lsVal = this.get(userEmail);
        lsVal = lsVal ? _.extend(lsVal, newParams) : newParams;
        store.set('u_a.' + userEmail, lsVal);
    },
}