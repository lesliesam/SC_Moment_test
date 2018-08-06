import React, {Component} from 'react';
import {StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform}
	from 'react-native';
import * as ComponentConstants from './ComponentConstants';
import * as NetworkModule from '../modules/networkModule'

import DeviceInfo from 'react-native-device-info';

var {height, width} = Dimensions.get('window');
var deviceId = DeviceInfo.getUniqueID();

export default class Homepage extends Component {
	constructor(props) {
		super(props);
		console.log("Device id", deviceId);

		this.state = {
			login: false,
			loginSuccess: true,
			loginFailedError: '',
		};
	}

	componentDidMount() {
		const formBody = NetworkModule.formBody({
			'deviceName': Platform.OS,
			'deviceId': deviceId,
		})
		let params = {
			method : 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formBody
		}

		fetch(NetworkModule.SIGNUP_WITH_DEVICE_ID_URL, params)
		.then((response) => {
			console.log(response);
			if (response.status === 200 || response.status === 204) {
				return response.json();
			} else {
				throw new Error('request failed: ' + response.status);
			}
		})
		.then((responseJson) => {
			console.log(responseJson);
			this.setState({
				login: true,
				loginSuccess: true,
			});

			const { setUserInfo } = this.props.actions;
			setUserInfo(responseJson)
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e);
		})
	}

	jumpToUserInfo() {
		this.props.navigator.push({
			name: ComponentConstants.USER_INFO_ROUTE,
		});
	}

	jumpToMoment() {
		this.props.navigator.push({
			name: ComponentConstants.MOMENT_ROUTE,
		});
	}

	render() {
		if (this.state.login) {
			if (this.state.loginSuccess) {
				return this.renderLoginSuccess()
			} else {
				return this.renderLoginFailed()
			}
		} else {
			return this.renderPendingLogin()
		}
	}

	renderPendingLogin() {
		return (
			<View style={styles.container}>
				<Text>Login, please wait. </Text>
			</View>
		);
	}

	renderLoginFailed() {
		return (
			<View style={styles.container}>
				<Text>{'Login failed: ' + this.state.loginFailedError } </Text>
			</View>
		)
	}

	renderLoginSuccess() {
		const { userInfo } = this.props;
		return (
			<View style={styles.container}>
				<Text>{'Hello, ' + userInfo.userName}</Text>
				<TouchableOpacity onPress={() => this.jumpToUserInfo()} style={styles.button}>
					<Text>Change your name</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.jumpToMoment()} style={styles.button}>
					<Text>Enter your moment</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 100,
		alignItems: 'center',
		backgroundColor: 'white',
	},

	button: {
		width: width - 20,
		height: 30,
		margin: 10,
		backgroundColor: 'lightgray',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
