import * as types from '../actions/actionTypes';

const initialState = {
	userName: '',
	session: '',
	id: 0,
	profileImageUrl: null
};

export default function stateUpdate(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_USER_INFO:
			return {
				...state,
				userName : action.userName,
				session: action.session,
				id: action.id,
				profileImageUrl: action.profileImageUrl,
			};

		case types.SET_USER_NAME:
			return {
				...state,
				userName: action.userName,
			}
		default:
			return state;
	}
}
