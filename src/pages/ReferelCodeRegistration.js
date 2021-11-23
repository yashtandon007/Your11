import React, { Component } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import EditText from '../components/EditText';
import EditTextName from '../components/EditTextName';

import Loader from '../components/Loader';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import { isValidatePassword, show } from '../utils/Globals';
import EventBus from 'react-native-event-bus';
import {  isValidateMobile } from '../utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ReferelCodeRegistration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validation: "",
      referCode:"",
      name:""
    };



  }


  

  componentDidMount() {

    this.setState({
      name:this.props.obj.name
    })
  }

  callRegistrationApi(){
    
    this.setState({ loading: true });
    var myname = this.state.name;
    if(myname.length<4 ){
      show("Name can't be less than 4 character")
      return ;
    }
    var bodyTxt = this.props.obj;
    bodyTxt.referral = this.state.referCode;
    bodyTxt.name = myname;
   
    console.log("registartion body : "+JSON.stringify(bodyTxt));

    var api = GLOABAL_API + 'users/registration';
      fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(bodyTxt)
        }).then((response) => response.json())
      .then((responseJson) => {
        console.log({ "response": responseJson });
        this.setState({ loading: false });
        if (responseJson.status === 1) {

          console.log(" responseJson.data.token >> " + responseJson.data.token);
          AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
            GLOBAL_userObj = responseJson.data;
            GLOBAL_TOKEN = GLOBAL_userObj.token;
            Actions.pop();
            Actions.nav();

          });
        } else {
          console.log(" responseJson.message >> " + responseJson.message);
          
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }



  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    this.setState({ [key]: value });
  }

  


  onBack() {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..ResetPas");
    Actions.pop();
  }



  onChangeFunName = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    //value = value.replace(/[^A-Za-z]/ig, '')
    
    if (/^[a-zA-Z ]+$/.test(value) ){
      this.setState({ [key]: value });
    }
    
  
  }

  render() {
    return (

      <View
        style={{
          flex: 1, backgroundColor: COLORS.app
        }}>


        <MyToolbar
          title="Proceed To Registeration"
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

     <EditTextName
                val={this.state.name}
                validationEr={this.state.validationKeyError}
                placeho="Name"
                mkey="name"
                onChangeFunName={this.onChangeFunName}
                jumpTo={this.password}
                inputRef={(input) => {
                  this.name = input
                }} />

                  <EditText
                    placeho="Refer Code (Optional)"
                    mkey="referCode"
                    validationEr={this.state.validationKeyError}
                    onChangeFun={this.onChangeFun}

                    inputRef={(input) => {
                      this.referCode = input
                    }} />



                <CustomText style={styles.errorText}>{this.state.validation}</CustomText>

              </View>

              <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>
                <TouchableOpacity style={stylesCurrent.submit} onPress={this.callRegistrationApi.bind(this)}>
                  <CustomText style={styles.buttonText}>
                    Proceed
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
