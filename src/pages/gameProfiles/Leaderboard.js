import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbar from '../../components/MyToolbar';
import styles from '../../components/styles';
import { show } from '../../utils/Globals';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Nodata from '../../components/Nodata';
import { add } from 'react-native-reanimated';
import Loader from '../../components/Loader';

export default class Leaderboard extends Component {


  constructor(props) {
    super(props);
    this.state = {
      onStart: true,
      loadingEditTeam: false,
      selected: {
        name: 0,
        points: 0,
        rank: 1
      },
      response: null
    }
  }



  componentDidMount() {

    EventBus.getInstance().addListener("refreshLeaderboard",
      this.listener = player => {
        this.loadDashboard();
      })


    this.loadDashboard()
  }




  loadDashboard() {


    this.setState({ loading: true });

    var api = "matchcontests/live_leaderboard";
    if (this.props.fromCompleted) {
      api = "matchcontests/completed_leaderboard";
    }
    console.log("API " + api);
    console.log("TOKEN " + GLOBAL_TOKEN);
    console.log(" this.props.matchcontest_id " + this.props.matchcontest_id);

    fetch(GLOABAL_API + api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        matchcontest_id: this.props.matchcontest_id,
        startindex: 0,
        length: 1000
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        EventBus.getInstance().fireEvent("scorecardLeaderboard", null
        )
        console.log("response  leaderboard " + JSON.stringify(responseJson));
        this.setState({ onStart: false, loading: false, response: responseJson.data });
      })

  }


  getEditIcon(isMyTeam, team_id) {
    return isMyTeam ? <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={
          () => {
            this.setState({
              loadingEditTeam: true
            });
            fetch(GLOABAL_API + 'teams/byteamid', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                Authorization: GLOBAL_TOKEN
              },
              body: JSON.stringify({
                team_id: team_id
              })

            })
              .then((response) => response.json())
              .then((responseJson) => {

                console.log("response  " + JSON.stringify(responseJson));
                responseJson = responseJson.data;
                this.setState({
                  loadingEditTeam: false
                });

                Actions.CreateTeam({
                  date: this.props.date,
                  match_key: responseJson.match_key,
                  _id: responseJson._id,
                  isUpdating: true,
                  players: responseJson.players,
                  username: responseJson.username,
                  teams: responseJson.teams,
                  captain_player_key: responseJson.captain_player_key,
                  vice_captain_player_key: responseJson.vice_captain_player_key,
                  fielder_player_key: responseJson.fielder_player_key
                });
              })

          }
        }
      >
        <Image
          tintColor={Colors.black}
          style={{
            width: 20, height: 20,
          }}
          source={require('../../images/ic_edit.png')} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {

          this.setState({
            loadingEditTeam: true
          });
          fetch(GLOABAL_API + 'teams/byteamid', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json',
              Authorization: GLOBAL_TOKEN
            },
            body: JSON.stringify({
              team_id: team_id
            })

          })
            .then((response) => response.json())
            .then((responseJson) => {

              console.log("response  " + JSON.stringify(responseJson));
              responseJson = responseJson.data;
              this.setState({
                loadingEditTeam: false
              });

              Actions.SelectTeamsSwitch({
                date: this.props.date,
                match_key: responseJson.match_key,
                matchcontestid: this.props.matchcontest_id,
                old_team_id: responseJson._id
              });


            })




        }}
        style={{ marginStart: 16 }}
      >
        <Image
          tintColor={Colors.black}
          style={{
            width: 20, height: 20,
          }}
          source={require('../../images/switch.png')} />
      </TouchableOpacity>
    </View> : null


  }

  getItem(isMyTeam, bgColor, item, index) {

    console.log("ITEM " + JSON.stringify(item));
    var amountString = "";
    if (this.props.fromCompleted) {
      amountString = "WON " + RUPPE + "" + item.pay_amount + "";
    } else {
      amountString = "WINNING " + RUPPE + "" + item.pay_amount + "";
    }
    return <TouchableOpacity
      onPress={
        () => {
          this.onSelect(item, index);
        }
      }
    >
      <View style={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: bgColor, marginBottom: 2 }}>

        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <View>
            <Image style={{

              backgroundColor: Colors.dream11Bg, borderRadius: 15, marginEnd: 16, width: undefined, height: 30, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
            }}
              source={{ uri: item.image_url }}
            />
          </View>

          <View>
            <CustomText style={{ fontSize: 13 }}>{item.name}</CustomText>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ fontSize: 13 }}>({item.team_order_key})</CustomText>

              {this.props.fromContestDetails ? null : <View style={{ justifyContent: "center", }}>
                {item.pay_amount > 0 ?
                  <CustomText style={{ color: COLORS.green, fontSize: 10, marginStart: 6 }}>{amountString}</CustomText> : null}
              </View>}



            </View>
          </View>
        </View>
        {this.props.fromContestDetails ? this.getEditIcon(isMyTeam, item.team_id) : <CustomText style={{ textAlign: "center", flex: 1, color: "#9e9e9e" }}>{item.total_match_points}</CustomText>}
        {this.props.fromContestDetails ? null : <CustomText style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>{item.rank}</CustomText>}

      </View>
    </TouchableOpacity>

  }

  updatePLayerItemSelection(player) {
    var list = this.state.response;
    player.selected = !player.selected;
    this.setState({
      response: list
    });
  }


  onSelect(mItem, mInd) {
    if (this.props.fromContestDetails) {
      return;
    }
    console.log("onSelect " + JSON.stringify(mItem));
    Actions.TeamView({
      team_id: mItem.team_id,
      toRefresh: true
    });
  }


  getUpDownIcon(number) {
    if (number == 1) {
      return require('../../images/ic_arrow_up.png');
    } else if (number == 2) {
      return require('../../images/ic_arrow_down.png');
    } else if (number == 0) {
      return null;
    }
    return null;
  }


  getMyTeam(showMyTeam) {
    if (showMyTeam) {
      return (
        <FlatList

          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.response.myteams}

          renderItem={({ item, index, separators }) =>
            this.getItem(true, Colors.greenLight, item, index)
          }
        />
      )
    }
  }

  getNoData() {
    return (<View style={{ height: "100%" }}>
      {Nodata()}
    </View>);
  }
  render() {

    var shoNodata = false;
    var showMyTeam = false;
    var showOtherTeam = false;
    var amount = 0;
    if (this.state.response != null) {
      try {
        if (this.state.response.otherteams.length == 0 &&
          this.state.response.myteams.length == 0) {
          shoNodata = true;
        }

      } catch (e) {

      }


      if (this.state.response.myteams != null) {
        var myArray = this.state.response.myteams;
        if (myArray.length > 0) {
          showMyTeam = true;
          for (var i = 0; i < myArray.length; i++) {
            var item = myArray[i];
            var temp_amount = item.pay_amount;
            if (Number.isInteger(temp_amount)) {
              amount = amount + temp_amount;
            }
          }

          EventBus.getInstance().fireEvent("youwon", amount)
        }
      }

      if (this.state.response.otherteams != null) {
        if (this.state.response.otherteams.length > 0) {
          showOtherTeam = true;
        }
      }
    }

    var selected = this.state.selected;

    return (
      <View
        style={{ backgroundColor: Colors.app, flex: 1 }}>

        {this.props.fromContestDetails ? null : <View style={{
          borderColor: Colors.textLight, borderWidth: 0.2,
          paddingHorizontal: 16,
          paddingVertical: 8, backgroundColor: Colors.white,
          flexDirection: "row", justifyContent: "space-between"
        }}>



          <TouchableOpacity
            style={{ flex: 2 }}
            onPress={
              () => {

                selected.name = selected.name == 2 ? 1 : 2
                selected.points = 0;
                selected.rank = 0;
                this.setState({
                  selected: selected
                });
              }
            }>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CustomText style={{ fontSize: 11, color: "#9e9e9e" }}>NAME</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.name)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.points = selected.points == 2 ? 1 : 2
                selected.name = 0;
                selected.rank = 0;
                this.setState({
                  selected: selected
                });
              }
            }
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CustomText style={{ marginStart: 32, fontSize: 11, color: "#9e9e9e" }}>POINTS</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.points)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.rank = selected.rank == 2 ? 1 : 2
                selected.name = 0;
                selected.points = 0;
                this.setState({
                  selected: selected
                });
              }
            }
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CustomText style={{ fontSize: 11, color: "#9e9e9e" }}>RANK</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.rank)} />
            </View>
          </TouchableOpacity>

        </View>
        }

        {this.state.response != null ? <View style={{ flex: 1 }}>

          {shoNodata ? this.getNoData() : null}

          {showOtherTeam ?
            <FlatList

              refreshControl={
                <RefreshControl refreshing={this.state.loading
                } onRefresh={this.loadDashboard.bind(this)} />
              }
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={this.getMyTeam(showMyTeam)}
              ListFooterComponent={<View style={{ height:20}}></View>}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.response.otherteams.sort((a, b) => {

                var selected = this.state.selected;
                if (selected.name == 1) {
                  return a.name.localeCompare(b.name);
                } else if (selected.name == 2) {
                  return b.name.localeCompare(a.name);

                } else if (selected.points == 1) {
                  return parseFloat(a.total_match_points) > parseFloat(b.total_match_points)

                } else if (selected.points == 2) {
                  return parseFloat(b.total_match_points) > parseFloat(a.total_match_points)

                } else if (selected.rank == 1) {
                  return a.rank > b.rank

                } else if (selected.rank == 2) {
                  return b.rank > a.rank;
                }
                return a.rank > b.rank

              })}
              renderItem={({ item, index, separators }) =>
                this.getItem(false, Colors.white, item, index)
              }
            /> : null




          }


        </View> : null}

        {
          this.state.loadingEditTeam || this.state.onStart ? <Loader /> : null
        }

      </View>


    )



  }

}


