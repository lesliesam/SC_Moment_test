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

import * as ImagePicker from 'react-native-image-picker';
var {height, width} = Dimensions.get('window');

export default class PostMoment extends Component {
	constructor(props) {
		super(props);

		const { userInfo } = this.props;
		this.state={
			content: userInfo.userName,
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

	_addImage() {
		let options = {
			title: null, // specify null or empty string to remove the title
			cancelButtonTitle: 'Cancel',
			takePhotoButtonTitle: 'Take a photo', // specify null or empty string to remove this button
			chooseFromLibraryButtonTitle: 'Pick from library', // specify null or empty string to remove this button

			cameraType: 'back', // 'front' or 'back'
			mediaType: 'photo', // 'photo' or 'video'
			maxWidth: 350, // photos only
			maxHeight: 350, // photos only
			aspectX: 3, // android only - aspectX:aspectY, the cropping image's ratio of width to height
			aspectY: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
			quality: 0.5, // 0 to 1, photos only
			angle: 0, // android only, photos only
			allowsEditing: true, // Built in functionality to resize/reposition the image after selection
			noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
			storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
				skipBackup: true, // ios only - image will NOT be backed up to icloud
				path: 'images' // ios only - will save image at /Documents/images rather than the root
			},
		};

		ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else {
				// You can display the image using either data:
				// const source = {uri: 'data:image/jpeg;base64,' + response.data};
				// response.source = source;
				this.uploadPhoto(response);
				// this.setState({
				// 		regPhotoSource: source,
				// 		regPhotoBase64: response.data,
				// });
			}
		});
	}

	render() {

		return (
			<View style={styles.container}>
				<Text>Please write the content: </Text>
				<TextInput
					style={styles.nameInput}
					onChangeText={(text) => this.setState({content: text})}
					autoFocus={true}
					selectTextOnFocus={true}
					placeholder={'Please fill in your name.'}
					underlineColorAndroid='transparent'
				/>
				<TouchableOpacity onPress={() => this._addImage()} style={styles.button}>
					<Text>Add image</Text>
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
