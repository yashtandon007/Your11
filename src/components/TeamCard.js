import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as Colors, default as COLORS } from './colors';
import CustomText from './CustomText';
import YImageLoad from './YImageLoad';
import styles from './styles';
import Player from '../model/Player';
import { ProgressBar } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { getPLayerByCategory, getPLayerByTeamType ,getPLayerByKey} from '../utils/Globals';
import * as constants from '../utils/constants';
import { show } from '../utils/Globals';


export default class TeamCard extends Component {

  wkCount = 0;
  batCount = 0;
  bowlCount = 0;
  arCount = 0;
  teamACount = 0;
  teamBCount = 0;

  componentWillMount() {
    this.wkCount = getPLayerByCategory(true, this.props.myItem.players, player_type_wk).length;
    this.batCount = getPLayerByCategory(true, this.props.myItem.players, player_type_batsman).length;
    this.arCount = getPLayerByCategory(true, this.props.myItem.players, player_type_ar).length;
    this.bowlCount = getPLayerByCategory(true, this.props.myItem.players, player_type_bowler).length;
    this.teamACount = getPLayerByTeamType(true, this.props.myItem.players, "a").length;
    this.teamBCount = getPLayerByTeamType(true, this.props.myItem.players, "b").length;

  }

  //   join   /Closed
  constructor(props) {
    super(props);
    console.log("this.props.myItem.teams.a.image " + this.props.myItem.teams.a.image)
    this.state = {
      imageTeam1: { uri: this.props.myItem.teams.a.image?this.props.myItem.teams.a.image:"http://intentiallyFailed/a.png" },
      imageTeam2: { uri: this.props.myItem.teams.b.image ?this.props.myItem.teams.b.image:"http://intentiallyFailed/a.png"},
      response: {
        data: {
          contest: {
            spots_count: 100,
            spots_filled: 50
          }
        }
      }
    }
  }

  onFinishTime() {
    // this.props.onFinishTime(this,this.props.indexNumber);
  }

  onError(isTeam1) {
    console.log("onError..." + isTeam1)
    if (isTeam1) {
      this.setState({ imageTeam1: require('../images/trophy.png') })

    } else {
      this.setState({ imageTeam2: require('../images/trophy.png') })


    }
  }


  startCreateTeam(updating){
    var copyPlayers = JSON.parse(JSON.stringify(this.props.myItem.players))
    console.log("PLAYERS >>> "+JSON.stringify(copyPlayers));
    console.log("teamSize "+this.props.teamSize);
    if(this.props.teamSize>=11){
      show("Cant create more teams.");
    }
    Actions.CreateTeam({
      date: this.props.date,
      match_key:this.props.myItem.match_key,
      _id:this.props.myItem._id,
      isUpdating:updating,
      players:copyPlayers,
      username:this.props.myItem.username,
      teams:this.props.myItem.teams,
      captain_player_key:this.props.myItem.captain_player_key,
      vice_captain_player_key:this.props.myItem.vice_captain_player_key,
      fielder_player_key:this.props.myItem.fielder_player_key
  });
  }


  render() {

  
    var extcaptain = "";
    var extfielder = "";
    var extVc = "";
    var captain = getPLayerByKey(this.props.myItem.players,this.props.myItem.captain_player_key);
    var fielder = getPLayerByKey(this.props.myItem.players,this.props.myItem.fielder_player_key);
    var vCaptain = getPLayerByKey(this.props.myItem.players,this.props.myItem.vice_captain_player_key);
    
      extcaptain = captain.player_key;
      extcaptain = extcaptain.toLowerCase()+".png";

      extfielder = fielder.player_key;
      extfielder = extfielder.toLowerCase()+".png";
    
      extVc = vCaptain.player_key;
      extVc = extVc.toLowerCase()+".png";
     var date = new Date();
    
  



    return (

      <TouchableOpacity
     
      onPress={
        () => {
          Actions.TeamView(
            {
              team_id:this.props.team_id,
              toRefresh:this.props.toRefresh
            }
          );
        }
      }>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 1,
            elevation: 1,
            marginHorizontal: 16,
            marginBottom: 16,
            borderColor: Colors.black,
            borderWidth: 0.1,
            backgroundColor:Colors.green,
            borderRadius: 6,
          }}>
        


          <View style={{
          }}>


            <View style={{
              width: "100%",
              alignItems: "center", justifyContent: "center",
              justifyContent: "space-between",
              flexDirection: "row"
            }}>

              <View style={{ backgroundColor: Colors.black, opacity: 0.5, height: 40, width: "100%" }} />
              <View style={{
                position: "absolute", flexDirection: "row", width: "100%",
                justifyContent: "space-between", alignItems: "center"
              }}>
                <CustomText style={{
                  color: Colors.white, marginStart: 16, fontWeight: "bold", fontSize: 13
                }}>TEAM   ({this.props.myItem.team_order_key})</CustomText>
                {
                  this.props.selectTeam||this.props.isMatchCompleted ? null :
                   <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginEnd: 16
                  }}>
                    <TouchableOpacity
                      onPress={
                        () => {
                          Actions.TeamView(
                            {
                              team_id:this.props.team_id,
                              toRefresh:this.props.toRefresh   }
                          );
                        }
                      }>
                      <Image
                        style={{
                          width: 20, height: 20, marginEnd: 32
                        }}
                        source={require('../images/ic_visibility.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={
                        () => {
                          this.startCreateTeam(true);
                  
                        }
                      }
                    >
                      <Image
                        style={{
                          width: 20, height: 20, marginEnd: 32
                        }}
                        source={require('../images/ic_edit.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                     onPress={
                      () => {
                        this.startCreateTeam(false);
                      }
                    }
                  >
                      <Image
                        style={{
                          width: 20, height: 20, marginEnd: 3
                        }}
                        source={require('../images/ic_copy.png')} />
                    </TouchableOpacity>
                  </View>

                }
              </View>

            </View>

            <View style={{ marginHorizontal: 16, marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row" }}>
                <CustomText style={{ color: Colors.white }}>{this.props.myItem.teams.a.short_name}</CustomText>
                <Image
                  style={{
                    marginHorizontal:6,width: 20, height: 20
                  }}
                  source={this.state.imageTeam1}
                  onError={this.onError.bind(this,true)}
                />
                <CustomText style={{ color: Colors.white }}> {this.teamACount}</CustomText>

              </View>

              <View style={{ flexDirection: "row" }}>
                <CustomText style={{ color: Colors.white}}>{this.props.myItem.teams.b.short_name}</CustomText>
                <Image
                  style={{
                    marginHorizontal:6,width: 20, height: 20
                  }}
                  source={this.state.imageTeam2}
                  onError={this.onError.bind(this,false)}
                />
                <CustomText style={{ color: Colors.white }}> {this.teamBCount}</CustomText>

              </View>
            </View>

            <View style={{
              marginHorizontal: 32,
              marginVertical: 8,
              flexDirection: "row",
              alignItems: "center", justifyContent: "space-between"

            }}>
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row" }}>
                 
                    <YImageLoad
                                        style={{
                                         
                                          width: 45, height: 45
                                        }}
   
       
     placeholderSource={require('../images/player.png')}
     yurl={constants.PLAYER_IMAGE+extcaptain+"?a="+date+""}/>

                  <View style={stylesCurrent.circle}>

                    <CustomText style={{ color: Colors.white, fontSize: 12 }}>C</CustomText>
                  </View>
                </View>
                <CustomText style={{ fontSize: 10, textAlign: "center", width: "100%", backgroundColor: Colors.white  ,fontWeight:"bold"}}>{captain.name}</CustomText>

              </View>
              <View style={{ alignItems: "center", }}>
                <View style={{ flexDirection: "row" }}>
                <YImageLoad
                                        style={{
                                          width: 45, height: 45
                                        }}
     placeholderSource={require('../images/player.png')}
     yurl={constants.PLAYER_IMAGE+extVc+"?a="+date+""}/>

                  <View style={stylesCurrent.circle}>

                    <CustomText style={{ color: Colors.white, fontSize: 12 }}>VC</CustomText>
                  </View>
                </View>
                <CustomText style={{ fontSize: 10, textAlign: "center", width: "100%", backgroundColor: Colors.white ,fontWeight:"bold" }}>{vCaptain.name}</CustomText>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row" }}>
                <YImageLoad
                                        style={{
                                          width: 45, height: 45
                                        }}
       placeholderSource={require('../images/player.png')}
     yurl={constants.PLAYER_IMAGE+extfielder+"?a="+date+""}/>

                  <View style={stylesCurrent.circle}>

                    <CustomText style={{ color: Colors.white, fontSize: 12 }}>F</CustomText>
                  </View>
                </View>
                <CustomText style={{ fontSize: 10, textAlign: "center", width: "100%", backgroundColor: Colors.white ,fontWeight:"bold" }}>{fielder.name}</CustomText>
              </View>
            </View>

            <View style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 32,
              flexDirection: "row",
              paddingVertical: 3,
              alignItems: "center", justifyContent: "space-between"

            }}>

              <CustomText>WK {this.wkCount}</CustomText>
              <CustomText>BAT  {this.batCount}</CustomText>
              <CustomText>AR  {this.arCount}</CustomText>
              <CustomText>BOWL  {this.bowlCount}</CustomText>
            </View>
          </View>

        </View>

      </TouchableOpacity>
    );
  }
}

const stylesCurrent = StyleSheet.create({
  circle: {
    width: 20, height: 20,
    backgroundColor: Colors.black, color: Colors.white,
    alignContent: "center", flexDirection: "row",
    justifyContent: "center", alignItems: "center",
    borderColor: Colors.white, borderWidth: 1, borderRadius: 20 / 2
  }


});

