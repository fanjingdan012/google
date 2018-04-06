import Reflux from "reflux";

const Actions = Reflux.createActions({
    EventOpened: {},
    UpdateSapEvent: {}
})

const methods = {
    init() {
        // window.top.window.addEventListener('hashchange', () => {
        //     // Update google contact cach when transfering from gcontact page to another page
        //     var el = this.getEventEl();
        //     if (el) {
        //         Actions.EventOpened(el);
        //     }
        // });
        document.addEventListener('webkitAnimationStart', ev => {
            if (ev.animationName === 'calendar-event-opened') {
                Actions.EventOpened(ev.target);
            }
        }, false);
    },
    getEventEl() {
        var hash = window.location.hash;
        if (hash.indexOf('#eventpage') === 0) {
            var el = $('[data-eid]:eq(0)');
            if (el && el.length) {
                return el[0]
            }
        }
        return null;
    }
}
methods.init();

setTimeout(function() {
    var el = methods.getEventEl();
    if (el) {
        Actions.EventOpened(el);
    }
}, 10);
export default Actions;