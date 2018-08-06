import React, {Component} from 'react';
import {StyleSheet,
	View,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	Image,
	Dimensions}
	from 'react-native';
import * as ComponentConstants from './ComponentConstants';
import * as NetworkModule from '../modules/networkModule'

import ViewPager from '../viewComponents/viewpager/ViewPager';
var {height, width} = Dimensions.get('window');

export default class ImageView extends Component {
	constructor(props) {
		super(props);

		var dataSource = new ViewPager.DataSource({
			pageHasChanged: (p1, p2) => p1 !== p2,
		});

		this.state={
			dataSource: dataSource.cloneWithPages(this.props.images),
		};
	}

	_onClick() {
		this.props.navigator.pop()
	}

	render() {
		return (
			<ViewPager
				style={this.props.style}
				dataSource={this.state.dataSource}
				renderPage={(data, pageID) => this._renderPage(data, pageID)}
				isLoop={false}
				autoPlay={false}/>
		);
	}

	_renderPage(data: Object,pageID: number | string,) {
		return (
			<TouchableWithoutFeedback onPress={() => this._onClick()}>
				<Image
					source={{uri: data}}
					style={styles.page} resizeMode={'contain'}/>
			</TouchableWithoutFeedback>
		);
	}
}


const styles = StyleSheet.create({
	page: {
		width: width,
	},
});
