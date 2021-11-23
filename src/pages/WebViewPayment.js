import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';



export default class WebViewPayment extends Component {


  constructor() {
    super();
    this.state = {
      htmlData: "<html></html>"
    };
  }


  componentWillMount() {
    fetch(GLOABAL_API + 'payments/initiate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN

      },
      body: JSON.stringify({
        deposits: this.props.amountProps
      })
    })
      .then(response => response.text())
      .then((responseJson) => {

        console.log(responseJson);
        this.setState({
          htmlData: responseJson
        });

      })
      .catch((error) => {
        console.error(error);
      });



  }


  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..WebView");
    this.refreshBackPages();
    Actions.pop();
  }



  refreshBackPages() {
    EventBus.getInstance().fireEvent("refreshWallet", {
    })
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.app

        }}>

        <MyToolbar
          title={"Add Money"}
          onBack={this.onBack}
        />
        <WebView
          ref={ref => { this.webView = ref; }}
          onError={() => { this.webView.reload(); }}
          originWhitelist={["*"]}
          source={{ html: this.state.htmlData }}
          renderLoading={this.renderLoading}
          startInLoadingState={true}
          javaScriptEnabled={true}
          onMessage={event => {
            this.onBack();
          }}
          thirdPartyCookiesEnabled={true}
          scrollEnabled={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode={'always'}
          cacheEnabled={false}
        />
      </View>
    );
  }
}
