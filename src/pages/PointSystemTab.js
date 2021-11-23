import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity, Text, View, Image } from 'react-native';
import EventBus from 'react-native-event-bus';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import PointSystem from './PointSystem';
import { Actions } from 'react-native-router-flux';
import { ProgressBar } from 'react-native-paper';
import MyToolbar from '../components/MyToolbar';




export default class PointSystemTab extends Component {


  dataFirst = [
    {
      header:"BATTING",
      name:"Run",
      amount:"+0.5"
    },
    {
      name:"FOUR",
      amount:"+0.5"
    },{
      name:"Six",
      amount:"+1"
    },{
      name:"Half-century",
      amount:"+4"
    },{
      name:"Century",
      amount:"+8"
    },{
      name:"DUCK OUT",
      amount:"-2"
    },{
      header:"BOWLING",
      name:"WICKET",
      amount:"+10"
    },{
      name:"FOUR WICKET",
      amount:"+4"
    },{
      name:"FIVE WICKET",
      amount:"+8"
    },{
      name:"MAIDEN OVER",
      amount:"+4"
    },{
      header:"FIELDING",
      name:"CATCH",
      amount:"+4"
    },{
      name:"STUMPING",
      amount:"+6"
    },{
      name:"RUN OUT",
      amount:"+4"
    },{
      header:"ECONOMY RATE (MIN. 2 OVERS BOWLED)",
      name:"BELOW 4",
      amount:"+3"
    },{
      name:"BETWEEN 4 TO 5",
      amount:"+2"
    },{
      name:"BETWEEN 5 TO 6",
      amount:"+1"
    },{
      name:"BETWEEN 9 TO 10",
      amount:"-1"
    },{
      name:"BETWEEN 10 TO 11",
      amount:"-2"
    },{
      name:"ABOVE 11",
      amount:"-3"
    },{
      header:"STRIKE RATE (MIN. 10 BALLS FACED)",
      name:"BETWEEN 60 TO 70",
      amount:"-1"
    },{
      name:"BETWEEN 50 TO 60",
      amount:"-2"
    },{
      name:"BELOW 50",
      amount:"-3"
    }
  ];



  dataSecond = [
    {
      header:"BATTING",
      name:"Run",
      amount:"+0.5"
    },
    {
      name:"FOUR",
      amount:"+0.5"
    },{
      name:"Six",
      amount:"+1"
    },{
      name:"Half-century",
      amount:"+2"
    },{
      name:"Century",
      amount:"+4"
    },{
      name:"DUCK OUT",
      amount:"-3"
    },{
      header:"BOWLING",
      name:"WICKET",
      amount:"+12"
    },{
      name:"FOUR WICKET",
      amount:"+2"
    },{
      name:"FIVE WICKET",
      amount:"+4"
    },{
      name:"MAIDEN OVER",
      amount:"+2"
    },{
      header:"FIELDING",
      name:"CATCH",
      amount:"+4"
    },{
      name:"STUMPING",
      amount:"+6"
    },{
      name:"RUN OUT",
      amount:"+4"
    },{
      header:"ECONOMY RATE (MIN. 5 OVERS BOWLED)",
      name:"BELOW 2.5",
      amount:"+3"
    },{
      name:"BETWEEN 2.5 TO 3.5",
      amount:"+2"
    },{
      name:"BETWEEN 3.5 TO 4.5",
      amount:"+1"
    },{
      name:"BETWEEN 7 TO 8",
      amount:"-1"
    },{
      name:"BETWEEN 8 TO 9",
      amount:"-2"
    },{
      name:"ABOVE 9",
      amount:"-3"
    },{
      header:"STRIKE RATE (MIN. 20 BALLS FACED)",
      name:"BETWEEN 50 TO 60",
      amount:"-1"
    },{
      name:"BETWEEN 40 TO 50",
      amount:"-2"
    },{
      name:"BELOW 40",
      amount:"-3"
    }
  ];

  dataThird = [
    {
      header:"BATTING",
      name:"Run",
      amount:"+0.5"
    },
    {
      name:"FOUR",
      amount:"+0.5"
    },{
      name:"Six",
      amount:"+1"
    },{
      name:"Half-century",
      amount:"+2"
    },{
      name:"Century",
      amount:"+4"
    },{
      name:"DUCK OUT",
      amount:"-4"
    },{
      header:"BOWLING",
      name:"WICKET",
      amount:"+8"
    },{
      name:"FOUR WICKET",
      amount:"+2"
    },{
      name:"FIVE WICKET",
      amount:"+4"
    },{
      header:"FIELDING",
      name:"CATCH",
      amount:"+4"
    },{
      name:"STUMPING",
      amount:"+6"
    },{
      name:"RUN OUT",
      amount:"+4"
    }
  ];
  state = {
    index: 0,
    routesPath: {
      first: () => <PointSystem
        response={this.dataFirst}
      />,
         second: () => <PointSystem 
         response={this.dataSecond}
          />,
          third: () => <PointSystem 
          response={this.dataThird}
          />,

      },
    routes: [
      { key: 'first', title: 'T20' },
       { key: 'second', title: 'OD' },
       { key: 'third', title: 'TEST' },
    ],
    response: {

    }
  }

  constructor(props) {
    super(props);
   
  }

  componentDidMount() {
  }

  onBack = () => {
    console.log("onBack..ContestsTab");
    Actions.pop();
  }


  render() {
    const heading = this.props.isLive ? "LIVE" : "COMPLETED";
    return (

      <View

        style={{
          flex: 1,
          backgroundColor: Colors.app
        }}
      >
          <MyToolbar
            title="Point System"
            onBack={this.onBack}
          />
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
                          fontSize: 13, textAlign: 'center',
                          color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            Colors.textDark : Colors.textLight
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




