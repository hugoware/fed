import { updateState } from './';

const DEFAULT_STATE: ProxyServerState = {
	isActive: false,
	portNumber: 4500
};

/** current proxy state information */
export type ProxyServerState = {
	isActive: boolean;
	portNumber: number;
};

/** assigns the current user */
export type SetProxyServerPortNumber = {
	type: 'SET_PROXY_PORT_NUMBER';
	data: {
		portNumber: number;
	};
};

/** requests the current user be signed out */
export type ActivateProxyServer = {
	type: 'ACTIVATE_PROXY';
};

/** requests the current user be signed out */
export type DeactivateProxyServer = {
	type: 'DEACTIVATE_PROXY';
};

/** Possible user actions */
export type ProxyServerActions =
	| SetProxyServerPortNumber
	| ActivateProxyServer
	| DeactivateProxyServer;

export default function reducer(
	state: ProxyServerState = DEFAULT_STATE,
	action: ProxyServerActions
): ProxyServerState {
	switch (action.type) {
		case 'SET_PROXY_PORT_NUMBER':
			return updateState(state, {
				portNumber: action.data.portNumber
			});

		case 'ACTIVATE_PROXY':
			return updateState(state, {
				isActive: true
			});

		case 'DEACTIVATE_PROXY':
			return updateState(state, {
				isActive: false
			});

		default:
			return state;
	}
}
