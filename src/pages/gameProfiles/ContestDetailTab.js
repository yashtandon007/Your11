import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, StatusBar, Text, View, Image } from 'react-native';
import EventBus from 'react-native-event-bus';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbarContests from '../../components/MyToolbarContests';
import Leaderboard from './Leaderboard';
import ContestDetails from './ContestDetails';
import ContestCard from '../../components/ContestCard';
import Constants from 'expo-constants';


import { Actions } from 'react-native-router-flux';
import { ProgressBar } from 'react-native-paper';




export default class ContestDetailTab extends Component {


  state = {
    index: 0,
    routesPath: {
      first: () => <ContestDetails
                prize_formula={this.props.mItem.prize_formula} 
                matchcontest_id={this.props.mItem.matchcontest_id}
       />   ,  second: () => <Leaderboard 
       date={this.props.date}
       matchcontest_id={this.props.mItem.matchcontest_id}
       fromContestDetails={true} />,

      },
    routes: [
      { key: 'first', title: 'Contest Details' },
      { key: 'second', title: 'Leaderboard' },
   ],
    response: {

    }
  }
  myContest = null;

  constructor(props) {
    super(props);
    console.log("leaderboard componentDidMount .. " + this.props.matchcontest_id);
  }

  componentDidMount() {
  }

  onItemCLicked(myItem,isCardClicked){
    if(isCardClicked){
     
    }else{
      console.log("myItem "+JSON.stringify(myItem));
      if(this.props.teamSize<1){
        Actions.CreateTeam({
          date: this.props.date,
          match_key:this.props.mObj.key
        });
      }else{
         Actions.SelectTeams({
          date: this.props.date,
           match_key:this.props.mObj.key,
           mItem:myItem
         });
      }
    }
    
  }


  
  openBottomSheet() {
  }


  onBack = () => {
    console.log("onBack..ContestsTab");
    Actions.pop();
  }


  render() {
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

<MyToolbarContests 
               short_name={this.props.teamName}   
               title="Contest"
               onBack={this.onBack}
               time={this.props.date}
               openBottomSheet={this.openBottomSheet.bind(this)}
               />
             <View
             style={{marginVertical:16}}>
             <ContestCard
                isMyCard={this.props.isMyCard}
                myItem={this.props.mItem}
                onItemCLicked={this.onItemCLicked.bind(this)}
                />

               </View>
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
                         fontSize: 14,  textAlign: 'center',fontWeight:"bold",
                          color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            Colors.dream11red : Colors.textlightCreateTeam
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




