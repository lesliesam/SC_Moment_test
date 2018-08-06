import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers , compose} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import * as reducers from '../reducers';
import Main from './Main';

const logger = createLogger();
const middleware = applyMiddleware(logger , thunk);
const reducer = combineReducers(reducers);
const store = createStore(reducer, compose(middleware));

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Main />
			</Provider>
		);
	}
}
