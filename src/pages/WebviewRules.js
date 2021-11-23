import React, { Component } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';


export default class WebviewRules extends Component {

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
          title="Rules"
          onBack={this.onBack}
        />

        <View style={{ flex: 1, backgroundColor: COLORS.app }}>
          <WebView
            style={{ backgroundColor: Colors.app }}
            originWhitelist={['*']}
            startInLoadingState
            source={{ html: this.props.rules }}
          />
        </View>
      </View>
    );
  }
}
