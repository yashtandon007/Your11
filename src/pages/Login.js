import * as AppleAuthentication from 'expo-apple-authentication';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import React, { Component } from 'react';
import { Alert, BackHandler, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import CustomText from '../components/CustomText';
import EditText from '../components/EditText';
import Loader from '../components/Loader';
import styles from '../components/styles';
import { show } from '../utils/Globals';
import EventBus from 'react-native-event-bus';
import AsyncStorage from '@react-native-async-storage/async-storage';


keyEvent = "login";
const initState = {
  mobile: '',
  email: '',
  password: '',
  loading: false,
  validation: "",
  response: {},
  isFirstTabSelected: true
}

export default class Login extends Component {



  resetState() {
    this.setState(
      initState
    );
  }

  constructor(props) {
    super(props);

    this.state = initState;
    this.signup = this.signup.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
  }





  SignInApple() {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        style={{  height: 44 ,marginTop:16,marginHorizontal:16}}
        cornerRadius={5}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            // credential.user     
            this.setState({
              loading: true
            });
            var url = GLOABAL_API + 'users/loginfacebookgoogle';
            var bodyTxt = {
              name:credential.fullName.givenName,
              google_id: "",
              apple_id: credential.user,
              email: credential.email,
              facebook_id: "",
              image_url: ""
            };
            fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body: JSON.stringify(bodyTxt)
            })
              .then((response) => response.json())
              .then((responseJson) => {

                this.setState({ loading: false, response: responseJson });
                console.log({ "response": responseJson });
                if (responseJson.status === 0) {
                  console.log({ "response status ": responseJson.status });
                  Actions.ReferelCodeRegistration({
                    obj:bodyTxt
                  });
                  this.setState(this.initState);

                } else if (responseJson.status === 1) {
                  AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
                    GLOBAL_TOKEN = responseJson.data.token;
                    GLOBAL_userObj = responseJson.data;
                    console.log({ USER_LOGGEDIN: value });
                    Actions.nav();
                    Actions.pop();
                    this.setState(this.initState);

                  });
                }
              })
              .catch((error) => {
                this.setState({
                  loading: false
                });
                console.error(error);
              });

            Keyboard.dismiss();







            // signed in
          } catch (e) {
            if (e.code === 'ERR_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    );
  }

  forgotPassword() {
    console.log("forgotPassword clicked ... ");
    var myemail = this.state.email;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(myemail)) {
      this.setState({
        validation: "Email Address is incorrect"
      });
      return;
    }


    Alert.alert(
      'Forgot Password?',
      'Email will be send to ' + myemail + ' to reset your password!!!', [{
        text: 'Cancel',
        onPress: console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => {

          this.setState({
            loading: true
          });
          var url = GLOABAL_API + 'users/forgotpassword';
          fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email: myemail
            })
          })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log("responseJson .. " + JSON.stringify(responseJson));
              Keyboard.dismiss();
              this.setState({ loading: false });
              show(responseJson.message);
            })
            .catch((error) => {
              Keyboard.dismiss();
              this.setState({
                loading: false
              });
              console.error(error);
            });


        }
      },], {
      cancelable: false
    }
    )

  }

  componentDidMount() {

    EventBus.getInstance().addListener(this.keyEvent,
    this.listener = player => {
      AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(this.state.response.data)).then((value) => {
        GLOBAL_TOKEN = this.state.response.data.token;
        GLOBAL_userObj = this.state.response.data;
        console.log({ USER_LOGGEDIN: value });
        Actions.nav();
        Actions.pop();
        this.setState(this.initState);
  
      });
    });

    

    console.log("componentDidMount Login");
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount ...");
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    EventBus.getInstance().removeListener(this.listener);
  }

  handleBackButton() {
    console.log("onBack..Login");

    if (Actions.currentScene === "login") {

      this.setState({
        loading: false
      });
      this.onBackPressed();

    }

    //   return;

  }

  onBackPressed() {
    if (this.state.doubleBackToExitPressedOnce) {
      this.setState({
        doubleBackToExitPressedOnce: false
      });
      BackHandler.exitApp()
      return;
    }
    this.setState({
      doubleBackToExitPressedOnce: true
    }, () => {
      show("Please click BACK again to exit");

    });
    setTimeout(function () {
      console.log("setTimeout...");
      this.setState({
        doubleBackToExitPressedOnce: false
      });
    }.bind(this), 2000);


  }




 

  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    this.setState({ [key]: value });
  }

  signup() {
    this.setState(this.initState);

    Actions.signup({
      fromRegistration: true,
    }
    );
  }


  onFacebookLogIn = async () => {
    try {
      await Facebook.initializeAsync('5045944832098260');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile','email'],
      });
      if (type === 'success') {

        const response = await fetch(`https://graph.facebook.com/v2.9/me?access_token=${token}&fields=id,name,email,picture.type(large)`);
        const { id, email, picture, name } = await response.json();

        this.setState({
          loading: true
        });
        var url = GLOABAL_API + 'users/loginfacebookgoogle';
        var bodyTxt = {
          google_id: "",
          apple_id: "",
          email: email,
          name:name,
          facebook_id: id,
          image_url: picture.url
        };
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify(bodyTxt)
        })
          .then((response) => response.json())
          .then((responseJson) => {

            this.setState({ loading: false, response: responseJson });
            console.log({ "response": responseJson });
            if (responseJson.status === 0) {
              console.log({ "response status ": responseJson.status });
              Actions.ReferelCodeRegistration({
                obj:bodyTxt
              });
              this.setState(this.initState);

            } else if (responseJson.status === 1) {
              AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
                GLOBAL_TOKEN = responseJson.data.token;
                GLOBAL_userObj = responseJson.data;
                console.log({ USER_LOGGEDIN: value });
                Actions.nav();
                Actions.pop();
                this.setState(this.initState);

              });
            }
          })
          .catch((error) => {
            this.setState({
              loading: false
            });
            console.error(error);
          });

        Keyboard.dismiss();



      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
    }

  }






  onGoogleLogIn = async () => {

    this.setState({
      loading: true
    });


    console.log("init >>> ");
    const { type, user } = await Google.logInAsync({
      androidClientId: `243076910948-okluuqi5g4hc8jb26133emqgujj1k40r.apps.googleusercontent.com`,
      androidStandaloneAppClientId: `243076910948-okluuqi5g4hc8jb26133emqgujj1k40r.apps.googleusercontent.com`,
      iosStandaloneAppClientId: `243076910948-h3d04m7os41ua6g7bsq7ph02k61ee5ig.apps.googleusercontent.com`,
    });

    this.setState({
      loading: false
    });
    console.log("TYPE > " + type);
    if (type === 'success') {
      console.log("name " + user.name);
      console.log("email  " + user.email);
      console.log("photoUrl  " + user.photoUrl);

      this.setState({
        loading: true
      });
      var url = GLOABAL_API + 'users/loginfacebookgoogle';
      var bodyTxt = {
        name:user.name,
        google_id: user.id,
        email: user.email,
        facebook_id: "",
        apple_id: "",
        image_url: user.photoUrl
      };
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify(bodyTxt)
      })
        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({ loading: false, response: responseJson });
          console.log({ "response": responseJson });
          if (responseJson.status === 0) {
            console.log({ "response status ": responseJson.status });
            Actions.ReferelCodeRegistration({
              obj:bodyTxt
            });

          } else if (responseJson.status === 1) {
            AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
              GLOBAL_TOKEN = responseJson.data.token;
              GLOBAL_userObj = responseJson.data;
              console.log({ USER_LOGGEDIN: value });
              Actions.nav();
              Actions.pop();
              this.setState(this.initState);

            });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false
          });
          console.error(error);
        });

      Keyboard.dismiss();


      /* Log-Out */
      //  await Google.logOutAsync({ accessToken, ...config });
      /* `accessToken` is now invalid and cannot be used to get data from the Google API with HTTP requests */

    }
  }
  onLoginMobile() {

    const { mobile, loading, validation, response } = this.state;


    let validateMobile = /^\d{10}$/;
    if (!validateMobile.test(mobile)) {
      this.setState({
        validation: "Mobile  is empty"
      });
      return;
    } else {
      this.setState({
        validation: ""
      });
    }


    this.setState({
      loading: true
    });
    var url = GLOABAL_API + 'users/loginmobile';


    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'

      },
      body: JSON.stringify({
        mobile: this.state.mobile
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({ loading: false, response: responseJson });
        console.log({ "response login : ": JSON.stringify(responseJson) });
        if (responseJson.status === 0) {
          this.setState({
            validation: "No account found with this number!"
          });
        } else if (responseJson.status === 1) {
          this.setState({
            response: responseJson
          });
          Actions.Verification({
            keyname:this.keyEvent,
            mobile: this.state.mobile
          });


        }
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
        console.error(error);
      });

    Keyboard.dismiss();



  }
  onLoginEmail() {
    const { password, email, loading, validation, response } = this.state;

    if (email === "") {
      this.setState({
        validation: "Email Address  is empty"
      });
      return;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(email)) {
      this.setState({
        validation: "Email Address is incorrect"
      });
      return;
    }

    if (password === "") {
      this.setState({
        validation: "Password  is empty"
      });
      return;
    }


    if (email == "" || password == "") {

      this.setState({
        validation: "incorrect email or password"
      });
      return;
    } else {
      this.setState({
        validation: ""
      });
    }

    this.setState({
      loading: true
    });
    var url = GLOABAL_API + 'users/loginemail';
    console.log("URL > " + url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }, body: JSON.stringify({
        email: this.state.email,
        pwd: this.state.password
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({ loading: false, response: responseJson });
        console.log({ "response": responseJson });
        if (responseJson.status === 0) {
          this.setState({
            validation: "Email or password is incorrect"
          });

        } else if (responseJson.status === 1) {
          AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
            GLOBAL_TOKEN = responseJson.data.token;
            GLOBAL_userObj = responseJson.data;
            console.log({ USER_LOGGEDIN: value });
            Actions.nav();
            Actions.pop();

          });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
        console.error(error);
      });

    Keyboard.dismiss();

  }

  tabSelected(isTabOneSelected) {
    this.resetState();
    this.setState({
      isFirstTabSelected: isTabOneSelected
    });
  }

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.app }}
      >
        <ScrollView
          shouldCancelWhenOutside={false}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardAvoidingView
            behavior="padding"
          >
            <View
              style={{
                borderRadius: 2,
                flex: 1,
                paddingTop: 100,
                width: "80%",
                alignSelf: "center",
                alignItems: "stretch"
              }}
            >

              <View
                style={{
                  marginBottom: 16,
                  flexDirection: "row",
                  height: 30,
                }}>

                <View
                  style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={[this.state.isFirstTabSelected ? stylesCurrent.tabSelected : stylesCurrent.tab]}
                    onPress={this.tabSelected.bind(this, true)}>

                    <CustomText
                      style={[this.state.isFirstTabSelected ? stylesCurrent.tabTextSelected : stylesCurrent.tabText]}

                    >Mobile</CustomText>
                  </TouchableOpacity>
                  {this.state.isFirstTabSelected ? <View
                    style={{ width: 20, backgroundColor: Colors.button, height: 3 }}>

                  </View> :
                    null}
                </View>



                <View
                  style={{ marginStart: 16, alignItems: "center" }}>
                  <TouchableOpacity
                    style={[this.state.isFirstTabSelected ? stylesCurrent.tab : stylesCurrent.tabSelected]}
                    onPress={this.tabSelected.bind(this, false)}>

                    <CustomText
                      style={[this.state.isFirstTabSelected ? stylesCurrent.tabText : stylesCurrent.tabTextSelected]}

                    >Email</CustomText>

                  </TouchableOpacity>
                  {this.state.isFirstTabSelected ? null :
                    <View
                      style={{ width: 20, backgroundColor: Colors.button, height: 3 }}>

                    </View>}
                </View>


              </View>

              <View style={{
                borderRadius: 2,
                backgroundColor: Colors.white,
                paddingHorizontal: 16,
                paddingTop: 16, paddingBottom: 16,

              }}>
                {/* TABS */}

                {this.state.isFirstTabSelected ?


                  <EditText
                    placeho="Mobile"
                    mkey="mobile"
                    onChangeFun={this.onChangeFun}
                    jumpTo={this.passTextInput}
                    inputRef={(input) => {
                      this.mobile = input
                    }}
                  /> : <View

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
                    <EditText
                      placeho="Password"
                      isEditable={true}
                      onChangeFun={this.onChangeFun}
                      mkey="password"
                      inputRef={(input) => {
                        this.passTextInput = input
                      }}
                      jumpTo={null}
                    />

                  </View>}

                {/*EMAIL BOX  */}
                <CustomText style={styles.errorText}>{this.state.validation}</CustomText>

                <TouchableOpacity type="submit" style={stylesCurrent.submit}

                  onPress={
                    this.state.isFirstTabSelected ? this.onLoginMobile.bind(this)
                      : this.onLoginEmail.bind(this)
                  }>
                  <CustomText style={styles.buttonText}>Sign in </CustomText>
                </TouchableOpacity>



                {

                  this.state.isFirstTabSelected == true ? null : <TouchableOpacity
                    onPress={
                      this.forgotPassword.bind(this)
                    }>
                    <CustomText style={{ color: Colors.textDark, textAlign: 'center', margin: 12 }}>Forgot Password ? </CustomText>
                  </TouchableOpacity>

                }





              </View>



              <View style={styles.signupTextCont}>
                <CustomText style={styles.signupText}>Don't have an account yet?</CustomText>
                <TouchableOpacity onPress={this.signup}><CustomText style={{
                  color: Colors.accent,
                  fontSize: 16,

                  fontWeight: 'bold'
                }}> Signup</CustomText></TouchableOpacity>
              </View>

              <CustomText style={{
                color: Colors.textDark, flex: 1, justifyContent: "center", alignItems: "center",
                alignContent: "center", textAlign: "center", fontWeight: 'bold'
              }}>
                OR
                </CustomText>
              <View style={{ flex: 1}}>

                <TouchableOpacity style={stylesCurrent.submitGoogle}

                  onPress={() => this.onGoogleLogIn()} >

                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", textAlign: "center" }}>

                    <Image style={{
                      justifyContent: "center",
                      alignContent: "center",
                      marginEnd: 8, width: undefined, height: 25, aspectRatio: 1,
                    }}
                      source={require('../images/google.png')} />
                    <CustomText style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: Colors.textDark,
                      textAlign: 'center'
                    }}>Google </CustomText>

                  </View>
                </TouchableOpacity>

                <View style={{justifyContent:"center"}}>
                {this.SignInApple()}
                </View>

{
  Platform.OS === 'ios'?null: <TouchableOpacity style={stylesCurrent.submitGoogle}

  onPress={() => this.onFacebookLogIn()} >

  <View style={{
    flexDirection: "row",
    justifyContent: "center", alignItems: "center", alignContent: "center", textAlign: "center"
  }}>

    <Image style={{
      justifyContent: "center",
      alignContent: "center",
      marginEnd: 8, width: undefined, height: 25, aspectRatio: 1,
    }}
      source={require('../images/fb.png')} />
    <CustomText style={{
      fontSize: 16,
      fontWeight: '500',
      color: Colors.textDark,
      textAlign: 'center'
    }}>Facebook </CustomText>

  </View>
</TouchableOpacity>

}
               
              </View>
              <View style={{
                marginTop: 25,
                flex: 1
              }}>

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
  tabSelected: {
    alignContent: "center",
    justifyContent: "center",
  },
  tab: {
    alignContent: "center",
    justifyContent: "center"
  },
  tabTextSelected: {
    alignSelf: 'center', fontSize: 20,
    fontWeight: "bold",
    color: Colors.accent
  },
  tabText: {
    alignSelf: 'center', fontSize: 20,
    color: Colors.textDark
  },
  submit: {
    paddingVertical: 10,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 20,
    backgroundColor: Colors.button
  }
  ,
  submitGoogle: {
    paddingVertical: 10,
    marginStart: 16,
    marginEnd: 16,
    borderRadius: 6,
    marginTop: 16,
    paddingHorizontal: 16,
    fontSize: 20,
    backgroundColor: Colors.white
  }
});
