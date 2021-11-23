import * as Font from 'expo-font';
import React, { Component } from 'react';
import {Dimensions, ActivityIndicator, View,Alert ,Platform ,BackHandler,Image} from "react-native";
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import Loader from '../components/Loader';
import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../utils/Globals';

export default class Splash extends Component {

  constructor() {
    super();
    
  }


  async componentDidMount() {

    await Font.loadAsync({
      'myfont': require('../../assets/fonts/roboto.ttf'),
      'robotoBold':require('../../assets/fonts/robot_bold.otf')
    });
    if (Platform.OS === 'android') {
      Facebook.initializeAsync({"appId":"527183654875202"});
      Facebook.setAutoLogAppEventsEnabledAsync(true);
    }else{
      Facebook.initializeAsync("527183654875202");
      Facebook.setAutoLogAppEventsEnabledAsync(true);
    }
    this.startActivity();

   


  }


  runElse(){
    
    console.log("USER_LOGGEDIN" +USER_LOGGEDIN);
    try{
      AsyncStorage.getItem("userloggedin").then((value) => {


        try{
            GLOBAL_userObj = JSON.parse(value);
          console.log("USER_LOGGEDIN :" + value);
          if (GLOBAL_userObj == null) {
            Actions.login();
          } else {
            GLOBAL_TOKEN = GLOBAL_userObj.token;
            console.log("TOKEN " + GLOBAL_TOKEN);
            Actions.nav();
          }
        }catch(e){
          Actions.login();
         
        }
        Actions.pop();
      });
    }catch(e){
      Actions.login();
      Actions.pop();
    }
  }

  startActivity() {

    if(Platform.OS === 'android'){
      console.log("Platform android..");
      this.runElse();
    }else{
      fetch("https://freegeoip.app/json/", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        }
  
      })
        .then((response) => response.json())
        .then((responseJson) => {
             console.log("response  splash " + JSON.stringify(responseJson));
             if(
               responseJson.region_code=="AS" ||
               responseJson.region_code=="OR" ||
               responseJson.region_code=="NL" ||
               responseJson.region_code=="TG" ||
               responseJson.region_code=="SK" 
               ){
  
                Alert.alert(
                  'As per government guidelines, usage of this App is restricted in '+responseJson.region_name,
                  '',
                  [
                    { text: 'OK', onPress: () => {
                      BackHandler.exitApp();
                    } }
                  ],
                  { cancelable: false }
                );
             
             }else{
             
              this.runElse();
              
              
             }           
      
            })
  
  
   
    }
   


  }
  render() {
    return (

      <View style={{
        backgroundColor: Colors.app, justifyContent: 'center'
        , alignContent: "center",
        flex: 1
      }}>

<Image style={{
  flex:1,

  position:"absolute",
                    overflow: "hidden",
                   
   width: width,
   aspectRatio: 1,
   }}
   resizeMode="contain"
     source={require('../images/splash.png')} />
       



<Loader /> 

        



      </View>

    )


  }



}


export const { width, height } = Dimensions.get('window');
