import * as types from './actionTypes';

export function setUserInfo(userInfo) {
	return {
		...userInfo,
		type: types.SET_USER_INFO
	};
}

export function setUserName(userName) {
	return {
		type: types.SET_USER_NAME,
		userName: userName
	};
}
