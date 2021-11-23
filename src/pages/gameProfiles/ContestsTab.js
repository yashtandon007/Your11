import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, Image, Text, View, TouchableOpacity } from 'react-native';
import EventBus from 'react-native-event-bus';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbarContests from '../../components/MyToolbarContests';
import Contest from './Contest';
import MyContest from './MyContest';
import MyTeams from './MyTeams';
import { Actions } from 'react-native-router-flux';
import { ProgressBar } from 'react-native-paper';
import Constants from 'expo-constants';
import RBSheet from "react-native-raw-bottom-sheet";





export default class ContestsTab extends Component {


  state = {
    teamSize: 0,
    index: 0,
    loading: true,
  }
  constructor() {
    super();
  }




  componentWillReceiveProps() {
    console.log("componentWillReceiveProps ...");
    this.loadData();
  }
  componentDidMount() {

    EventBus.getInstance().addListener("updateContestTeams",
      this.listener = player => {
        this.loadData();
      })
    this.loadData();
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData() {
    fetch(GLOABAL_API + 'teams/bymatchuser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        match_key: this.props.mObj.key
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        var teamSize = responseJson.data.length;
        this.setState({
          teamSize
        })
        this.setState({
          loading: false,
          routesPath: {
            first: () => <Contest mObj={this.props.mObj}
              teamName={this.props.mObj.short_name}
              date={this.props.mDate}
              teamSize={teamSize}
            />,
            second: () => <MyContest
              teamName={this.props.mObj.short_name}
              date={this.props.mDate}
              mObj={this.props.mObj}
            />,
            third: () => <MyTeams
              match_key={this.props.mObj.key}
              date={this.props.mDate}
              fromCompleted={false} />,
          },
          routes: [
            { key: 'first', title: 'Contests' },
            { key: 'second', title: 'My Contests' },
            { key: 'third', title: 'My Teams (' + teamSize + ")" }
          ],
        });
      })
  }
  onBack = () => {
    console.log("onBack..ContestsTab");
    Actions.pop();
  }


  openBottomSheet() {
    console.log("asasasas");
    this.RBSheet.open()
  }

  render() {
    return (


      <View

        style={{
          flex: 1,
          backgroundColor: Colors.dream11Bg
        }}
      >

        {
          this.state.loading ? <View
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
              size="large"
            />
          </View> :

            <View

              style={{
                width: "100%",
                flex: 1
              }}
            >

              <MyToolbarContests
                short_name={this.props.mObj.short_name}
                title="Contest"
                onBack={this.onBack}
                showCreateContestIcon={true}
                time={this.props.mDate}
                openBottomSheet={this.openBottomSheet.bind(this)}
              />




              <RBSheet

                ref={ref => {
                  this.RBSheet = ref;
                }}
                height={100}
                openDuration={10}
                customStyles={{
                  flex: 1
                }}
              >
                <View style={{}}>
                  <TouchableOpacity onPress={
                    () => {

                      this.RBSheet.close();
                      Actions.ContestCreate({
                        teamSize:this.state.teamSize,
                        match_key:this.props.mObj.key
                      });
                    }
                  }>
                    <View style={{marginStart:16,alignItems:"center",flexDirection:"row"}}>
                    <Image
          source={require('../../images/addContest.png')} style={{
            width: 17, height: 17,marginEnd:12,
            overflow: "hidden"
          }} />
                  <View style={{height: 50,justifyContent:"center"}}>
                  <CustomText style={{  fontSize:12}}>Create a Contest</CustomText>
                  
                  </View>
                      </View>
                    </TouchableOpacity>
                  <View style={{ backgroundColor: Colors.dream11Bg, height: 1}} />
                  <TouchableOpacity onPress={
                    () => {
                      this.RBSheet.close();
                      Actions.ContestJoin({
                        match_key:this.props.mObj.key
                      });
                    }
                  }>
                    <View style={{marginStart:16,alignItems:"center",flexDirection:"row"}}>
                    <Image
          source={require('../../images/enterCode.png')} style={{
            width: 17, height: 17,marginEnd:12,
            overflow: "hidden"
          }} />
                 <View style={{height: 50,justifyContent:"center"}}>
                     <CustomText style={{  fontSize:12}}>Enter Contest Code</CustomText>
                     </View>
</View>
                  </TouchableOpacity>
                </View>
              </RBSheet>

              <TabView
                swipeEnabled={true}
                style={{ flex: 1 }}
                navigationState={this.state}
                renderScene={SceneMap(
                  this.state.routesPath)}
                renderTabBar={props => (
                  <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: Colors.dream11red }}
                    style={{ backgroundColor: Colors.white }}
                    renderLabel={({ route }) => (
                      <View>
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'myfont',
                          textBreakStrategy: "simple",
                          fontWeight: "bold",
                          color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            Colors.black : Colors.textLight
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




