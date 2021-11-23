import React, { Component } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';


export default class WalletDetails extends Component {

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..Privacy");
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
          title="Wallet Details"
          onBack={this.onBack}
        />
        <WebView
          style={{ backgroundColor: Colors.app }}
          source={{ uri: 'https://your11fantasy.com/wallet' }}
          renderLoading={this.renderLoading}
          startInLoadingState
        />
      </View>
    );
  }
}
