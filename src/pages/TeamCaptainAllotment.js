import React, { Component } from 'react';
import { StyleSheet, BackHandler, FlatList, Image, Keyboard, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../components/Capsule';
import Loader from '../components/Loader';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import { show, getSelectedPlayers } from '../utils/Globals';
import { getPLayerByCategory } from '../utils/Globals';
import { getSeconds } from '../utils/Globals';
import * as constants from '../utils/constants';
import YImageLoad from '../components/YImageLoad';



export default class TeamCaptainAllotment extends Component {


  constructor(props) {
    super(props);
    var groups = [];
    var l1 = getPLayerByCategory(true, this.props.players, player_type_wk);
    var l2 = getPLayerByCategory(true, this.props.players, player_type_batsman);
    var l3 = getPLayerByCategory(true, this.props.players, player_type_ar);
    var l4 = getPLayerByCategory(true, this.props.players, player_type_bowler);
    groups = l1.concat(l2).concat(l3).concat(l4);

    this.state = {
      selected: {
        name: 2,
        points: 0
      },
      wkList: l1,
      batsList: l2,
      arList: l3,
      bowlerList: l4,
      playerList: groups,
      mteamData: {
        _id: this.props._id,
        username: this.props.username,
        teams: this.props.teams,
        match_key: this.props.match_key,
        credits_left: this.props.credits_left,
        players: this.props.players,
        vice_captain_player_key: this.props.vice_captain_player_key,
        captain_player_key: this.props.captain_player_key,
        fielder_player_key: this.props.fielder_player_key
      },
    }
  }

  seconds = 0;
  componentDidMount() {
    this.seconds = this.props.date;
    console.log("allotment this.seconds " + this.seconds);
    var isCaptainAvailable = false;
    var isVCaptainAvailable = false;
    var isFAvailable = false;
    var team = this.state.mteamData;
    for (var i = 0; i < this.props.players.length; i++) {
      var player = this.props.players[i];
      console.log("yashplayerOBJECT " + JSON.stringify(player));
      if (player.player_key == team.captain_player_key) {
        if (player.is_selected) {
          isCaptainAvailable = true;
        }
      }
      if (player.player_key == team.vice_captain_player_key) {
        if (player.is_selected) {
          isVCaptainAvailable = true;
        }
      }
      if (player.player_key == team.fielder_player_key) {
        if (player.is_selected) {
          isFAvailable = true;
        }
      }
    }

    if (isCaptainAvailable == false) {
      team.captain_player_key = undefined;
    }
    if (isVCaptainAvailable == false) {
      team.vice_captain_player_key = undefined;
    }
    if (isFAvailable == false) {
      team.fielder_player_key = undefined;
    }

    this.setState({
      mteamData: team
    });
    this.myinerverl = setInterval(() => {

      this.seconds = (this.seconds - 1);
      if (this.seconds == 0) {
        clearInterval(this.myinerverl);
      }
    }, 1000);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

  }
  componentWillUnmount() {

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }


  handleBackButton = () => {
    this.onBack();
    return true;
  }


  clearSelection(mteamData, id) {

    if (mteamData.captain_player_key == id) {
      mteamData.captain_player_key = undefined;
    }
    if (mteamData.vice_captain_player_key == id) {
      mteamData.vice_captain_player_key = undefined;
    }
    if (mteamData.fielder_player_key == id) {
      mteamData.fielder_player_key = undefined;
    }
    return mteamData;
  }







  getUpDownIcon(number) {
    if (number == 2) {
      return require('../images/ic_arrow_up.png');
    } else if (number == 1) {
      return require('../images/ic_arrow_down.png');
    } else if (number == 0) {
      return null;
    }
    return null;
  }
  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("AboutUs onBack");
    Actions.pop();
  }


  capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }


  getItem(item) {
    var ext = "";
      ext = item.player_key;
   
    ext = ext.toLowerCase() + ".png";
  

    return <View style={{ paddingHorizontal: 16, paddingVertical: 6, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: Colors.white, marginBottom: 6 }}>

      <View style={{ flex: 3, flexDirection: "row", alignItems: "center" }}>
        <View>

          <YImageLoad
          

            style={{
              marginEnd: 16, width: undefined, height: 30, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
            }}
           
            placeholderSource={require('../images/player.png')}
            yurl={ constants.PLAYER_IMAGE + ext} />


          <CustomText style={{ color: Colors.white, backgroundColor: Colors.green, fontSize: 11 }}>
            {this.capitalize(item.player_type.substring(0, 10))}
          </CustomText>
        </View>
        <View>
          <CustomText style={{ fontSize: 13,fontWeight:"bold" }}>
            {item.name.substring(0, 15)}
          </CustomText>
          <CustomText style={{ fontSize: 13 }}>
            {item.points}
          </CustomText>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>

        <TouchableOpacity
          onPress={
            () => {
              var mteamData = this.state.mteamData;
              mteamData = this.clearSelection(mteamData, item.player_key);
              mteamData.captain_player_key = item.player_key;
              this.setState({
                mteamData: mteamData
              });
            }
          }
        ><CustomText style={item.player_key == this.state.mteamData.captain_player_key ? stylesCurrent.itemSelected : stylesCurrent.item}>
            C</CustomText>

        </TouchableOpacity>


        <TouchableOpacity
          onPress={
            () => {
              var mteamData = this.state.mteamData;
              mteamData = this.clearSelection(mteamData, item.player_key);
              mteamData.vice_captain_player_key = item.player_key;
              this.setState({
                mteamData: mteamData
              });
            }
          }
        ><CustomText style={item.player_key == this.state.mteamData.vice_captain_player_key ? stylesCurrent.itemSelected : stylesCurrent.item}>
            VC</CustomText>

        </TouchableOpacity>



        <TouchableOpacity
          onPress={
            () => {
              if (item.player_type == player_type_wk) {
                show("Wicket Keeper cant be fielder");
                return;
              }
              var mteamData = this.state.mteamData;
              mteamData = this.clearSelection(mteamData, item.player_key);
              mteamData.fielder_player_key = item.player_key;
              this.setState({
                mteamData: mteamData
              });
            }
          }
        ><CustomText style={item.player_key == this.state.mteamData.fielder_player_key ? stylesCurrent.itemSelected : stylesCurrent.item}>
            F</CustomText>

        </TouchableOpacity>



      </View>
    </View>
  }
  saveTeam() {
    if (this.state.mteamData.vice_captain_player_key == undefined
      || this.state.mteamData.captain_player_key == undefined
      || this.state.mteamData.fielder_player_key == undefined) {
      return;
    }
    if (this.seconds == 0 || this.seconds < 0) {
      show("Deadline passed.");
      Actions.popTo('nav');
      return;
    }

    console.log("this.state.mteamData.captain_player_key " + this.state.mteamData.captain_player_key);
    console.log("this.state.mteamData.vice_captain_player_key " + this.state.mteamData.vice_captain_player_key);
    console.log("this.state.mteamData.fielder_player_key " + this.state.mteamData.fielder_player_key);

    this.setState({ loading: true });
    var bodyTxt = JSON.stringify(this.state.mteamData);
    console.log("body " + bodyTxt);
    var api = "teams/insert";
    if (this.props.isUpdating) {
      api = "teams/update";
    }

    console.log("APi " + api);

    fetch(GLOABAL_API + api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: bodyTxt

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response teams/bymatche" + JSON.stringify(responseJson));
        show(responseJson.message);
        EventBus.getInstance().fireEvent("updateContestTeams");

        this.setState({
          loading: false
        });
        if(this.props.fromCreateContest){
          Actions.ContestCreateSelectTeams({
            joiningFee:this.props.joiningFee,
             match_key:this.props.match_key,
           });

        }else if(this.props.fromSelectTeam){
          Actions.popTo('ContestCreateSelectTeams');
        }else{
          Actions.popTo('ContestsTab');
      
        }
       
      })
  }

  render() {
    var selected = this.state.selected;
    var continueOpacity = 0.5;
    if (this.state.mteamData.vice_captain_player_key == undefined
      || this.state.mteamData.captain_player_key == undefined
      || this.state.mteamData.fielder_player_key == undefined) {
      continueOpacity = 0.5;
    } else {
      continueOpacity = 1;

    }
    var VcStyle = stylesCurrent.item;
    var cStyle = stylesCurrent.item;
    var fielderStyle = stylesCurrent.item;

    if (this.state.mteamData.captain_player_key != undefined) {
      cStyle = stylesCurrent.itemSelectedRed;
    }
    if (this.state.mteamData.vice_captain_player_key != undefined) {
      VcStyle = stylesCurrent.itemSelectedRed;
    }
    if (this.state.mteamData.fielder_player_key != undefined) {
      fielderStyle = stylesCurrent.itemSelectedRed;
    }
    return (
      <View
        style={{ backgroundColor: Colors.app, flex: 1 }}>

        <MyToolbar
          title="Allotment"
          onBack={this.onBack}
        />
        <CustomText style={{ marginTop: 16, marginHorzontal: 16, marginBottom: 6, textAlign: "center", fontSize: 15, color: Colors.textDark }}>
          Choose your Captain , Vice Captain and Fielder
          </CustomText>
        <CustomText style={{ textAlign: "center", marginHorizontal: 16, marginBottom: 16, color: Colors.textLight }}>
          C gets 2x points, VC gets 1.5x points and F gets 1.25x points</CustomText>


        <View style={{ marginBottom: 6, alignSelf: "center", flexDirection: "row" }}>

          <CustomText style={cStyle}>C</CustomText>
          <CustomText style={VcStyle}>VC</CustomText>
          <CustomText style={fielderStyle}>F</CustomText>


        </View>

        {/* <View
          style={{

            borderColor: Colors.textLight, borderWidth: 0.2,
            paddingVertical: 8, backgroundColor: Colors.white,
            flexDirection: "row", justifyContent: "space-between"
          }}>



          <TouchableOpacity
            onPress={
              () => {

                selected.name = selected.name == 2 ? 1 : 2
                selected.points = 0;
                this.setState({
                  selected: selected
                });
              }
            }>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ fontSize: 11, marginStart: 64, }}>NAME</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.name)} />
            </View>
          </TouchableOpacity>



        </View> */}

        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 30 }}></View>}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          data={this.state.playerList}
          renderItem={({ item, index, separators }) => {
            return this.getItem(item);
          }
          }
        />




        <View style={{ position: "absolute", flexDirection: "row", bottom: 0, left: 0, right: 0, marginBottom: 30, justifyContent: "center" }}>

          <TouchableOpacity onPress={
            () => {
              this.saveTeam();
            }
          }>
            <CustomText style={[styles.myButtonText, {
              opacity: continueOpacity, backgroundColor: Colors.green
            }]}>Save Team</CustomText>
          </TouchableOpacity>

        </View>

        {this.state.loading ?

          <Loader /> : null}

      </View>


    )



  }

}


const stylesCurrent = StyleSheet.create({
  itemSelected: {
    backgroundColor: Colors.black,
    color: Colors.white,
    textAlign: "center",
    borderWidth: 0.2,
    borderColor: Colors.black,
    textAlignVertical: "center",
    width: 35, height: 35, borderRadius: 35 / 2, marginStart: 6

  },
  itemSelectedRed: {
    backgroundColor: Colors.dream11red,
    color: Colors.white,
    textAlign: "center",
    borderWidth: 0.2,
    borderColor: Colors.dream11red,
    textAlignVertical: "center",
    width: 35, height: 35, borderRadius: 35 / 2, marginStart: 6

  },
  item: {
    backgroundColor: Colors.app,
    color: Colors.textDark,
    textAlign: "center",
    textAlignVertical: "center",
    borderWidth: 0.2,
    borderColor: Colors.black,

    width: 35, height: 35, borderRadius: 35 / 2, marginStart: 6


  },

});
