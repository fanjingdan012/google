export default () => {
    return new Promise((resolve, reject) => {
        window.gapiPlatformIsLoaded = function () {
            console.log('gapi platform loaded');
            // resolve();
        };
        window.gapiIsLoaded = function () {
            console.log('gapi loaded');
            resolve();
        };
        if (!(chrome && chrome.app && chrome.app.runtime)) {
            var platformScript = document.createElement('script');
            platformScript.src = 'https://apis.google.com/js/platform.js?onload=gapiPlatformIsLoaded';
            document.documentElement.appendChild(platformScript);
        }
        if (typeof gapi !== 'undefined') {
            console.debug('gapi already defined.');
            resolve();
        } else {
            var script = document.createElement('script');
            script.src = 'https://apis.google.com/js/client.js?onload=gapiIsLoaded';
            document.documentElement.appendChild(script);
        }
    })
}