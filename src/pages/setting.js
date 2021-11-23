import React, { Component } from 'react';
import { Share, Alert,  Image, Linking, ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class Setting extends Component {


  constructor(props) {
    super(props);
    this.state = {
      username: "",
      loading: false,
      response: {}
    };


  }


  oneBigBit() {
    Linking.openURL(`https://onebigbit.com/`);
  }

  whatsapp() {


    var url = GLOABAL_API + 'users/get';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }



    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log({ "response": responseJson });
        if (responseJson.status === 1) {
          var username = responseJson.data.username;
          var textCha = 'Lets enter the Arena together. Tap https://play.google.com/store/apps/details?id=com.theonlinearena.toa to download *"The Online Arena"* and get *₹ 50* instant joining bonus. Use my referral code *"' + username + '"* to get extra referral bonus of *₹ 50*. Let the battle begin.';
          Linking.openURL(`whatsapp://send?text=${textCha}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });


  }

  instagram() {

    Linking.openURL(`https://instagram.com/theonlinearena.official`);
  }

  onCall() {
    Linking.openURL(`tel://8960708083`);

  }

  youtube() {
    Linking.openURL(`https://www.youtube.com/channel/UCCgaX_Gzwx20xErsijHHecA`);

  }

  facebook() {
    Linking.openURL(`https://www.facebook.com/theonlinearena`);

  }

  componentDidMount() {
    AsyncStorage.getItem(USER_LOGGEDIN).then((value) => {

      this.setState({
        username: value
      });
      console.log("splash value " + value);

    })

  }



  onLogout = () => {


    console.log("item selected..");
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? ', [{
        text: 'Cancel',
        onPress: console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'Logout',
        onPress: () => {


          this.setState({
            loading: true
          })

          fetch(GLOABAL_API + "users/logout", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json',
              Authorization: GLOBAL_TOKEN
            },
            body: {}

          })

            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                loading: false
              })

              console.log({ "response": responseJson });
              if (responseJson.status === 1) {
                AsyncStorage.setItem(USER_LOGGEDIN, "").then((value) => {
                  console.log({ USER_LOGGEDIN: value });
                  GLOBAL_TOKEN = "";
                  Actions.login();
                });

                Actions.pop();
              }
            })
            .catch((error) => {
              this.setState({
                loading: false
              })
            });


        }
      }])




  }
  onPrivacyPolicy = () => {
    Actions.WebViewGlobal({
      title: "Privacy Policy",
      url: "https://your11fantasy.com/privacy_policy"
    });

  }

  onTandC = () => {
    Actions.WebViewGlobal({
      title: "Terms and Conditions",
      url: "https://your11fantasy.com/terms_of_use"
    });

  }
  onRefund = () => {
    Actions.WebViewGlobal({
      title: "Refund and Cancellation",
      url: "https://your11fantasy.com/terms_of_use"
    });

  }

  onWallet = () => {
    Actions.wallet();
  }

  onShareInviteCode = () => {
    Actions.ShareInviteCode();

  }

  onUpdateProfile = () => {
    Actions.signup({
      fromRegistration: false
    });
  }

  mailTo = () => {
    Linking.openURL('mailto:support@your11fantasy.com')
  }

  onAboutUs = () => {
    Actions.AboutUs();
  }


  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..Wallet");
    Actions.pop();
  }


  render() {
    var sec = new Date().getSeconds(); //Current Seconds

    let Image_Http_URL = { uri: 'https://onebigbit.com/assets/img/poweredby.png?date=' + sec };

    return (

      <ScrollView
        shouldCancelWhenOutside={false}
        style={{ backgroundColor: COLORS.dream11Bg }}
      >








        {/* buttones frame */}
        <View
          style={{ flex: 1 }}>

          {/* Buttons */}
          <View
            style={{
              flex: 1,
            }}>
            <View style={{ alignItems: "center", backgroundColor: Colors.dream11red, flexDirection: "row" }}>

              <TouchableOpacity
                style={{

                  justifyContent: "flex-end",
                  marginStart: 16, alignItems: "center"


                }}

                onPress={() => {
                  Actions.signup({
                    fromRegistration: false
                  });
                }}>



                {GLOBAL_userObj.image_url == "" ? <Image style={{
                  overflow: "hidden",
                  alignSelf: "center",
                  width: undefined, height: 28, aspectRatio: 1,
                }}
                  source={require('../images/userIcon.png')} /> :
                  <Image
                    source={{ uri: GLOBAL_userObj.image_url + "?", cache: 'reload' }} style={{
                      aspectRatio: 1, height: 28, borderRadius: 50 / 2,
                      overflow: "hidden",
                      alignSelf: "center",
                      backgroundColor: COLORS.app
                    }} />
                }

              </TouchableOpacity>
              <CustomText style={{ color: Colors.white, fontWeight: "bold", padding: 16, fontSize: 17, }}>More</CustomText>

            </View>

            {/* <TouchableOpacity
                style={stylesCurrent.buttonUser}
              onPress={this.onUpdateProfile.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%",
                  width:"100%",
                   justifyContent: 'flex-start',
                  flexDirection:"row",
                }}>
               <Image
                      source={{ uri: GLOBAL_userObj.image_url + "?", cache: 'reload' }} style={{
                        width: 40, height: 40, borderRadius: 50 / 2,
                        overflow: "hidden",
                        alignSelf:"center",
                        marginStart:16,
                            backgroundColor: COLORS.app
                      }} />

<View style={{marginStart:16}}>
                    <CustomText style={{color:Colors.textDark,fontWeight:"700",textTransform: 'capitalize'}}>{GLOBAL_userObj.name}</CustomText>
                    <CustomText style={{color:Colors.textLight}}>{GLOBAL_userObj.email}</CustomText>
</View>
              </View>
             
            
            </TouchableOpacity>
           */}


            <TouchableOpacity
              style={stylesCurrent.button}
              onPress={this.onWallet.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,
                  tintColor: Colors.iconGrey,
                  marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/wallet.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Wallet</CustomText>


              <Image style={{
                width: 10,

                marginEnd: 8, width: undefined, height: 10, aspectRatio: 1,
              }}
                source={require('../images/arrowRight.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesCurrent.buttonMiddle}
              onPress={this.onShareInviteCode.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,

                  tintColor: Colors.iconGrey,
                  marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/invitation.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Share Invite Code</CustomText>


              <Image style={{
                width: 10,

                marginEnd: 8, width: undefined, height: 10, aspectRatio: 1,
              }}
                source={require('../images/arrowRight.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesCurrent.buttonMiddle}
              onPress={() => Actions.PointSystemTab()}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,
                  tintColor: Colors.iconGrey,

                  marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/policy.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Points System</CustomText>


              <Image style={{
                width: 10,

                marginEnd: 8, width: undefined, height: 10, aspectRatio: 1,
              }}
                source={require('../images/arrowRight.png')} />
            </TouchableOpacity>



            <TouchableOpacity
              style={stylesCurrent.buttonMiddle}
              onPress={this.onTandC.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,

                  tintColor: Colors.iconGrey,
                  marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/terrmsconditions.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Terms and Conditions</CustomText>

              <Image style={{
                width: 10,

                marginEnd: 8, width: undefined, height: 10, aspectRatio: 1,
              }}
                source={require('../images/arrowRight.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesCurrent.buttonMiddle}
              onPress={this.onRefund.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,

                  tintColor: Colors.iconGrey,
                  marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/refundcancellation.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Refund and Cancellation</CustomText>


              <Image style={{
                width: 10,

                marginEnd: 8, width: undefined, height: 10, aspectRatio: 1,
              }}
                source={require('../images/arrowRight.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesCurrent.buttonMiddle}
              onPress={this.onPrivacyPolicy.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,


                  tintColor: Colors.iconGrey, marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/policy.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Privacy Policy</CustomText>


              <Image style={{
                width: 10,

                marginEnd: 8, width: undefined, height: 10, aspectRatio: 1,
              }}
                source={require('../images/arrowRight.png')} />
            </TouchableOpacity>



            <TouchableOpacity
              style={stylesCurrent.buttonMiddleNoHeight}

            >

              <View>

                <View>

                  <View style={[stylesCurrent.text,{marginStart:48}]}>
                    <CustomText >Get In Touch</CustomText>
                  </View>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center",  }}>

                      <View style={{ flex: 1, }}>
                        <TouchableOpacity style={{ marginBottom:6 }} onPress={this.mailTo.bind(this)}
                        >
                          <View style={{flexDirection:"row",marginStart:16}}>
                            <Image style={{
                              width: 10,


                              tintColor: Colors.iconGrey, marginEnd: 22, width: undefined, height: 18, aspectRatio: 1,
                            }}
                              source={require('../images/email.png')} />
                            <CustomText style={{ color: 'blue' }}>support@your11fantasy.com</CustomText>


                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{marginBottom:16}}
                          onPress={this.onCall.bind(this)}
                        >
                        <View style={{flexDirection:"row",marginStart:16}}>
                             <Image style={{
                              width: 10,


                              tintColor: Colors.iconGrey, marginEnd: 22, width: undefined, height: 18, aspectRatio: 1,
                            }}
                              source={require('../images/phone.png')} />
                            <CustomText style={{ color: 'blue' }}>8960708083</CustomText>


                          </View>
                        </TouchableOpacity>
                      </View>
                   <View style={{height:"100%"}}>
                   <Image style={{
                        width: 10,

                        marginEnd: 24, width: undefined, height: 10, aspectRatio: 1,
                      }}
                        source={require('../images/arrowRight.png')} />
                   </View>

                    </View>


                  </View>


                </View>


              </View>



            </TouchableOpacity>




            <TouchableOpacity
              style={[stylesCurrent.buttonUser, { marginTop: 16, }]}
              onPress={this.onLogout.bind(this)}
            >
              <View
                style={{
                  marginStart: 16,
                  marginEnd: 6, height: "100%"
                  , alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image style={{
                  width: 10,
                  tintColor: Colors.iconGrey,
                  marginEnd: 8, width: undefined, height: 18, aspectRatio: 1,
                }}
                  source={require('../images/logout.png')} />

              </View>

              <CustomText style={stylesCurrent.text}>Logout</CustomText>



            </TouchableOpacity>




          </View>

          {/* 
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              marginTop: 16,
            }}
            onPress={this.oneBigBit.bind(this)}

          >

            <Image source={Image_Http_URL} style={{ height: 60, width: 180, margin: 5 }} />


          </TouchableOpacity> */}



        </View>
        {this.state.loading ?

          <Loader /> : null}
      </ScrollView>

    )


  }


}


const stylesCurrent = StyleSheet.create({

  button: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingEnd: 16,

  },

  buttonMiddle: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center', marginTop: 2,
    height: 50,
    paddingEnd: 16,

  },
  buttonMiddleNoHeight: {
    backgroundColor: Colors.white,
    marginTop: 2,

  },
  buttonUser: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    paddingEnd: 16,
    paddingVertical: 16,


  },
  text: {
    flex: 1.5,
    fontSize: 14,
    padding: 6,

    textAlign: 'left',
    color: Colors.textDark
  }
});