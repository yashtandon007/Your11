import React, { Component } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';


export default class AboutUs extends Component {

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("AboutUs onBack");
    Actions.pop();
  }


  render() {
    return (
      <View
        style={{
          backgroundColor: Colors.app,
          flex: 1

        }}>

        <MyToolbar
          title="AboutUs"
          onBack={this.onBack}
        />
        <WebView
          source={{ uri: 'https://theonlinearena.com/About.aspx' }}
          renderLoading={this.renderLoading}
          startInLoadingState
        />
      </View>
    );
  }
}
