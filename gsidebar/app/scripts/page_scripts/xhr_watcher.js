export default (before, after) => {
    var win = window;

    var xhr_open = win.XMLHttpRequest.prototype.open;
    var xhr_send = win.XMLHttpRequest.prototype.send;

    win.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        var out = xhr_open.call(this, method, url, async, user, password);
        this.xhrParams = {
          method: method.toString(),
          url: url.toString()
        };
        return out;
    };

    win.XMLHttpRequest.prototype.send = function (body) {
        // fire before events
        if (this.xhrParams) {
            this.xhrParams.body = body;

        }
        before && before(this.xhrParams);
        // if any matching after events, bind onreadystatechange callback
        
        var curr_onreadystatechange = this.onreadystatechange; // copy origin onreadystatechange
        var xhr = this;
        this.onreadystatechange = function(progress) {
            if (this.readyState === this.DONE && after) {
                var params = {
                    xhrParams: xhr.xhrParams,
                    responseText: xhr.responseText,
                    responseType: xhr.responseType,
                    responseURL: xhr.responseURL,
                    status: xhr.status
                }
                after(params);
            }
            if (curr_onreadystatechange) {
              curr_onreadystatechange.apply(this, arguments);
            }
        }

        // send the original request
        var out = xhr_send.apply(this, arguments);

        // fire on events
        return out;
    }
}