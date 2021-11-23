import React, { Component } from 'react';
import { ImageBackground,BackHandler, Dimensions,ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/CustomText';
import Nodata from '../components/Nodata';
import ContestCard from '../components/ContestCard';
import MyToolbar from '../components/MyToolbar';
import { Actions } from 'react-native-router-flux';
import styles from '../components/styles';
import { show } from '../utils/Globals';
import { default as Colors, default as COLORS } from '../components/colors';
import Loader from '../components/Loader';
import YImageLoad from '../components/YImageLoad';
import * as constants from '../utils/constants';
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;


export default class TeamView extends Component {



  constructor(props) {
    super(props);
    this.state = {
      teamakey: this.props.teamaname,
      teambkey: this.props.teambname,
      captain_player_key: "",
      vice_captain_player_key: "",
      fielder_player_key: "",
      total_match_points: 0,
      response: {
      },
      ar: [],
      bowl: [],
      bats: [],
      wk: []
    }
  }



  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.loadDashboard();

  }
  componentWillUnmount() {

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

  }

  handleBackButton = () => {
    this.onBack();
    return true;
  }







  loadDashboard() {

    if (this.props.players) {
      this.initData(this.props.players);

    } else {

      console.log("this.props.team_id..." + this.props.team_id);
      this.setState({ loading: true });

      fetch(GLOABAL_API + 'teams/byteamid', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          Authorization: GLOBAL_TOKEN
        },
        body: JSON.stringify({
          team_id: this.props.team_id
        })

      })
        .then((response) => response.json())
        .then((responseJson) => {

          console.log("response  " + JSON.stringify(responseJson));
          this.setState({
            teamakey: responseJson.data.teams.a.key,
            teambkey: responseJson.data.teams.b.key,
            vice_captain_player_key: responseJson.data.vice_captain_player_key,
            fielder_player_key: responseJson.data.fielder_player_key,
            captain_player_key: responseJson.data.captain_player_key,
            total_match_points: responseJson.data.total_match_points
          });
          this.initData(responseJson.data.players);

        })
    }


  }


  initData(players) {
    console.log("PLayers list size " + players.length);
    var list = players;
    var listBowl = [];
    var listBats = [];
    var listAR = [];
    var listWK = [];

    for (var i = 0; i < list.length; i++) {
      var player = list[i];
      if (player.is_selected) {
        if (player.player_type == player_type_bowler) {
          listBowl.push(player);

        } else if (player.player_type == player_type_batsman) {
          listBats.push(player);
        } else if (player.player_type == player_type_ar) {
          listAR.push(player);
        } else if (player.player_type == player_type_wk) {
          listWK.push(player);
        }
      }
    }


    this.setState({
      loading: false,
      ar: listAR,
      wk: listWK,
      bowl: listBowl,
      bats: listBats
    });

  }
  onBack() {
    Actions.pop();
  }

  capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  getItem(player, marginValue) {
    var ext = "";
      ext = player.player_key;
   
    ext = ext.toLowerCase() + ".png";
    var date = new Date();
    var playerImage = {
      uri: constants.PLAYER_IMAGE + ext + "?a=" + date + ""
    };
    console.log("url "+constants.PLAYER_IMAGE + ext + "?a=" + date + "");
 
    var playerName = "";
    var arr = player.fullname.split(" ");
    playerName = arr[0].charAt(0).toUpperCase() + " " + this.capitalize(arr[1]);
    var bgColor = "#ff0000";
    var txtColor = "#ffffff";
    if (player.team_key == "a") {
      bgColor = Colors.black;
      txtColor = Colors.white;
    } else {
      bgColor = Colors.white;
      txtColor = Colors.black;
    }

    var myHeader = "";
    var points = player.points;
    if (player.player_key == this.state.vice_captain_player_key) {
      myHeader = "VC";
      points = player.points * 1.5;

    } else if (player.player_key == this.state.captain_player_key) {
      myHeader = "C"
      points = player.points * 2;

    } else if (player.player_key == this.state.fielder_player_key) {
      myHeader = "F"
      points = player.points * 1.25;

    } else {
      myHeader = ""
    }
    return <View style={{
      marginHorizontal: 10, marginTop: marginValue,
    }}>
      <View style={{ alignItems: "center" }}>

        {player.is_playing == 1 ? <View style={{ borderWidth: 0.5, borderColor: Colors.black, backgroundColor: Colors.red, width: 10, height: 10, borderRadius: 5 }} /> : null}
        {/* {player.is_playing == 2 ? <View style={{ borderWidth: 0.5, borderColor: Colors.black, backgroundColor: Colors.green, width: 10, height: 10, borderRadius: 5 }} /> : null} */}

        <YImageLoad
          style={{
            width: 38, height: 38
          }}
          placeholderSource={require('../images/player.png')} 
          yurl={constants.PLAYER_IMAGE + ext + "?a=" + date + ""} />


        <CustomText noOfLine={1} style={{
          fontWeight: "bold", color: txtColor,
          fontSize: 13, width: 60, height: 20,
          borderRadius: 3,
          backgroundColor: bgColor, textAlign: "center", textAlignVertical: "center"
        }}>
          {playerName}
        </CustomText>
        <CustomText style={{ fontSize: 12, color: "#000",fontWeight:"bold" }}>{isNaN(points) ? null : points}</CustomText>

      </View>
      {
        myHeader == "" ? null : <View style={stylesCurrent.circle}>

          <CustomText style={{ color: Colors.white, fontSize: 12 }}>{myHeader}</CustomText>
        </View>
      }

    </View>

  }


  render() {

    var bowlStyle = this.state.bowl.length > 4 ? stylesCurrent.myFlex2 : stylesCurrent.myFlex1;
    var batsStyle = this.state.bats.length > 4 ? stylesCurrent.myFlex2 : stylesCurrent.myFlex1;

    return (

      <ImageBackground source={require('../images/stadium.png')}  style={{ flex:1, width: width, height: height }}>

        <View
          style={{ flex: 1, alignItems: "center" }}
        >

          {/* <Image
            style={{
              resizeMode:"cover",
              position: "absolute",
              width: width, height: height
            }}
            source={require('../images/stadium.png')} /> */}

          <View style={{ flex: 1, width: "100%" }}>
            <View style={{ alignItems: "center", flex: 1 }}>

              <View style={{ flex: 1, alignItems: "center" }}>


                <CustomText style={{ fontSize: 10, marginTop: 20, color: Colors.black }}>{constants.WicketKeeper}</CustomText>
                <FlatList
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state}
                  data={this.state.wk}
                  renderItem={({ item, index, separators }) =>
                    this.getItem(item, 0)
                  }
                />
              </View>
              <View style={batsStyle}>
                <CustomText style={{ fontSize: 10, marginVertical: 3, color: Colors.black }}>{constants.BATSMEN}</CustomText>
                <FlatList
                  contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  numColumns={4}
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.bats}
                  renderItem={({ item, index, separators }) =>
                    this.getItem(item, 6)
                  }
                />
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <CustomText style={{ fontSize: 10, marginVertical: 3, color: Colors.black }}>{constants.ALLROUNDER}</CustomText>
                <FlatList
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.ar}
                  renderItem={({ item, index, separators }) =>
                    this.getItem(item, 0)
                  }
                />
              </View>
              <View style={bowlStyle}>
                <CustomText style={{ fontSize: 10, marginVertical: 3, color: Colors.black }}>{constants.BOWLER}</CustomText>

                <FlatList
                  contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  numColumns={4}
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.bowl}
                  renderItem={({ item, index, separators }) =>
                    this.getItem(item, 6)
                  }
                />
              </View>
            </View>



          </View>


          <View style={{
            flexDirection: "row", margin: 6, position: "absolute", top: 0, right: 0
          }}>

            <TouchableOpacity
              style={{ marginEnd: 4 }}
              onPress={this.onBack} >
              <Image style={{
                width: undefined, height: 20, aspectRatio: 1
              }}
                source={require('../images/ic_cross.png')} />
            </TouchableOpacity>

          </View>

        </View>


        {
          this.props.toRefresh ? <View style={{ width: "100%", backgroundColor: Colors.black, flexDirection: "row", padding: 6, justifyContent: "space-between", alignItems: "center" }}>


            <View style={{ marginStart: 12 }}>
              <CustomText style={{ color: Colors.textLight, fontWeight: "bold" }}>Total Points   </CustomText>
              <CustomText style={{ color: "#fff", fontWeight: "bold" }}>{this.state.total_match_points} </CustomText>

            </View>

            <TouchableOpacity
              style={{ marginEnd: 12 }}
              onPress={this.loadDashboard.bind(this)}><Image style={{
                width: undefined, height: 20, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
              }}
                source={require('../images/refresh.png')} />

            </TouchableOpacity>


          </View> : null

        }

        {this.state.loading ?

          <Loader /> : null}

      </ImageBackground>
    )



  }

}




const stylesCurrent = StyleSheet.create({

  myFlex2: {
    flex: 1.5, alignItems: "center"
  },
  myFlex1: {
    flex: 1, alignItems: "center"
  },

  circle: {
    width: 20, height: 20,
    position: "absolute",
    backgroundColor: Colors.black, color: Colors.white,
    alignContent: "center", flexDirection: "row",
    justifyContent: "center", alignItems: "center",
    borderColor: Colors.white, borderWidth: 1, borderRadius: 20 / 2
  }


});