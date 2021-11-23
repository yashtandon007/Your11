import React, { Component } from 'react';
import { TextInput as TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import Loader from '../components/Loader';
import MyToolbar from '../components/MyToolbar';
import { show } from '../utils/Globals';
import EventBus from 'react-native-event-bus';


export default class Verification extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      timeLeft: 30,
      mobile: this.props.mobile,
      fieldValue: "",
      loading: false,
      validation: "",
      response: {}
    };

  }

  componentDidMount() {
    this.onResend();
  }

  callApi() {
    console.log("verification >> GLOABAL_API + 'users/otp' > " +GLOABAL_API + 'users/otp');
    fetch(GLOABAL_API + 'users/otp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        mobile: this.props.mobile
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("respo > " + JSON.stringify(responseJson));
        console.log("response status " + responseJson.status);
        console.log("response otp " + responseJson.data.otp);

        this.setState({ loading: false, response: responseJson });
      })
      .catch((error) => {
        console.log("error "+error);
        this.setState({ loading: false, response: null });

      });

  }
  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..Verifica");
    Actions.pop();
  }

  onValiudateOtp = (value) => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("Vaalidate...otp " + value);
    console.log("Vaalidate...otp>>  " + this.state.response.data.otp);

    if (this.state.response.data.otp == value) {

    
        EventBus.getInstance().fireEvent(this.props.keyname);
        Actions.pop();

    }else{
      show("Invalid Otp...")
    }


  }


  onResend = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onResend..");
    this.callApi();
    this.myinerverl = setInterval(() => {
      const { timeLeft } = this.state;

      var timeLeftLocal = timeLeft - 1;
      if (timeLeftLocal <= 0) {
        this.setState({
          timeLeft: 30,
          disabled: false
        })

        clearInterval(this.myinerverl);
      } else {

        this.setState({
          timeLeft: timeLeftLocal,
          disabled: true
        })

      }

    }, 1000);
  }

  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onChageFun ");
    if (value.length === 6) {

      this.onValiudateOtp(value);
    }

  }

  render() {
    return (
      <View style={{
        flex: 1, backgroundColor: COLORS.app
      }}>
        <MyToolbar
          title="Verify Otp"
          onBack={this.onBack}
        />
        <View style={{ marginStart: 28, marginEnd: 28 }}>
          <View>
            <CustomText style={{ color: COLORS.white, fontSize: 16 }}>Enter Verification Code</CustomText>
          </View>
          <View>
            <CustomText style={{ marginTop: 8, color: COLORS.e6grey, fontSize: 13 }}>Enter the 6-digit verification code sent to {this.state.mobile}</CustomText>
          </View>
          <View style={{
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "baseline",
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                width: 140,
                marginTop: 32,
                backgroundColor: Colors.grey200,
                borderRadius: 6,
                fontSize: 20,
                paddingStart: 30

              }}>
              <TextInput style={{
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flex: 1

              }
              }

                autoFocus={true}
                letterSpacing={6}
                maxLength={6}
                placeholderTextColor={COLORS.black}
                selectionColor={COLORS.black}
                placeholder="------"
                keyboardType="number-pad"
                onChangeText={name => this.onChangeFun("fieldValue", name)}
              />

            </View>
          </View>


          <TouchableOpacity
            disabled={this.state.disabled}
            style={{
              paddingVertical: 10,
              alignItems: "center",
              marginTop: 32,
              borderRadius: 6,
              fontSize: 20,
              color:"#fff",
              backgroundColor:COLORS.accent
            }}
            onPress={() => this.onResend()}
          >
            {this.state.disabled ?

              <CustomText style={{ color: COLORS.white }}>
                Resend in {this.state.timeLeft} sec</CustomText>
              :
              <CustomText style={{ color: COLORS.white }}>
                Resend</CustomText>
            }

          </TouchableOpacity>
        </View>

        {this.state.loading ?

          <Loader /> : null}

      </View>
    )
  }
}
