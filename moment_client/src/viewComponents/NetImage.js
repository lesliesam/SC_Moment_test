import React, { Component } from 'react';
import {
	View,
	ImageBackground,
	Platform
} from 'react-native';

import CacheableImage from './CacheableImage';
/*使用注意将defaultSource写在source后面
	如：
	<NetImage source={...} defaultSource={...')}/>
 */
export default class NetImage extends Component {
	static propTypes = {
		...ImageBackground.propTypes
	}

	static defaultProps = {
		...ImageBackground.defaultProps
	}
	constructor(props) {
		super(props);
	}

	render() {
		if(Platform.OS === 'ios'){
			return (
				<ImageBackground
					style={this.props.style}
					source={this.props.source}
					defaultSource={this.props.defaultSource}
					imageStyle={this.props.imageStyle}
					{...this.props}>
					{this.props.children}
				</ImageBackground>
			);
		}else{
			return (
				<CacheableImage
					{...this.props}>
					{this.props.children}
				</CacheableImage>
			);
		}

	}
}
