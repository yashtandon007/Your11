import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import COLORS from './colors';
import CustomText from './CustomText';



export default class Capsule extends Component {


  state={
    hr:0,
    min:1,
    sec:4
  }

  render() {
    return (

      <View style={{ marginTop:-3,
        backgroundColor: COLORS.app, 
        paddingTop: 3, paddingBottom: 3, paddingStart: 32, 
        paddingEnd: 32,color: COLORS.button,
          flexDirection:"row",
          alignSelf: "baseline"
          }}>

                <CustomText
                style={{fontWeight:"bold",color:COLORS.accent}}>

                  {this.state.hr}
                </CustomText> 
                <CustomText>
                  h
                </CustomText> 
                <CustomText
                  style={{fontWeight:"bold",color:COLORS.accent,marginStart:3}}>

                  {this.state.min}
                </CustomText> 
                <CustomText
                >
                 m
                </CustomText> 
                <CustomText
                                  style={{fontWeight:"bold",color:COLORS.accent,marginStart:3}}>

                  {this.state.sec}
                </CustomText> 
                <CustomText>
                  s
                </CustomText> 
                

                </View> 
                
                );
  }
}
