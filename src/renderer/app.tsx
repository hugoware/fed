import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Proxy from './proxy';
import { useSelector, useDispatch } from './reducers';

type ProxyStates = 'offline' | 'stopping' | 'online' | 'starting';

export default function App() {
	const config = useSelector(state => state.proxy);
	const dispatch = useDispatch();
	const [proxy, setProxy] = useState(() => new Proxy());

	// tracking server state
	const [proxyState, setProxyState] = useState<ProxyStates>('offline');
	const [isActive, setIsActive] = useState(config.isActive);
	const [portNumber, setPortNumber] = useState(() =>
		config.portNumber.toString()
	);

	// handle updating
	function onChangePortNumber(event: React.ChangeEvent<HTMLInputElement>) {
		setPortNumber(event.currentTarget.value);
	}

	// finalize the change
	function onCommitPortNumber(event: React.FocusEvent<HTMLInputElement>) {
		const update = parseInt(portNumber);
		if (_.isNumber(update) && update > 999 && update < 99999) {
			dispatch({
				type: 'SET_PROXY_PORT_NUMBER',
				data: { portNumber: update }
			});
		}
	}

	// toggles the server on or off
	async function onToggleServer() {
		await (proxy.isActive ? stopServer : startServer)();
		dispatch({ type: 'ACTIVATE_PROXY' });
	}

	// deactivates the server
	async function stopServer() {
		setProxyState('stopping');
		await proxy.stop();
		setProxyState('offline');
	}

	// activates the server for use
	async function startServer() {
		setProxyState('starting');
		await proxy.start();
		setProxyState('online');
	}

	// restart the proxy server, if needed
	async function replacePortNumber() {
		const { portNumber } = config;
		const running = proxy.isActive;

		// stop the server, if needed
		if (running) {
			await stopServer();
		}

		// update the port
		proxy.setPort(portNumber);

		// restart, if needed
		if (running) {
			await startServer();
		}
	}

	// handle proxy server port number changes
	useEffect(() => {
		replacePortNumber();
	}, [config.portNumber]);

	return (
		<div>
			<div>{proxyState}</div>
			<input
				type="text"
				value={portNumber}
				onBlur={onCommitPortNumber}
				onChange={onChangePortNumber}
			/>

			<button onClick={onToggleServer}>
				{proxy.isActive ? 'Deactivate' : 'Activate'}
			</button>
		</div>
	);
}
