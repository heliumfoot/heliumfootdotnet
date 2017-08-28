/**
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 * 
 * With thanks to Xeoncross: https://gist.github.com/Xeoncross/7663273
 * 
 * @param string url
 * @param object callback
 * @param mixed data
 * @param null x
 */
function URLConnection() {
	this.xmlHttpRequest = XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('MSXML2.XMLHTTP.3.0');
	this.readyState = {"uninitialized":0, "established":1, "received":2, "processing":3, "finished":4};
	this.method = {"get":"GET", "post":"POST", "put":"PUT", "delete":"DELETE"}
	this.status = {"ok":200};
};
URLConnection.prototype.__request = function(methodAsString, url, callback, body){
	try {
		this.xmlHttpRequest.open(methodAsString, url, true);
		this.xmlHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		this.xmlHttpRequest.setRequestHeader('Content-type', 'application/json');
		var self = this;
		this.xmlHttpRequest.onreadystatechange = function () {
			if (self.xmlHttpRequest.readyState > self.readyState.processing && callback) {
				callback(self.xmlHttpRequest.responseText, self);			
			}
		};
		this.xmlHttpRequest.send(body)
	
	} catch (e) {
		window.console && console.log(e);
	}

};

/**
 * @param string url
 * @param object callback taking two arguments: the response text and a reference to this URLConnection instance
 *
*/
URLConnection.prototype.get = function(url, callback){
	this.__request(this.method.get, url, callback);
};

/**
 * @param string url
 * @param object callback taking two arguments: the response text and a reference to this URLConnection instance
 * @param object JSON.stringifiable object
 *
*/
URLConnection.prototype.post = function(url, body, callback){
	this.__request(this.method.post, url, callback, JSON.stringify(body));
};


