import React, { Component } from 'react';
import CustomText from './CustomText';
import {RefreshControl, BackHandler, Dimensions, ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { default as Colors } from './colors';

export default class Message extends Component {

  state={
    hide:false
  }
  componentDidMount(){
   
  }
  render() {
    return (
     
       <CustomText style={{
        position:"absolute",
        top:0,
        width:"100%",
        padding:20,
        textAlign:"center",
        backgroundColor:Colors.toast,
        color:"#fff"
        }}>
         {this.props.message}
      </CustomText>
     
    )
  }
}

