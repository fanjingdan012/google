import ConfigStore from 'sap/stores/config';


const DEFAULT_INSTANCE_URL = 'https://eap-occ-us.sapanywhere.com'
var instanceUrl = DEFAULT_INSTANCE_URL;



const DATE_FORMAT = 'MMM D, YYYY h:mm a';

ConfigStore.listen(function (config) {
    instanceUrl = config.instanceUrl || DEFAULT_INSTANCE_URL;
});

export default {
    getPermaLink(boName, id) {
        var options = {
            type: 'bo',
            option: {
                boName, // or 'Product' or 'SalesOrder', i.e. the Business Object name
                boNamespace: 'com.sap.sbo', // a constant for the SAP provided Business Object
                id // the ID of the Business Object instance
            }
        };
        var urlParam = window.btoa(unescape(encodeURIComponent( JSON.stringify(options) )))
        return `${instanceUrl}/sbo/index.html#${urlParam}`;
    },
    formatDate(date) {
        return moment(date).format(DATE_FORMAT);
    },
    formatCurrency(num) {
        return (num || 0).toFixed(2).replace(/./g, function(c, i, a) {
            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });
    },
    getIconInfo(status) {
        const icons = {
            MISSED: 'icon-status-reject',
            CANCEL: 'icon-delete-wiz-circle-selected',
            OPEN: 'icon-status-opportunity',
            CLOSED: 'icon-status-approved',
            DRAFT: 'icon-draft',
            WAITING_APPROVAL: 'icon-awaiting-approve',
            APPROVED: 'icon-approved',
            SOLD: 'icon-status-approved'
        }
        const colors = {
            MISSED: '#fc5258',
            CANCEL: '#8a8a8a',
            OPEN: '#ff7f00',
            CLOSED: '#4caf50',
            DRAFT: '#ff9800',
            WAITING_APPROVAL: '#ffc107',
            APPROVED: '#ff9800',
            SOLD: '#3cbe62'
        }
        return {
            iconName: icons[status],
            color: colors[status],
        }
    },
    getNearest30Min() {
        var start = moment();
        var remainder = (30 - start.minute()) % 30;
        var time = moment(start).add('minutes', remainder);
        if (time.isBefore(start)) {
            return time.add('minutes', 30).toDate();
        } else {
            return time.toDate();
        }
    }
}