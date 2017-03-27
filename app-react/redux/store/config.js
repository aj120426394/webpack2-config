/**
 * This is the redux Store configuration file.
 *
 * Plugin:
 * 1. redux-thunk: This plugin help to use the middleware
 * 2. redux-persist: This plugin help to store the redux state into local storage
 * 3. redux-action-buffer: This plugin help to set a buffer to do some setup before the app trigger the first action.
 *
 */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import combineReducers from '../reducers/index';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default createStore(combineReducers, {}, compose( autoRehydrate(), applyMiddleware(createActionBuffer(REHYDRATE), thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
// export default createStoreWithMiddleware(combineReducers);

