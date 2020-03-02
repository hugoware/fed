import { combineReducers } from 'redux';
import * as reactRedux from 'react-redux';
import { Actions, State } from './types';

// export types
export * from './proxy';

// create reducers
import proxy from './proxy';

/** helper function for immutable updates to state with intellisense */
export function updateState<T>(state: T, update: Partial<T>) {
	return Object.assign({}, state, update);
}

/** helper function for type casting */
export function useSelector<T>(selector: (state: State) => T): T {
	return reactRedux.useSelector(selector);
}

/** helper function for casting to allowed types */
export function useDispatch(): (action: Actions) => any {
	return reactRedux.useDispatch();
}

// create structure
// const filters = combineReducers({ subItems });
export default combineReducers({ proxy });
