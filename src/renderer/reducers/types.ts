import { ProxyServerActions, ProxyServerState } from './proxy';

/** all allowed action types */
export type Actions = ProxyServerActions;

/** application state information */
export interface State {
	proxy: ProxyServerState;
}
