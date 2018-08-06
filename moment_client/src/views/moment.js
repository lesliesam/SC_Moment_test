import React, {Component} from 'react';
import {StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
	TouchableWithoutFeedback,
	Dimensions}
	from 'react-native';
import * as ComponentConstants from './ComponentConstants';
import * as NetworkModule from '../modules/networkModule'
import NetImage from '../viewComponents/NetImage';

var {height, width} = Dimensions.get('window');

class Row extends Component{
	_onClick() {
		this.props.navigator.push({
			name: ComponentConstants.IMAGE_VIEW_ROUTE,
			params: {images: this.props.data.images.split(',')}
		});
	}

	renderPosterImage() {
		return(
			<NetImage
				style={{width : 40 , height : 40, marginHorizontal : 15}}
				source={require('../../images/image-blank-icon-profile.png')}
				resizeMode={'contain'}/>
		)
	}

	renderPosterName() {
		return (
			<Text>
				{this.props.data.poster.userName}
			</Text>
		)
	}

	renderImages() {
		let images = this.props.data.images.split(',')
		let imageViews = images.map((image, index) => {
			return <NetImage
				key = {index}
				style={{width : 80 , height : 80, marginRight : 10}}
				source={{uri:image}}
				resizeMode={'contain'}/>
		})
		return (
			<View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1, paddingRight: 30}}>
				{imageViews}
			</View>
		)
	}

	renderArticle() {
		const { userInfo } = this.props;
		return (
			<View style={styles.row}>
				{this.renderPosterName()}
				<Text style={styles.text}>
					{this.props.data.text}
				</Text>
				{this.renderImages()}
			</View>
		)
	}
	render() {
		return (
			<TouchableWithoutFeedback onPress={() => this._onClick()} >
				<View style={{flexDirection:'row'}}>
					{this.renderPosterImage()}
					{this.renderArticle()}
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export default class CounterInner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isRefreshing: false,
			loaded: 0,
			rowData: [],
		};
	}

	componentDidMount() {
		this._onRefresh()
	}

	_postNew() {
		this.props.navigator.push({
			name: ComponentConstants.POST_MOMENT_ROUTE
		});
	}

	render() {
		const rows = this.state.rowData.map((row, ii) => {
			return <Row key={ii} data={row} navigator={this.props.navigator}/>;
		});
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => this._postNew()} style={styles.button}>
					<Text>Post Moment</Text>
				</TouchableOpacity>

				<ScrollView
					style={styles.scrollview}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={() => this._onRefresh()}
							tintColor="#ff0000"
							title="Loading..."
							titleColor="#00ff00"
							colors={['#ff0000', '#00ff00', '#0000ff']}
							progressBackgroundColor="#ffff00"
						/>
					}>
						{rows}
				</ScrollView>
			</View>
		)

	}

	_onRefresh() {
		this.setState({isRefreshing: true});

		const { userInfo } = this.props;
		let params = {
			method : 'GET',
			headers: {
				'session': userInfo.session,
			},
		}

		fetch(NetworkModule.GET_MOMENT_URL, params)
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
				rowData: responseJson,
				isRefreshing: false,
			});
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e);
			this.setState({
				isRefreshing: false,
			});
		})
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 30,
		alignItems: 'center',
		backgroundColor: 'white',
	},
	row: {
		borderColor: 'grey',
		margin: 5,
	},
	text: {
		alignSelf: 'center',
		color: 'black',
	},
	scrollview: {
		paddingTop: 40,
		width: width,
		flex: 1,
	},
	button: {
		width: 100,
		height: 30,
		margin: 10,
		backgroundColor: 'lightgray',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
