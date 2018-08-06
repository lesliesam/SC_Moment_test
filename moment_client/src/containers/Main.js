'use strict';

import React, {Component} from 'react';
import {
	View,
	Navigator,
	StyleSheet,
	Dimensions,
	StatusBar,
} from 'react-native';
import {bindActionCreators} from 'redux';
import buildStyleInterpolator from 'buildStyleInterpolator';
import RootPage from '../views/rootPage';
import actions from '../actions';
import { connect } from 'react-redux';

class MomentApp extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" backgroundColor='#1962dd'/>
				<RootPage {...this.props}/>
			</View>
		)
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
		alignItems: 'stretch',
	},
});

function mapStateToProps(state) {
	return {
		userInfo: state.userInfo,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MomentApp)
