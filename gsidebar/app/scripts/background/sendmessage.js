export default (data, callback) => {
    
    return new Promise((resolve, reject) => {
        chrome.tabs.query({url: "*://mail.google.com/*"}, function(tabs) {
            if (tabs.length === 0) {
                reject();
                return;
            }
            lastTabId = tabs[0].id;
            var index = tabs[0].index;
            chrome.tabs.sendMessage(lastTabId, data, callback);
            if (data.highlight) {
                chrome.tabs.highlight({tabs: index}, function(){});
            }
            resolve();
        });
    })
}