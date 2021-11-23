// CustomText.js
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import CountDown from 'react-native-countdown-component';
import { default as Colors, default as COLORS } from './colors';
import CustomText from './CustomText';
import moment from 'moment';
import {getSeconds, show} from '../utils/Globals';

export default class MatchTimer extends React.Component {
  constructor(props) {
    super(props);
    // show("this.props.time "+this.props.time);
  }

  getDayText() {

    var ret = "";
    var Difference_In_Days =getSeconds(this.props.time) / ( 3600 * 24);
    if (Difference_In_Days < 1) {
    }else{
      var ret = "" + parseInt(Difference_In_Days) + " day(s) left";  
    }
    return ret;

  }

 

  render() {
    return (
      <View style={{paddingHorizontal:6,paddingVertical:3}}>
        {this.getDayText() == "" ?

          <CountDown
            until={getSeconds(this.props.time)}
            onFinish={() => {
              console.log("card onFinish...");
              this.props.onFinishTime(this, this.props.indexNumber);
            }}
            size={13}
            digitStyle={{ backgroundColor: this.props.bgColor?this.props.bgColor:Colors.app }}
            style={{ marginTop: -2 }}
            digitTxtStyle={{ color:this.props.txtColor?this.props.txtColor:Colors.dream11red}}
            timeToShow={['H', 'M', 'S']}
            showSeparator={false}
            timeLabels={{ h: 'h', m: 'm', s: 's' }} /> :
          <CustomText style={{ color: this.props.txtColor?this.props.txtColor:Colors.dream11red, fontWeight:"bold" }}>
            {this.getDayText()}
          </CustomText>}

      </View>


    );
  }
}
