import http, { Server, IncomingMessage, OutgoingMessage } from 'http';
import HttpProxy from 'http-proxy';
import { EventEmitter } from 'events';

const PROXY_HEADER = 'fed-proxy-request';
const CLIENT_SCRIPT = `
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
		this.setRequestHeader('${PROXY_HEADER}', url);
	};
})();
`;

export default class Proxy extends EventEmitter {
	private _server: Server;
	private _portNumber: number;
	private _proxy: HttpProxy;

	/** create the new instance */
	constructor() {
		super();
		this._server = http.createServer(this.handleRequest);
		this._proxy = HttpProxy.createProxyServer({});

		// handle results
		this._proxy.on('proxyRes', (back, req, res) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.write('done');
			res.end();
			// console.log(back);
		});
	}

	/** Returns the current port number being used */
	get portNumber() {
		return this._portNumber;
	}

	/** Is the routing helper actively listening */
	get isActive() {
		return this._server.listening;
	}

	/** starts the routing helper server */
	start = (): Promise<void> => {
		return new Promise(resolve => {
			this._server.listen(this.portNumber, () => resolve());
		});
	};

	/** stops listening to requests */
	stop = async (): Promise<void> => {
		return new Promise(resolve => {
			this._server.close(() => resolve());
		});
	};

	/** changes the listening port number for the server */
	setPort = async (port: number = this.portNumber) => {
		// can't change the port number while running
		if (this.isActive) {
			throw new Error('Cannot change port number while server is running');
		}

		// replace the port number
		this._portNumber = port;
	};

	/** handles incoming requests */
	handleRequest = async (
		request: IncomingMessage,
		response: http.ServerResponse
	): Promise<void> => {
		// check if this is a default request for
		// the root script
		if (!request.headers[PROXY_HEADER]) {
			return this.sendDefaultResponse(response);
		}

		// start by trying to proxy the request
		return new Promise((resolve, reject) => {
			const target = request.headers[PROXY_HEADER] as string;
			delete request.headers[PROXY_HEADER];

			response.setHeader('Access-Control-Allow-Origin', '*');
			this._proxy.web(
				request,
				response,
				{
					target
					// selfHandleResponse: true
				},
				() => {
					// this failed -- add to the list?
					console.log('failed to proxy');
				}
			);
		});
	};

	/** returns the basic client script for requests */
	sendDefaultResponse(response: http.OutgoingMessage) {
		response.setHeader('Content-Type', 'text/javascript');
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Headers', '*');
		response.write(CLIENT_SCRIPT);
		response.end();
	}
}
