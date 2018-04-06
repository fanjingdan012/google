import Reflux from 'reflux';
import RefluxPromise from "reflux-promise";
import jquery from 'jquery.scrollto';
import 'moment-timezone';

Reflux.use(RefluxPromise(Promise));
console.log('initialize');
process.on('unhandledRejection', function(p, reason) {
    // handle error here, all "swallowed" errors get here
    console.log(p, reason);
});

export default {};