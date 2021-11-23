import React, { Component } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import EditText from '../components/EditText';
import Loader from '../components/Loader';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import { isValidatePassword, show } from '../utils/Globals';
import EventBus from 'react-native-event-bus';
import {  isValidateMobile } from '../utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EnterMobile extends Component {

  keyEvent = "entermobile";
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validation: ""

    };



  }


  

  componentDidMount() {
  
    EventBus.getInstance().addListener(this.keyEvent,
    this.listener = player => {

      console.log("event....");
      this.setState({ loading: true });

      var bodyData = JSON.stringify({
        mobile:this.state.mobile
      });
      console.log("update mobile " + bodyData);
      console.log("GLOBAL_TOKEN "+GLOBAL_TOKEN);
      var api = GLOABAL_API + 'users/update_mobile';
      fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: GLOBAL_TOKEN
        },
        body:bodyData
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log({ "response": JSON.stringify(responseJson) });
          this.setState({ loading: false });
          if (responseJson.status === 1) {
            show("Mobile number updated.");
            EventBus.getInstance().fireEvent("mobileUpdated")
            Actions.pop();
          } 
        })
        .catch((error) => {
          console.error(error);
        });
    })

   
  }


  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    this.setState({ [key]: value });
  }

  onMobileUpdate(){
    if (!isValidateMobile(this.state.mobile)) {
      show("Incorrect Mobile Number.");
      return;
    }

    Actions.Verification({
      keyname:this.keyEvent,
      mobile: this.state.mobile
    });
  }


  onBack() {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..ResetPas");
    Actions.pop();
  }



  render() {
    return (

      <View
        style={{
          flex: 1, backgroundColor: COLORS.app
        }}>


        <MyToolbar
          title="Update Mobile Number"
          onBack={this.onBack}
        />

        <ScrollView
          shouldCancelWhenOutside={false}
          style={{ backgroundColor: COLORS.app }}>
          <KeyboardAvoidingView
            behavior="padding"

          >

            <View style={styles.container}>

              <View
                style={{
                  borderRadius: 2,
                  flex: 1,
                  width: "80%",
                  alignSelf: "center",
                  alignItems: "stretch"
                }}
              >

                 <EditText
                    val={this.state.mobile}
                    placeho="Mobile Number"
                    mkey="mobile"
                    validationEr={this.state.validationKeyError}
                    onChangeFun={this.onChangeFun}
                    jumpTo={this.referCode}
                    inputRef={(input) => {
                      this.mobile = input
                    }} />



                <CustomText style={styles.errorText}>{this.state.validation}</CustomText>

              </View>

              <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>
                <TouchableOpacity style={stylesCurrent.submit} onPress={this.onMobileUpdate.bind(this)}>
                  <CustomText style={styles.buttonText}>
                    Update Mobile

                  </CustomText>
                </TouchableOpacity>
              </View>


            </View>


          </KeyboardAvoidingView>
        </ScrollView>
        {this.state.loading ?

          <Loader /> : null}




      </View>
    )
  }
}
const stylesCurrent = StyleSheet.create({

  submit: {
    flex: 1,
    alignSelf: 'baseline',
    paddingVertical: 10,
 
    backgroundColor: COLORS.button,
    borderRadius: 6,
    marginHorizontal: 32,
    marginBottom: 32,
    fontSize: 20,
    color: '#ffffff'

  }
});
