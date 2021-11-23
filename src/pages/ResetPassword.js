import React, { Component } from 'react';
import {  Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import EditText from '../components/EditText';
import Loader from '../components/Loader';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import { isValidatePassword, show } from '../utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ResetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
       newpassword: '',
      repassword: '',
      loading: false,
      validation: ""

    };



  }

  componentDidMount() {
    AsyncStorage.getItem(USER_LOGGEDIN).then((value) => {

      console.log("username " + value);
      this.setState({
        username: value
      });

    })

  }


  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    this.setState({ [key]: value });
  }

  onPasswordChange() {



    if (
      isValidatePassword(this.state.newpassword) && isValidatePassword(this.state.repassword)
    ) {

    } else {
      this.setState({
        validation: "password must be minimum eight characters, at least one letter, one number and one special character:"
      });
      return;
    }


    if (this.state.newpassword === this.state.repassword) {
    } else {
      this.setState({
        validation: "password must be same"
      });
      return;
    }

    this.setState({ loading: true });



    let api = "";

    api = GLOABAL_API + 'users/changepassword';

    fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        newpwd: this.state.newpassword
      })

    })

      .then((response) => response.json())
      .then((responseJson) => {
        console.log({ "response": responseJson });
        if (responseJson.status === 1) {

          this.setState({ loading: false });
          Actions.pop();
          Actions.refresh({
            updated: true
          });
        } else {
          this.setState({ loading: false });
          show(responseJson.message)

        }
      })
      .catch((error) => {
        console.error(error);
      });


    Keyboard.dismiss();
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
          title="Update Password"
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

                <View>
                  

                  <EditText
                    placeho="New Pasword"
                    mkey="newpassword"
                    onChangeFun={this.onChangeFun}
                    isEditable={true}
                    jumpTo={this.repassword}
                    inputRef={(input) => {
                      this.newpassword = input
                    }} />
                  <EditText
                    placeho="Repeat Pasword"
                    mkey="repassword"
                    onChangeFun={this.onChangeFun}
                    isEditable={true}
                    inputRef={(input) => {
                      this.repassword = input
                    }} />
                </View>

                <CustomText style={styles.errorText}>{this.state.validation}</CustomText>

              </View>

              <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>
                <TouchableOpacity style={stylesCurrent.submit} onPress={this.onPasswordChange.bind(this)}>
                  <CustomText style={styles.buttonText}>
                    Update Password

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
    marginStart: 16,
    marginEnd: 16,
    backgroundColor: COLORS.button,
    borderRadius: 6,
    paddingHorizontal: 16,
    marginBottom: 32,
    fontSize: 20,
    color: '#ffffff'

  }
});
