import React, { Component } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';


export default class WebViewGlobal extends Component {

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..WebView");
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
          title={this.props.title}
          onBack={this.onBack}
        />
        <WebView
          source={{ uri: this.props.url }}
          style={{ backgroundColor: Colors.app }}
          renderLoading={this.renderLoading}
          startInLoadingState
        />
      </View>
    );
  }
}
