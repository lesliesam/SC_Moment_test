'use strict';

import {
	Alert,
	Platform,
	AsyncStorage,
} from 'react-native';

export var showLoading;
export var showPopup;

var USER_SERVER_URL = 'http://127.0.0.1:8080/Moment'
var IMAGE_SERVER_URL = 'http://127.0.0.1:8083/Moment'
var MOMENT_SERVER_URL = 'http://127.0.0.1:8082/Moment'

export var SIGNUP_WITH_DEVICE_ID_URL = USER_SERVER_URL + '/user/signupWithDeviceId'
export var UPDATE_USER_NAME_URL = USER_SERVER_URL + '/user/updateUserName'
export var UPLOAD_IMAGE_URL = IMAGE_SERVER_URL + '/image/uploadImage'
export var POST_MOMENT_URL = MOMENT_SERVER_URL + '/moment/post'
export var GET_MOMENT_URL = MOMENT_SERVER_URL + '/moment/get'

export function formBody(body) {
	return Object.keys(body).map((key) => {
		return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
	}).join('&');
}

function defaultSuccessCallback(jsonResponse){
	console.log('Fetching URL Success: ' + jsonResponse)
}

function defaultErrorCallback(msg){
	console.log('Fetching URL Error: ' + msg)
}

function defaultInternetErrorCallback(msg){
	console.log('Fetching URL InternetError: ' + msg)
}

const CONTENT_TYPE = [
	'application/json; charset=UTF-8',
	'text/plain',
	'image/jpg'
];

export function fetchURL(_url, loading, method, contentType, body, sCallback, eCallback, iCallback) {

	let url = Constants.Server[Constants.CURRENT_ENV] + 'api/'+ _url;

	this.showPopup.bind(this);
	this.showLoading.bind(this);

	let requestSuccess = true;
	let successCallback = sCallback?sCallback:defaultSuccessCallback;
	let errorCallback = eCallback?eCallback:defaultErrorCallback;
	let internetErrorCallback = internetErrorCallback?iCallback:defaultInternetErrorCallback;
	let params = {
		headers: {}
	}

	params.method = method?method:'POST';
	params.timeout = 2
	if (body) {
		params.body = JSON.stringify(body);
	}

	if (!params.headers.Authorization && Constants.Logic.SessionToken != '' && Constants.Logic.SessionToken != undefined) {
		params.headers.Authorization = 'SHC ' + Constants.Logic.SessionToken;
	}

	if (CONTENT_TYPE[contentType]) {
		params.headers['Content-Type'] = CONTENT_TYPE[contentType];
	}

	if (loading) {
		if (this.showLoading != null) {
			this.showLoading(true);
		}
	}

	console.log('fetch', url, 'params', params);

	timeout(30000, fetch(url, params))
		.then((response) => {
			console.log(response);
			if (response.status === 200 || response.status === 204) {
				requestSuccess = true;
			} else if (response.status === 401){
				throw new Error("network request unauthorized");
			} else {
				requestSuccess = false;
			}

			if (response.length == 0) {
				response = '{}';
			}
			return response.json();
		})
		.then((responseJson) => {
			if (requestSuccess) {
				if (requestSuccess.length == 1) {
					var errorMsg = responseJson['Message'];
					console.log('fetchTHUrl handled error with message: ' + errorMsg);
					errorCallback(i18n.formattedMessage(responseJson.ExceptionMessage || responseJson.Message || responseJson.message || errorMsg));
				} else {
					// console.log('fetchTHUrl success with response: ');
					// console.log(responseJson);
					successCallback(responseJson);
				}
			} else {
				errorMsg = responseJson['Message'];
				console.log('fetchTHUrl unhandled error with message: ' + errorMsg);

				const popupProps = {
					visible: true,
					// content: i18n.formattedMessage(responseJson.ExceptionMessage || responseJson.Message || responseJson.message || errorMsg),
				};
				Alert.alert(
					"",
					i18n.formattedMessage(responseJson.ExceptionMessage || responseJson.Message || responseJson.message || errorMsg),
						[
							{text: i18n.formattedMessage('CANCEL'), onPress: () => {this.showPopup(false);}},
						],
					{
						cancelable : false
					}
				);
				this.showPopup(true);

				errorCallback(i18n.formattedMessage(responseJson.ExceptionMessage || responseJson.Message || responseJson.message || errorMsg));
			}
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e);
			var message = e.message;
			let needRestart = false;
			if(message.toLowerCase() === 'network request failed'){
				message = i18n.formattedMessage('NETWORK_ERROR_400');
			}
			else if (message.toLowerCase() === 'network request timeout') {
				message = i18n.formattedMessage('NETWORK_ERROR_TIMEOUT');
			}
			else if (message.toLowerCase() === 'network request unauthorized') {
				message = i18n.formattedMessage('NETWORK_ERROR_401');
				needRestart = true;
			}


			Alert.alert(
				"",
				message,
				[
					{text: i18n.formattedMessage('RETRY'), onPress: () => {
						this.showPopup(false);
						this.fetchURL(_url, loading, method, contentType, body, sCallback, eCallback, iCallback);
					}},
					{text: i18n.formattedMessage('CANCEL'), onPress: () => {
						this.showPopup(false);
						if (needRestart) {
							AsyncStorage.removeItem('@SPORTSHERO:savedAuthToken').then(()=>{
									RNRestart.Restart();
								}
							)
						}
					}}
				],
				{
					cancelable : false
				}
			);
			this.showPopup(true);
			internetErrorCallback(message);
			console.log('', message, [{text: 'OK'}]);

		})
		.done(() => {
			if (loading)
			{
				if (this.showLoading != null)
				{
					this.showLoading(false);
				}
			}
		});
}


function timeout(ms, promise) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			reject(new Error("network request timeout"));
		}, ms);
		promise.then(resolve, reject);
	});
}
