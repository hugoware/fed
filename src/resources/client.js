(function() {
	var target = 'http://localhost:4500';
	var xhr = window.XMLHttpRequest;
	var xhr_open = xhr.prototype.open;

	// replace the open function
	xhr.prototype.open = function() {
		// capture the original request
		var url = arguments[1];
		arguments[1] = target;

		// open as usual
		xhr_open.apply(this, arguments);

		// include the header info
		this.setRequestHeader('fed-proxy-request', url);
	};
})();
