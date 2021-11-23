import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import {Share, FlatList, Keyboard, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import Nodata from '../components/Nodata';
import styles from '../components/styles';
import * as Linking from 'expo-linking';


export default class ShareContestCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };


  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }

  componentWillUnmount() {

    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
   
  }

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..ShareInviteCode");
    if(this.props.goBackToHome){
      Actions.popTo("nav");

    }else{
      Actions.pop();
      
    }

  }

  getMessage(){
    var contest_code = this.props.contest_code;
    var textCha = 'I have challenged you to a contest for the '+this.props.short_name+' match. Think you can beat me? Here are two ways for you to join the action:'+
    '%0a  *"1)"*  Tap https://your11fantasy.com/private.htm?contestcode='+contest_code+
    '%0a  *"2)"*  Use contest code *"'+contest_code+'"*';
    return textCha;
  }
  shareWhatsApp = ()=>{
    Linking.openURL(`whatsapp://send?text=${this.getMessage()}`);
  }

  shareAll =()=>{
    Share.share({
      message:this.getMessage(),
    })
      //after successful share return result
      .then(result => console.log(result))
      //If any thing goes wrong it comes here
      .catch(errorMsg => console.log(errorMsg));
  }




  render() {


    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.app }}
      >
        <MyToolbar
          title="Share Invite Code"
          onBack={this.onBack}
        />
        <View style={{ backgroundColor: Colors.white, paddingVertical: 16, marginVertical: 32, alignItems: "center" }}>
          <CustomText style={{color:Colors.textLight}}>Share Your Contest Code</CustomText>
          <CustomText style={{ marginVertical: 6, fontWeight: "bold" }}>{this.props.contest_code}</CustomText>
          <TouchableOpacity
            onPress={
              () => {
                this.shareWhatsApp();
              }
            } style={{

              borderWidth: 0.4, borderRadius: 16,
              backgroundColor: Colors.green,width:200,
               height: 30
              , alignItems: "center", justifyContent: "center"
              , marginTop: 16
            }}
          >

            <CustomText
              style={{
                justifyContent: 'center',
                alignItems: "center",
                color: "#fff",
                fontSize: 13
              }}>
              WHATSAPP
                  </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              () => {
                this.shareAll();
              }
            } style={{

              borderWidth: 0.4, borderRadius: 16,
              backgroundColor: Colors.white,width:200,
               height: 30
              , alignItems: "center", justifyContent: "center"
              , marginVertical: 16
            }}
          >

            <CustomText
              style={{
                justifyContent: 'center',
                alignItems: "center",
                color: "#fff",
                fontSize: 13,
                color:Colors.textDark
              }}>
              MORE OPTIONS
                  </CustomText>
          </TouchableOpacity>


        </View>
        <View>


        </View>
      </View>


    )



  }





}


