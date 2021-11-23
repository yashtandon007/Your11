import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as Colors, default as COLORS } from './colors';
import CustomText from './CustomText';
import YImageLoad from './YImageLoad';
import MatchTimer from './MatchTimer';

import { getSeconds } from '../utils/Globals';
import moment from 'moment';


export default class MatchCard extends Component {


  //   join   /Closed
  constructor(props) {
    super(props);
    console.log("this.props.team1.image " + this.props.team1.image);
    


  }

  componentDidMount() {

  }
  onFinishTime() {
    this.props.onFinishTime(this, this.props.indexNumber);
  }


 
  render() {
    var stat = this.props.time;
    var bgCol = Colors.green;
    if(this.props.time == "live"){
      bgCol = Colors.dream11red;
    }else if(this.props.time == "completed"){ 
      bgCol = Colors.green;
    }
    var mOpacity = this.props.myItem.is_enabled ? 1 : 0.5;
    var date = new Date();
    var mStyl = {alignSelf:"center"};
    if(this.props.mymatches){
      mStyl = {marginHorizontal: 2};
    }
    return (



      <TouchableOpacity
      activeOpacity={1}
        onPress={this.props.onMatchItemCLicked.bind(this, this.props.myItem)}
      >
        <View style={[{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
         shadowRadius: 1,
          
          elevation: 1,
          opacity: mOpacity,
          backgroundColor: Colors.white,
          width:width*0.94,
          marginBottom:16,
         // borderWidth: 0.1,
          borderRadius: 7,
          justifyContent: "center"
        },mStyl]}>

          <View style={{ paddingHorizontal: 16,paddingVertical:2, marginVertical: 8, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText style={{ color: Colors.textDark, fontSize: 11,color:"#9e9e9e" }}>
              {this.props.myItem.season.card_name}
            </CustomText>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ color: Colors.textDark, fontSize: 10 }}>

              </CustomText>
              <CustomText style={{ color: Colors.textDark, fontSize: 10 ,color:"#9e9e9e"}}>
             {moment(this.props.myItem.start_date.iso).format('MMM Do YYYY, h:mm a')} 
            </CustomText>
            </View>

          </View>
          <View style={{ backgroundColor: Colors.appDark, height: 0.4, width: "100%" }} />

          <View style={{ marginTop: 12, marginBottom: 6, marginHorizontal: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText noOfLine={1} style={{ flex: 1, color: Colors.textDark, fontSize: 12 }}>
              {this.props.team1.name}
            </CustomText>

            <CustomText noOfLine={1} style={{ textAlign: "right", flex: 1, color: Colors.textDark, fontSize: 12, }}>
              {this.props.team2.name}
            </CustomText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>


            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginStart: 16 }}>
             
               <YImageLoad
                                          

   style={{
    marginEnd: 8,
    width: 30, height: 30,
  }}
    
     placeholderSource={require('../images/trophy.png')}
     yurl={this.props.team1.image+"?d="+date}
     />

              <Text style={{fontFamily: 'robotoBold', fontSize: 16,   textTransform: 'uppercase' }}>
                {this.props.team1.key}
              </Text>
            </View>
            {
              (this.props.time == "completed" ||
                this.props.time == "live") ?
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <View style={{ width: 7, height: 7, marginEnd: 5, backgroundColor:bgCol, borderRadius: 7 / 2 }} />
                  <CustomText style={{ color: bgCol, textAlign: "center", textAlignVertical: "center", fontSize: 10, textTransform: 'uppercase' }}>{this.props.time}</CustomText>

                </View> :
                <View style={{ alignItems: "center" }}>
                  <MatchTimer
                    onFinishTime={this.onFinishTime.bind(this)}
                    indexNumber={this.props.indexNumber}
                    time={this.props.time}
                  />
                </View>
            }


            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginEnd: 16 }}>
            <Text style={{fontFamily: 'robotoBold', fontSize: 16, textTransform: 'uppercase' }}>
                {this.props.team2.key}
              </Text>

            
<YImageLoad
                                          

   style={{
    marginStart: 8,
    width: 30, height: 30,
  }}
    
     placeholderSource={require('../images/trophy.png')}
     yurl={this.props.team2.image+"?d="+date}
   
     />
            </View>
          </View>

          <CustomText noOfLine={1} style={{
            borderBottomRightRadius: 10, borderBottomLeftRadius: 10,
            paddingVertical:10, paddingHorizontal: 6, fontSize: 11, backgroundColor: "#f7f7f7"
          }}>Venue: {this.props.myItem.venue}</CustomText>


        </View>
      </TouchableOpacity>
    );
  }
}
export const { width, height } = Dimensions.get('window');