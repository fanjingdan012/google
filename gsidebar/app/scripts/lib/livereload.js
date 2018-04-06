// Use for page reloads

if (__ENV__ === 'development') {
  (function() {

    let LIVERELOAD_HOST = 'localhost:';
    let LIVERELOAD_PORT = 35729;
    let connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');

    connection.onerror = function(error) {
      console.error('reload connection got error:', error);
    };

    connection.onmessage = function(e) {
      if (e.data) {
        var data = JSON.parse(e.data);
        if (data && data.command === 'reload') {
          // chrome.tabs.query({url: "chrome://extensions/"}, function(results) {
          //     if (results.length) {
          //         var code = 'window.location.reload();';
          //         chrome.tabs.executeScript(results[0].id, {code: code});
          //     }
          // });
          // window.location.reload();
          chrome.runtime.reload();
        }
      }
    };

    console.log('%cLivereload: enabled', 'color: gray');
  })();
}
