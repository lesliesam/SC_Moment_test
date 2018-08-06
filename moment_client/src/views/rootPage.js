'use strict';

import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	BackHandler,
	Dimensions,
	StatusBar,
	Text,
	TouchableOpacity,
} from 'react-native';
import Homepage from './homepage';
import UserInfoPage from './userInfo';
import MomentPage from './moment'
import ImageView from './imageView'
import PostMomentView from './postMoment'
import * as ComponentConstants from './ComponentConstants';
import {
	Navigator
} from 'react-native-deprecated-custom-components';

var _navigator;


var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
		alignItems: 'stretch',
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default class MainPage extends Component {
	constructor(props) {
		super(props);
	}

	backAndroidHandler(){
		if (_navigator && _navigator.getCurrentRoutes().length > 1) {
			_navigator.pop();
			return true;
		}

		return false;
	}

	componentWillMount(){
		BackHandler.addEventListener('hardwareBackPress', this.backAndroidHandler);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.backAndroidHandler);
	}

	RouteMapper(route, navigator) {
		_navigator = navigator
		if (route.name === ComponentConstants.HOME_PAGE_ROUTE) {
			return (
				<Homepage {...this.props} {...route.params} navigator={navigator}/>
			)
		} else if (route.name === ComponentConstants.USER_INFO_ROUTE) {
			return (
				<UserInfoPage {...this.props} {...route.params} navigator={navigator}/>
			)
		} else if (route.name === ComponentConstants.MOMENT_ROUTE) {
			return (
				<MomentPage {...this.props} {...route.params} navigator={navigator}/>
			)
		} else if (route.name === ComponentConstants.IMAGE_VIEW_ROUTE) {
			return (
				<ImageView {...this.props} {...route.params} navigator={navigator}/>
			)
		} else if (route.name === ComponentConstants.POST_MOMENT_ROUTE) {
			return (
				<PostMomentView {...this.props} {...route.params} navigator={navigator}/>
			)
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" backgroundColor='#1962dd'/>
				<View style={{ flex: 1, backgroundColor: 'red' }}>
					<Navigator key='nav1'
						style={styles.container}
						initialRoute={{ name: ComponentConstants.HOME_PAGE_ROUTE }}
						configureScene={() => Navigator.SceneConfigs.PushFromRight}
						renderScene={(route, navigator) => this.RouteMapper(route, navigator)} />
				</View>
			</View>
		)
	}
}
