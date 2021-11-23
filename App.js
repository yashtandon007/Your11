import React, { Component } from 'react';
import {
  StyleSheet,
  View, StatusBar, Platform

} from 'react-native';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import "./src/utils/Globals.js";
import Routes from './src/Routes';
import COLORS from './src/components/colors';

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);



export default class App extends Component {



  render() {
    return (
      <View style={styles.container}>


        <View style={{ flex: 1 }}>
          <MyStatusBar barStyle="light-content" backgroundColor={COLORS.dream11redDark} />

          <Routes />
        </View>
      </View>
    );
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 35 : StatusBar.currentHeight;


const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.app,
    flex: 1,
    alignContent: 'center',
  },

  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
 
});


