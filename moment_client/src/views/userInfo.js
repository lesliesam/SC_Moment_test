import React, {Component} from 'react';
import {StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Dimensions}
	from 'react-native';
import * as ComponentConstants from './ComponentConstants';
import * as NetworkModule from '../modules/networkModule'

var {height, width} = Dimensions.get('window');

export default class UserInfo extends Component {
	constructor(props) {
		super(props);

		const { userInfo } = this.props;
		this.state={
			userName: userInfo.userName,
		};
	}

	updateUserName() {
		const { userInfo } = this.props;
		const formBody = NetworkModule.formBody({
			'userName': this.state.userName,
		})
		let params = {
			method : 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'session': userInfo.session,
			},
			body: formBody
		}

		fetch(NetworkModule.UPDATE_USER_NAME_URL, params)
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

			const { setUserName } = this.props.actions;
			setUserName(responseJson.userName)
			this.props.navigator.pup()
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e);
		})


		this.props.navigator.push({
			name: ComponentConstants.HOME_PAGE_ROUTE,
		});
	}

	render() {

		return (
			<View style={styles.container}>
				<Text>Please change your name: </Text>
				<TextInput
					style={styles.nameInput}
					onChangeText={(text) => this.setState({userName: text})}
					autoFocus={true}
					selectTextOnFocus={true}
					placeholder={'Please fill in your name.'}
					underlineColorAndroid='transparent'
					value={this.state.userName}
				/>
				<TouchableOpacity onPress={() => this.updateUserName()} style={styles.button}>
					<Text>Update</Text>
				</TouchableOpacity>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 100,
		alignItems: 'center',
		backgroundColor: 'white',
	},
	nameInput: {
		textAlign : 'left',
		height: 80,
		color: 'black',
		paddingVertical: 0,
		paddingLeft:0,
	},
	button: {
		width: width - 20,
		height: 30,
		margin: 10,
		backgroundColor: 'lightgray',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
