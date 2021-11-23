import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity, Text, View, Image } from 'react-native';
import EventBus from 'react-native-event-bus';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbarContests from '../../components/MyToolbarContests';
import Contest from './Contest';
import MyContest from './MyContest';
import Leaderboard from './Leaderboard';
import ContestDetails from './ContestDetails';


import { Actions } from 'react-native-router-flux';
import { ProgressBar } from 'react-native-paper';




export default class LeaderBoardTab extends Component {


  state = {
    showYouwon:0,
    team1: "",
    team2: "",
    inning1: "",
    inning2: "",
    result: "",
    index: 1,
    routesPath: {
      first: () => <ContestDetails
        prize_formula={this.props.mItem.prize_formula}
        matchcontest_id={this.props.mItem.matchcontest_id}
      />,
      second: () => <Leaderboard
        fromCompleted={this.props.fromCompleted}
        matchcontest_id={this.props.mItem.matchcontest_id} 
        match_key={this.props.mItem.match_key} 
        />,

    },
    routes: [
      { key: 'first', title: 'Prize Breakup' },
      { key: 'second', title: 'Leaderboard' },
    ],
    response: {

    }
  }
  myContest = null;

  loadScoreCard() {
    fetch(GLOABAL_API + 'matches/scorecard', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        match_key: this.props.mItem.match_key
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response  contestTabCompleted " + JSON.stringify(responseJson));
        this.setState({
          inning1: responseJson.data.inning1,
          inning2: responseJson.data.inning2,
          team1: responseJson.data.team1,
          team2: responseJson.data.team2,
          result: responseJson.data.result,
        });
      })
  }

  constructor(props) {
    super(props);
    console.log("leaderboard componentDidMount .. " + JSON.stringify(this.props.mItem));
    this.loadScoreCard();

  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  componentDidMount() {
    EventBus.getInstance().addListener("scorecardLeaderboard",
      this.listener = player => {
        this.loadScoreCard();
      })

      EventBus.getInstance().addListener("youwon",
      this.listener = amount => {
          this.setState({
            showYouwon:amount
          });
      })
  }

  onBack = () => {
    console.log("onBack..ContestsTab");
    Actions.pop();
  }


  render() {
    const heading = this.props.isLive ? "LIVE" : "COMPLETED";
    const dotColor = this.props.isLive ? Colors.dream11red : Colors.green;
   
    return (

      <View

        style={{
          flex: 1,
          backgroundColor: Colors.app
        }}
      >
        {
          this.state.response == null ? <View
            style={{
              justifyContent: 'center'
              , alignContent: "center",
              flex: 1
            }}
          >
            <ActivityIndicator
              style={{
                height: 50, width: 50, alignContent: "center", alignItems: "center", alignSelf: 'center'
                , justifyContent: 'center', backgroundColor: Colors.appdark, borderRadius: 10
              }}
              color={Colors.dream11red}
              size="small"
            />
          </View> :

            <View

              style={{
                width: "100%",
                flex: 1
              }}
            >

              <View
                style={{ backgroundColor: "#000", paddingVertical: 16 }}
              >

                <CustomText style={{ textAlign: "center", textAlignVertical: "center", fontSize: 15, fontWeight: "bold", color: "#fff" }}>{this.props.mObj.short_name}</CustomText>
                <TouchableOpacity
                  style={{ position: "absolute", start: 16, top: 16 }}
                  onPress={this.onBack}>

                  <Image style={{
                    width: undefined, height: 20, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
                  }}
                    source={require('../../images/back_white.png')} />

                </TouchableOpacity>

                <View style={{ height: 20, flexDirection: "row", justifyContent: "space-between", marginHorizontal: 16, marginTop: 16, }}>
                  <View>
                    <CustomText style={{ textAlign: "center", fontSize: 13, color: Colors.textLightScorecard, fontWeight: "bold" }}>{this.state.team1}</CustomText>
                    <CustomText style={{ textAlign: "left", fontSize: 12, color: Colors.textLightScorecard }}>{this.state.inning1}</CustomText>
                  </View>
                  <View>
                    <CustomText style={{ textAlign: "center", fontSize: 11, color: Colors.textLightScorecard, fontWeight: "bold" }}></CustomText>

                  </View>
                  <View>
                    <CustomText style={{ textAlign: "center", fontSize: 13, color: Colors.textLightScorecard, fontWeight: "bold" }}>{this.state.team2}</CustomText>
                    <CustomText style={{ textAlign: "right", fontSize: 12, color: Colors.textLightScorecard }}>{this.state.inning2}</CustomText>
                  </View>


                </View>

                <View style={{ justifyContent: "center", width: "100%", flexDirection: "row", alignItems: "center" }}>

                  <View style={{ width: 7, height: 7, marginEnd: 5, backgroundColor:dotColor, borderRadius: 7 / 2 }} />
                  <CustomText style={{ textAlign: "center", textAlignVertical: "center", fontSize: 10, color: "#fff" }}>{heading}</CustomText>

                </View>
                <CustomText style={{ textAlign: "center", textAlignVertical: "center", marginTop: 3, fontSize: 11, color: "#fff" }}>{this.state.result}</CustomText>
              </View>

              <View style={{ padding: 6, justifyContent: "space-between", flexDirection: "row", backgroundColor: Colors.white }}>

                <View>
                  <CustomText>Prize Pool</CustomText>
                <CustomText style={{ fontWeight: "bold" }}>{RUPPE}{this.props.mItem.prize_pool}</CustomText>
                </View>
                <View>
                  <CustomText>Spots</CustomText>
                  <CustomText style={{ fontWeight: "bold" }}>{this.props.mItem.spots_filled}/{this.props.mItem.spots_count}</CustomText>
                </View>
                <View>
                  <CustomText>Entry</CustomText>
                  <CustomText style={{ fontWeight: "bold" }}>{RUPPE}{this.props.mItem.joining_fee}</CustomText>
                </View>

              </View>
              {this.props.fromCompleted?<View>
                {this.state.showYouwon!=0?
                 <View style={{ alignItems: "center", paddingVertical: 6, backgroundColor: Colors.white }}>
                 <Image style={{
                   position: "absolute", top: 0, start: 100, end: 100,
                   width: undefined, height: 35, aspectRatio: 1
                 }}
                   source={require('../../images/congrats.png')} />
           <CustomText style={{ fontSize: 14, fontWeight: "bold", marginTop: 6, }}>Congratulations!</CustomText>
                 <CustomText style={{ fontSize: 14,  marginTop: 6, }}>You won</CustomText>
                 <CustomText style={{ color:Colors.green,fontSize: 20, fontWeight: "bold", marginBottom: 6, }}>{RUPPE}{this.state.showYouwon}</CustomText>
               </View>:null}
              </View>:null}
              <View style={{ height: 1, backgroundColor: Colors.appDark }} />
              <TabView

                style={{ flex: 1 }}
                navigationState={this.state}
                renderScene={SceneMap(
                  this.state.routesPath)}
                renderTabBar={props => (
                  <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: Colors.button }}
                    style={{ backgroundColor: Colors.white }}
                    renderLabel={({ route }) => (
                      <View>
                        <Text style={{
                          fontSize: 14, textAlign: 'center',fontWeight:"bold",
                          color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            Colors.dream11red : Colors.textLight
                        }}>
                          {route.title}
                        </Text>
                      </View>
                    )}

                  />
                )}
                onIndexChange={
                  (ind) => {
                    this.setState({
                      index: ind
                    });
                    // this.setState({ index: ind }, () => {
                    //   this.refreshTabs(this.state.response.data[this.state.selectedIndex]._id)
                    // });
                  }
                }
                initialLayout={{ width: Dimensions.get('window').width }}
              />



            </View>

        }


      </View>


    )



  }

}




