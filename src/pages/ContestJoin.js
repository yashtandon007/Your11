import React, { Component } from 'react';
import { View, StyleSheet ,TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';
import EditTextName from '../components/EditTextName';
import CustomText from '../components/CustomText';
import styles from '../components/styles';
import Loader from '../components/Loader'
import { show } from '../utils/Globals';

export default class ContestJoin extends Component {


  constructor() {
    super();
    this.state = {
      inviteCode: "",
      response:null
    };

  }


  componentDidMount(){
    this.setState({
      inviteCode:this.props.contestcode
    })
  }
  onChangeFunName = (key, value) => {
    if (/^[a-zA-Z0-9]+$/.test(value)) {
      this.setState({ [key]: value });
    }
    if (value == "") {
      this.setState({ [key]: value });
    }
  }


  onBack = () => {

    Actions.pop();
  }

  loadDashboard() {


    this.setState({ loading: true });

    var bodyTxt = JSON.stringify({
      contest_code:this.state.inviteCode
    })
    console.log("Body " + bodyTxt);
    fetch(GLOABAL_API + 'privatecontests/getbycode', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: bodyTxt

    })
      .then((response) => response.json())
      .then((responseJson) => {


        console.log("response getbycode" + JSON.stringify(responseJson));
        if(responseJson.status ==0){
          show(responseJson.message);
        }  
        this.setState({
          loading: false, response: responseJson.data
        });
        if(responseJson.status ===1){
            Actions.ContestCreateSelectTeams({
              ...responseJson.data,
              fromJoinContest:true
            });
        }

      }).catch(error => {
        // handle the error
        this.setState({
          loading: false
        });
      });

  }





  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.app

        }}>

        <MyToolbar
          title={"Contest Code"}
          onBack={this.onBack}
        />


      <View style={{margin:16}}> 
             
       <EditTextName
            val={this.state.inviteCode}
            validationEr={this.state.validationKeyError}
            placeho="Contest Join Code"
            mkey="inviteCode"
            onChangeFunName={this.onChangeFunName}
            inputRef={(input) => {
              this.inviteCode = input
            }} />
  <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>

<TouchableOpacity style={stylesCurrent.submit} onPress={
  () => {
      this.loadDashboard();
  }
}>
  <CustomText style={styles.buttonText}>

    JOIN THE CONTEST


</CustomText>
</TouchableOpacity>
</View>
      </View>


      {this.state.loading ? <Loader /> : null}

      </View>
    );
  }
}

const stylesCurrent = StyleSheet.create({

  submit: {
    flex: 1,
    alignSelf: 'baseline',
    paddingVertical: 10,

    borderRadius: 6,
    paddingHorizontal: 16,
    marginTop: 6,
    fontSize: 20,
    backgroundColor: COLORS.button
  },
  picker: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingStart: 6,
    margin: 3,

    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: "#000000",
    marginTop: 8,
  }
});

