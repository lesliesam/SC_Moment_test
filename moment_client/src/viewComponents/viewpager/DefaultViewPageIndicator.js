'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
	Image
} from 'react-native';
var createReactClass = require('create-react-class');

var deviceWidth = Dimensions.get('window').width;
var DOT_SIZE = 12 ;
var CUT_DOT_SIZE = 12 ;
var DOT_SAPCE = 14 ;

var styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
  },

  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    // borderRadius: DOT_SIZE / 2,
    // backgroundColor: '#eef8fd',
    marginLeft: DOT_SAPCE,
    marginRight: DOT_SAPCE,
  },

  curDot: {
    position: 'absolute',
    width: CUT_DOT_SIZE,
    height: CUT_DOT_SIZE,
    // borderRadius: CUT_DOT_SIZE / 2,
    // backgroundColor: '#f05522',
		marginLeft: DOT_SAPCE,
		marginRight: DOT_SAPCE,
    bottom: 0,
  },
});

var DefaultViewPageIndicator = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activePage: PropTypes.number,
    pageCount: PropTypes.number
  },

  getInitialState() {
    return {
      viewWidth: 0,
    };
  },

  renderIndicator(page) {
    //var isTabActive = this.props.activePage === page;
    return (
      <TouchableOpacity style={styles.tab} key={'idc_' + page} onPress={() => this.props.goToPage(page)} activeOpacity={1}>
				<Image style={styles.dot} source={require('../../../images/black_oval.png')}></Image>
      </TouchableOpacity>
    );
  },

  render() {
    var pageCount = this.props.pageCount;
    var itemWidth = DOT_SIZE + (DOT_SAPCE * 2);
    var offset = (this.state.viewWidth - itemWidth * pageCount) / 2 + itemWidth * this.props.activePage;

    //var left = offset;
    var offsetX = itemWidth * (this.props.activePage - this.props.scrollOffset);
    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offsetX, offsetX + itemWidth]
    })

    var indicators = [];
    for (var i = 0; i < pageCount; i++) {
      indicators.push(this.renderIndicator(i))
    }

    return (
      <View style={styles.tabs}
        onLayout={(event) => {
            var viewWidth = event.nativeEvent.layout.width;
            if (!viewWidth || this.state.viewWidth === viewWidth) {
              return;
            }
            this.setState({
              viewWidth: viewWidth,
            });
          }}>
        {indicators}
        <Animated.Image style={[styles.curDot, {left}]} source={require('../../../images/green_oval.png')}/>
      </View>
    );
  },
});

module.exports = DefaultViewPageIndicator;
