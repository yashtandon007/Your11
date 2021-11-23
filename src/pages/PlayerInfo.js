import React, { Component } from 'react';
import { BackHandler, Alert, StyleSheet, Animated, Dimensions, ActivityIndicator, FlatList, Image, Keyboard, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../components/Capsule';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import YImageLoad from '../components/YImageLoad';
import CreateTeamInner from './CreateTeamInner';
import * as Animatable from 'react-native-animatable';

import * as constants from '../utils/constants';

import styles from '../components/styles';
import { show } from '../utils/Globals';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

export default class PlayerInfo extends Component {

  state = {
    loading: false
  }

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("AboutUs onBack");
    Actions.pop();
  }

  componentDidMount() {
  }

  render() {
    var ext = "";
              ext = this.props.item.key;
              ext = ext.toLowerCase() + ".png";
              var date = new Date();

    return (
      <View
        style={{
          backgroundColor: Colors.dream11Bg,
          flex: 1,

        }}>

        <MyToolbar
          style={{ width: width }}
          title="Player Info"
          onBack={this.onBack}
        />

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{

            borderRadius: 6,
            height: ((height / 100) * 80), width: ((width / 100) * 80),
            backgroundColor: Colors.white,

          }}>

            <View style={{
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              flexDirection: "row",
              paddingHorizontal: 16,
              backgroundColor: Colors.black
            }}


            >


              <YImageLoad
             
                style={{
                  marginStart: 16, width: 50, height: 50, position: "absolute", bottom: 0
                }}
              
                placeholderSource={require('../images/player.png')}
                yurl={constants.PLAYER_IMAGE + ext + "?a=" + date + ""} />


              <View style={{ flex: 1, marginStart: 60, paddingVertical: 32, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View>
                  <CustomText style={{ color: Colors.white, fontSize: 14, fontWeight: "bold" }}>{this.props.item.fullname}</CustomText>
                  <CustomText style={{ color: Colors.textLight, fontSize: 11 }}>{this.props.item.player_type}</CustomText>
                </View>

                <View>
                  <CustomText style={{ color: Colors.textLight }}>Points</CustomText>
                  <CustomText style={{ color: Colors.white, fontWeight: "bold", fontSize: 15 }}>{this.props.item.match_points}</CustomText>
                </View>
              </View>
            </View>



            <View style={{
              justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.white,
            }}>
              <CustomText style={{ color: Colors.textLight, fontSize: 12 }}>Event      </CustomText>

              <CustomText style={{ color: Colors.textLight, fontSize: 12 }}>Points</CustomText>

            </View>


            <View>
              <View style={{
                justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.app,
              }}>
                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}> Batting</CustomText>

                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>{this.props.item.calculation.bat}</CustomText>

              </View>
              <View style={{
                justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.app,
              }}>
                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}> Bowling</CustomText>

                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>{this.props.item.calculation.bowl}</CustomText>

              </View>
              <View style={{
                justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.app,
              }}>
                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}> Economy Rate</CustomText>

                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>{this.props.item.calculation.economy_rate}</CustomText>

              </View>


              <View style={{
                justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.app,
              }}>
                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>Fielding</CustomText>

                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>{this.props.item.calculation.field}</CustomText>

              </View>



              <View style={{
                justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.app,
              }}>
                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>Playing 11</CustomText>

                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>{this.props.item.calculation.playing_xi}</CustomText>

              </View>



              <View style={{
                justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", backgroundColor: Colors.app,
              }}>
                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>Strike Rate</CustomText>

                <CustomText style={{ color: Colors.textLight, fontSize: 13 }}>{this.props.item.calculation.strike_rate}</CustomText>

              </View>



            </View>





          </View>

        </View>

      </View>
    );
  }
}


export const { width, height } = Dimensions.get('window');

