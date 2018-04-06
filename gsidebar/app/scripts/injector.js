import AppActions from 'sap/actions/app';

const injectScripts = () => {
	console.debug('injecting scripts to gmail...');
	yepnope({
	    load: [
	        chrome.extension.getURL("scripts/lib/vendors/gmail.js"),
	        // chrome.extension.getURL("scripts/vendor.js"),
	        chrome.extension.getURL("scripts/gmail.js"),
	    ],
	});
}

AppActions.InjectScripts.listen(() => injectScripts());
