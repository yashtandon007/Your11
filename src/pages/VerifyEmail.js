import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import EditText from '../components/EditText';
import Loader from '../components/Loader';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import { isValidateEmail, show } from '../utils/Globals';

export default class VerifyEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validation: "",
      email:""
    };



  }


  

  componentDidMount() {

  }

  updateEmail(){

    if (!isValidateEmail(this.state.email)) {
      show("Email Address is incorrect");
      return;
    }


    this.setState({ loading: true });
    var bodyTxt = {
        email:this.state.email
    };
    console.log("registartion body : "+JSON.stringify(bodyTxt));

    var api = GLOABAL_API + 'users/update_email';
      fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body:JSON.stringify(bodyTxt)
        }).then((response) => response.json())
      .then((responseJson) => {
        console.log({ "response": responseJson });
        this.setState({ loading: false });
        if (responseJson.status === 1) {

          show("Email updated. Verification email sent to this mail...");
          EventBus.getInstance().fireEvent("mobileUpdated")
          Actions.pop();
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



  render() {
    return (

      <View
        style={{
          flex: 1, backgroundColor: COLORS.app
        }}>


        <MyToolbar
          title="Update Email"
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
                      placeho="Email"
                      mkey="email"
                      onChangeFun={this.onChangeFun}
                      jumpTo={this.passTextInput}
                      inputRef={(input) => {
                        this.email = input
                      }}
                    />



                <CustomText style={styles.errorText}>{this.state.validation}</CustomText>

              </View>

              <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>
                <TouchableOpacity style={stylesCurrent.submit} onPress={this.updateEmail.bind(this)}>
                  <CustomText style={styles.buttonText}>
                    Update
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
