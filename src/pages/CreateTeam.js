import React, { Component } from 'react';
import { BackHandler, Alert, StatusBar, Animated, Dimensions, ActivityIndicator, FlatList, Image, Keyboard, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../components/Capsule';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import CreateTeamInner from './CreateTeamInner';
import * as Animatable from 'react-native-animatable';
import { getPLayerByCategory, getPLayerByTeamType, getSelectedPlayers } from '../utils/Globals';
import Loader from '../components/Loader';
import { getSeconds } from '../utils/Globals';
import ContestCreateBreakup from "./ContestCreateBreakup";
import styles from '../components/styles';
import YImageLoad from '../components/YImageLoad';
import { show } from '../utils/Globals';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { Wave } from 'react-animated-text';
import Constants from 'expo-constants';




export default class CreateTeam extends Component {

  defaultMess = selectWK;


  animMessageView = ref => this.view = ref;
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(0.3);
    this.state = {
      image1: require('../images/trophy.png'),
      image2: require('../images/trophy.png'),
      teams: {},
      teamACount: 0,
      teamBCount: 0,
      index: 0,
      players: [],
      selected: {
        name: 0,
        points: 0,
        credits: 2
      },
      credit_value: 100,
      playersSelected: 0,
      wkSelected: 0,
      batSelected: 0,
      arSelected: 0,
      bowlSelected: 0,
      message: this.defaultMess,

      loading: true,
      response: null,
      greenList: [
        { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false },
      ]
    }
  }
  componentDidMount() {
    this.seconds = getSeconds(this.props.date);
    console.log("create team sec " + this.seconds);

    this.myinerverl = setInterval(() => {

      this.seconds = (this.seconds - 1);
      if (this.seconds == 0) {
        clearInterval(this.myinerverl);
      }
    }, 1000);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.loadDashboard();
  }


  componentWillUnmount() {

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    EventBus.getInstance().removeListener(this.listener);
  }

  loadDashboard() {


    this.setState({ loading: true });
    if (this.props.players) {
      var players = this.props.players;
      var teams = this.props.teams;
      this.initState(players, teams);


    } else {
      var bodyTxt = JSON.stringify({
        match_key: this.props.match_key
      });
      console.log("bodTxt " + bodyTxt);

      fetch(GLOABAL_API + 'teams/bymatch', {
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
          var players = responseJson.data.players;
          var teams = responseJson.data.teams;

          this.initState(players, teams);


        })
    }


  }


  onError1() {
    this.setState({ image1: require('../images/trophy.png') })
  }
  onError2() {
    this.setState({ image2: require('../images/trophy.png') })
  }

  initState(players, mteams) {
    console.log("yash team " + mteams.a.image);
    this.setState({
      loading: true
    });
    var teamACount = getPLayerByTeamType(true, players, "a").length;
    var teamBCount = getPLayerByTeamType(true, players, "b").length;
    this.setState({
      image1: { uri: mteams.a.image },
      image2: { uri: mteams.b.image }
    });
    var selectedSortObject = this.state.selected;
    this.setState({
      teamACount: teamACount,
      teamBCount: teamBCount,
      players: players,
      teams: mteams,
      response: players,
      routesPath: {
        first: () => <CreateTeamInner

          list={getPLayerByCategory(false, players, player_type_wk)}
          selected={selectedSortObject}
          checkBeforeSelectingPLayer={this.checkBeforeSelectingPLayer.bind(this)}
          aName={mteams.a.short_name}
          bName={mteams.b.short_name}
        />,
        second: () => <CreateTeamInner
          list={getPLayerByCategory(false, players, player_type_batsman)}
          selected={selectedSortObject}
          checkBeforeSelectingPLayer={this.checkBeforeSelectingPLayer.bind(this)}
          aName={mteams.a.short_name}
          bName={mteams.b.short_name}
        />,
        third: () => <CreateTeamInner
          list={getPLayerByCategory(false, players, player_type_ar)}
          selected={selectedSortObject}
          checkBeforeSelectingPLayer={this.checkBeforeSelectingPLayer.bind(this)}
          aName={mteams.a.short_name}
          bName={mteams.b.short_name}
        />,
        fourth: () => <CreateTeamInner
          list={getPLayerByCategory(false, players, player_type_bowler)}
          selected={selectedSortObject}
          checkBeforeSelectingPLayer={this.checkBeforeSelectingPLayer.bind(this)}
          aName={mteams.a.short_name}
          bName={mteams.b.short_name}
        />,
      },
      routes: [
        { key: 'first', title: 'WK' },
        { key: 'second', title: 'BAT' },
        { key: 'third', title: 'AR' },
        { key: 'fourth', title: 'BOWL' }

      ],
    }, () => {
      this.updateGreenList();
    });
  }


  handleBackButton = () => {
    this.onBackPress();
    return true;
  }



  reset() {
    Alert.alert(
      'Clear Team',
      'Are you sure you want to clear your player selections?', [{
        text: 'CANCEL',
        onPress: console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'CLEAR',
        onPress: () => {

          this.setState({
            loading: true
          });
          var players = this.state.players;
          var list = players;
          for (var i = 0; i < list.length; i++) {
            var player = list[i];
            player.is_selected = false;
          }

          this.initState(players, this.state.teams);

          // this.setState({
          //   message: this.defaultMess,
          //   credit_value: 100,
          //   playersSelected: 0,
          //   wkSelected: 0,
          //   batSelected: 0,
          //   arSelected: 0,
          //   bowlSelected: 0,
          //   teamACount:0,
          //   teamBCount:0,
          //   greenList: [
          //     { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false },
          //   ]
          // });

        }
      },], {
      cancelable: false
    }
    )

  }

  onBackPress() {
    var txt = this.props.isUpdating ? 'DISCARD CHANGES' : 'DISCARD TEAM';
    Alert.alert(
      'Go Back?',
      'This Team will not be saved!', [{
        text: 'CONTINUE EDITING',
        onPress: console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: txt,
        onPress: () => {
          Actions.pop();
        }
      },], {
      cancelable: true
    }
    )

  }

  spring() {
    this.springValue.setValue(0.3)
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1
      }
    ).start()
  }

  checkBeforeSelectingPLayer(player) {

    var playersSelected = this.state.playersSelected;
    var credit_value = this.state.credit_value;
    var messageTemp = this.state.message;

    if (player.is_selected) {
      player.is_selected = false;

      // for (Player p : teamCreationModel.players) {
      //   if (p.player_key.equalsIgnoreCase(player.player_key)) {
      //     p = player;
      //     teamCreationModel.credits_left = teamCreationModel.credits_left + player.credit_value;
      //   }
      // }
      //setDefaultHeader(teamCreationModel, player);

    } else {
      if (playersSelected == 11) {
        messageTemp = "11 player selected , tap continue";
        this.updateMessge(messageTemp);
        return false;
      }
      if (credit_value < player.credit_value) {
        messageTemp = "Not enough credits";
        this.updateMessge(messageTemp);
        return false;
      }
      if (player.team_key == "a") {

        if (getPLayerByTeamType(true, this.state.players, "a").length >= 7) {
          messageTemp = "You can select only 7 from each team";
          this.updateMessge(messageTemp);
          return false;
        }
      } else {
        if (getPLayerByTeamType(true, this.state.players, "b").length >= 7) {
          messageTemp = "You can select only 7 from each team";
          this.updateMessge(messageTemp);
          return false;
        }
      }
      var canAdd = this.checkMaxLimit(player);
      console.log("player canAdd " + canAdd);
      if (!canAdd) {
        return false;
      } else {
        var canAddMin = this.canMinLimit(player);
        console.log("player canAddMin " + canAddMin);
        if (!canAddMin) {
          return false;
        }
      }
      player.is_selected = true;

      // for (Player p : teamCreationModel.players) {
      //   if (p.player_key.equalsIgnoreCase(player.player_key)) {
      //     //p = player;
      //     teamCreationModel.credits_left = teamCreationModel.credits_left - player.credit_value;
      //   }
      // }
      // setDefaultHeader(teamCreationModel, player);

    }

    this.updateGreenList();
    return true;

  }

  updateMessge(mess) {
    this.setState({
      message: mess
    });
    this.view.shake(800);
  }

  checkMaxLimit(player) {
    var messageTemp = this.state.message;
    if (player.player_type == player_type_wk) {
      if (TEAM_WK_MAX == this.state.wkSelected) {
        messageTemp = team_error_wicket_keepers_max;
        this.updateMessge(messageTemp);
        return false;
      } else {
        messageTemp = "";
      }
    } else if (player.player_type == player_type_bowler) {
      if (TEAM_BOWLER_MAX == this.state.bowlSelected) {
        messageTemp = team_error_bowler_max;
        this.updateMessge(messageTemp);
        return false;
      } else {
        messageTemp = "";
      }
    } else if (player.player_type == player_type_batsman) {
      if (TEAM_BAT_MAX == this.state.batSelected) {
        messageTemp = team_error_batsman_max;
        this.updateMessge(messageTemp);
        return false;
      } else {
        messageTemp = "";
      }
    } else if (player.player_type == player_type_ar) {
      if (TEAM_ALL_ROUNDER_MAX == this.state.arSelected) {
        messageTemp = team_error_allrounder_max;
        this.updateMessge(messageTemp);
        return false;
      } else {
        messageTemp = "";
      }
    }

    return true;
  }


  canMinLimit(player) {
    var message = this.state.message;
    var leftSpaces = 11 - this.state.playersSelected;
    var ar_min_req = TEAM_ALL_ROUNDER_MIN - this.state.arSelected;
    var bat_min_req = TEAM_BAT_MIN - this.state.batSelected;
    var bowl_min_req = TEAM_BOWLER_MIN - this.state.bowlSelected;
    var wk_min_req = TEAM_WK_MIN - this.state.wkSelected;

    if (ar_min_req < 0) {
      ar_min_req = 0;
    }
    if (bat_min_req < 0) {
      bat_min_req = 0;
    }
    if (bowl_min_req < 0) {
      bowl_min_req = 0;
    }
    if (wk_min_req < 0) {
      wk_min_req = 0;
    }

    var totalMinRequired = ar_min_req + bat_min_req + bowl_min_req + wk_min_req;
    console.log("totalMinRequired .. " + totalMinRequired);
    console.log("leftSpaces .. " + leftSpaces);
    console.log("player.player_type .. " + player.player_type);

    if (leftSpaces < (totalMinRequired + 1)) {


      if (player.player_type == player_type_batsman) {
        if (this.state.batSelected < TEAM_BAT_MIN) {
          return true;
        }
      } else if (player.player_type == player_type_bowler) {
        if (this.state.bowlSelected < TEAM_BOWLER_MIN) {
          return true;
        }
      } else if (player.player_type == player_type_ar) {
        if (this.state.arSelected < TEAM_ALL_ROUNDER_MIN) {
          return true;
        }
      } else if (player.player_type == player_type_wk) {
        if (this.state.wkSelected < TEAM_WK_MIN) {
          return true;
        }
      }

      if (this.state.arSelected < TEAM_ALL_ROUNDER_MIN && !(player.player_type == player_type_ar)) {
        message = team_error_allrounder_min;
        this.updateMessge(message);
        return false;
      } else if (this.state.wkSelected < TEAM_WK_MIN && !(player.player_type == player_type_wk)) {
        message = team_error_wicket_keepers_min;
        this.updateMessge(message);
        return false;

      } else if (this.state.bowlSelected < TEAM_BOWLER_MIN && !(player.player_type == player_type_bowler)) {
        message = team_error_bowler_min;
        this.updateMessge(message);
        return false;

      } else if (this.state.batSelected < TEAM_BAT_MIN && !(player.player_type == player_type_batsman)) {
        message = team_error_batsman_min;
        this.updateMessge(message);
        return false;
      } else {
        message = "";
      }
    }
    return true;
  }




  updateGreenList() {
    var count = this.getSelectedCountByUpdating();
    console.log("updateGreenList " + count);
    var list = this.state.greenList;
    for (var i = 0; i < 11; i++) {
      var greenIcon = list[i];
      if (i < count) {
        greenIcon.selected = true;

      } else {
        greenIcon.selected = false;
      }

    }
    this.setState({
      greenList: list,
      playersSelected: count,
      loading: false
    });
  }
  getSelectedCountByUpdating() {

    var list = this.state.players;
    var count = 0;
    var countBAT = 0;
    var countBOWL = 0;
    var countAR = 0;
    var countWK = 0;
    var credit_value = 0;
    var teamACount = getPLayerByTeamType(true, list, "a").length;
    var teamBCount = getPLayerByTeamType(true, list, "b").length;

    for (var i = 0; i < list.length; i++) {
      var player = list[i];

      if (player.is_selected) {
        count++;
        if (player.player_type == player_type_batsman) {
          countBAT++;
        } else if (player.player_type == player_type_ar) {
          countAR++;
        } else if (player.player_type == player_type_bowler) {
          countBOWL++;
        } else if (player.player_type == player_type_wk) {
          countWK++;
        }
        credit_value = credit_value + player.credit_value;
      } else {
      }


    }

    var credit_value_final = 100 - credit_value;
    this.setState({
      teamACount: teamACount,
      teamBCount: teamBCount,
      wkSelected: countWK,
      batSelected: countBAT,
      arSelected: countAR,
      bowlSelected: countBOWL,
      credit_value: credit_value_final
    })
    return count;
  }

  seconds = 0;
  componentWillMount() {




    this.updateGreenList();
    EventBus.getInstance().addListener("updateCredits",
      this.listener = player => {
        this.updateGreenList();
      })

  }

  getRouteTitle(title) {
    if (title == "AR") {
      title = "(" + this.state.arSelected + ")";
    } else if (title == "BOWL") {
      title = "(" + this.state.bowlSelected + ")";
    } else if (title == "BAT") {
      title = "(" + this.state.batSelected + ")";
    } else if (title == "WK") {
      title = "(" + this.state.wkSelected + ")";
    }
    return title;

  }
  onBack = () => {
    this.onBackPress();
  }
  onSelect = () => {
  }


  render() {
    var continueOpacity = ((this.state.playersSelected == 11) ? 1.0 : 0.5);
    return (
      <View
        style={{
          backgroundColor: Colors.app, flex: 1, justifyContent: 'center'
          , alignContent: "center",
        }}>


        {this.state.response == null ? null :
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Colors.black, height: "26%" }}>


              <TouchableOpacity
                onPress={this.onBack}>

                <Image style={{
                  marginTop: 16,
                  marginStart: 16, width: undefined, height: 20, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
                }}
                  source={require('../images/back_white.png')} />

              </TouchableOpacity>


              <CustomText style={{ marginTop: -16, color: Colors.white, fontWeight: "bold", textAlign: "center" }}>Max 7 Players from a team</CustomText>

              <View style={{ flex: 1, justifyContent: "center" }}>

                <View
                  style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginHorizontal: 16 }}
                >
                  <View>

                    <CustomText style={{ color: Colors.textLight }}>Players</CustomText>

                    <View style={{ flexDirection: "row",alignItems:"baseline" }}>
                      <CustomText style={{ color: Colors.white, fontWeight: "bold", fontSize: 20, textAlignVertical: "bottom", }}>{this.state.playersSelected}</CustomText>
                      <CustomText style={{ color: Colors.textLight, textAlignVertical: "bottom", fontSize: 11,  }}>/11</CustomText>
                    </View>
                  </View>


                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <YImageLoad

                      style={{
                        marginEnd: 16,
                        width: undefined, height: 40, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
                      }}

                      placeholderSource={require('../images/trophy.png')}
                      yurl={
                        this.state.teams.a.image
                      } />

                    <View style={{  }}>


                      <CustomText style={{ color: Colors.textLight, fontSize: 11, }}>{this.state.teams.a.short_name}</CustomText>

                      <CustomText style={{ color: Colors.white, fontWeight: "bold", textAlign: "left" }}>{this.state.teamACount}</CustomText>

                    </View>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center"  }}>

                    <View style={{  }}>


                      <CustomText style={{ color: Colors.textLight, fontSize: 11, }}>{this.state.teams.b.short_name}</CustomText>

                      <CustomText style={{ color: Colors.white, fontWeight: "bold", textAlign: "right" }}>{this.state.teamBCount}</CustomText>

                    </View>
                    <YImageLoad
                      style={{
                        marginStart: 16,
                        width: 40, height: undefined, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
                      }}
                      placeholderSource={require('../images/trophy.png')}
                      yurl={this.state.teams.b.image} />
                  </View>
                  <View>


                    <CustomText style={{ color: Colors.textLight }}>Credits</CustomText>

                    <CustomText style={{ color: Colors.white, fontWeight: "bold", fontSize: 20, textAlign: "right", alignItems: "baseline" }}>{this.state.credit_value}</CustomText>

                  </View>
                </View>

              </View>
              <View
                style={{ alignItems: "center", flexDirection: "row", marginHorizontal: 16, marginBottom: 16 }}
              >

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state}
                  data={this.state.greenList}
                  renderItem={({ item, index, separators }) => {
                    var bgColor = item.selected ? Colors.green : Colors.white;
                    return <View style={{ backgroundColor: bgColor, width: 18, height: 15, marginEnd: 6, }}>
                    </View>
                  }

                  }
                />

                <TouchableOpacity
                  onPress={this.reset.bind(this)}>

                  <Image style={{

                    width: undefined, height: 23, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
                  }}
                    source={require('../images/ic_clear.png')} />

                </TouchableOpacity>







              </View>

            </View>




            <View style={{
              paddingVertical: 6, backgroundColor: Colors.dream11red,
              justifyContent: "center", alignItems: "center"
            }}>
              <Animatable.Text
                ref={this.animMessageView}
                style={{
                  paddingVertical: 6, backgroundColor: Colors.dream11red,
                  fontSize: 16,
                  textBreakStrategy: "simple",
                  fontFamily: 'myfont',
                  color: Colors.white, fontWeight: "bold",
                  justifyContent: "center", alignItems: "center", textAlign: "center"
                }}>
                {this.state.message}


              </Animatable.Text>
            </View>



            <TabView
              swipeEnabled={true}
              style={{ flex: 1 }}
              navigationState={this.state}
              renderScene={SceneMap({
                first: (route) => this.renderScene(route),
                second: (route) => this.renderScene(route),
                third: (route) => this.renderScene(route),
                fourth: (route) => this.renderScene(route),

              })}
              renderScene={SceneMap(
                this.state.routesPath)}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: Colors.button }}
                  style={{ backgroundColor: Colors.white }}
                  renderLabel={({ route }) => (
                    <View style={{ flexDirection: "row" }}>
                      <CustomText style={{
                        fontSize: 14, textAlignVertical: 'bottom', fontWeight: "bold",
                        color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                          Colors.textDark : Colors.textlightCreateTeam
                      }}>
                        {route.title}
                      </CustomText>
                      <CustomText style={{
                        marginStart: 3,
                        marginBottom: 1,
                        fontSize: 12, textAlignVertical: 'bottom', fontWeight: "bold",
                        color: Colors.textlightCreateTeam
                      }}>
                        {this.getRouteTitle(route.title)}
                      </CustomText>
                    </View>
                  )}

                />
              )}
              onIndexChange={
                (ind) => {
                  var mMessage = selectWK;
                  if (ind == 0) {
                    mMessage = selectWK;
                  } else if (ind == 1) {
                    mMessage = selectBAT;
                  } else if (ind == 2) {
                    mMessage = selectAR;
                  } else if (ind == 3) {
                    mMessage = selectBOWL;
                  }
                  this.setState({
                    index: ind
                  });
                  this.updateMessge(mMessage);
                  // this.setState({ index: ind }, () => {
                  //   this.refreshTabs(this.state.response.data[this.state.selectedIndex]._id)
                  // });
                }
              }
              initialLayout={{ width: Dimensions.get('window').width }}
            />



            <View style={{ position: "absolute", flexDirection: "row", bottom: 0, left: 0, right: 0, marginBottom: 25, justifyContent: "center" }}>
              <TouchableOpacity
                onPress={
                  () => {
                    Actions.TeamView(
                      {
                        teamaname: this.state.teams.a.key,
                        teambname: this.state.teams.b.key,
                        players: this.state.players
                      }
                    );
                  }
                }>
                <CustomText style={[styles.myButtonText, { backgroundColor: Colors.green, marginEnd: 16 }]}>PREVIEW</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  () => {
                    if (this.state.playersSelected != 11) {
                      return;
                    }
                    Actions.TeamCaptainAllotment(
                      {
                        joiningFee:this.props.joiningFee,
                        fromSelectTeam:this.props.fromSelectTeam,
                        fromCreateContest:this.props.fromCreateContest,
                        _id: this.props._id,
                        date: this.seconds,
                        isUpdating: this.props.isUpdating,
                        username: this.props.username,
                        teams: this.state.teams,
                        match_key: this.props.match_key,
                        credits_left: this.state.credit_value,
                        players: this.state.players,
                        captain_player_key: this.props.captain_player_key,
                        vice_captain_player_key: this.props.vice_captain_player_key,
                        fielder_player_key: this.props.fielder_player_key
                      }
                    );
                  }
                }>
                <CustomText style={[styles.myButtonText, {
                  opacity: continueOpacity, backgroundColor: Colors.green,
                }]}>CONTINUE</CustomText>
              </TouchableOpacity>

            </View>




          </View>
        }

        {this.state.loading ?

          <ActivityIndicator
            style={{
              position: "absolute",
              height: 50, width: 50, alignContent: "center", alignItems: "center", alignSelf: 'center'
              , justifyContent: 'center', backgroundColor: COLORS.appdark, borderRadius: 10
            }}
            color={Colors.black}
            size="large"
          /> : null}
      </View>
    )



  }

}


