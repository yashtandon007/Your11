import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import Colors from '../components/colors';
import MyMatchesTab from "./myMatches/MyMatchesTab";
import Setting from "../pages/setting";
import { show } from '../utils/Globals';
import Home from "./home/Home";
import EventBus from 'react-native-event-bus';

import * as Linking from 'expo-linking';
export default class Nav extends Component {



  getRoutes(){
    return [
      { key: 'home', title: 'Home', icon: 'home', color: Colors.appdark },
      { key: 'MyMatches', title: 'My Matches', icon: "trophy-variant-outline", color: Colors.appdark },
      { key: 'setting', title: 'More', icon: "dots-horizontal-circle-outline", color: Colors.appdark }

    ]
  }
  state = {
    index: 0,
    doubleBackToExitPressedOnce: false,
    routes: this.getRoutes(false),
  };



  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    EventBus.getInstance().addListener("mymatches",
    this.listener = player => {
      this.setState({
        index:1
      });
    })

  }


  


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }


 

  _handleIndexChange = index => {

    // currentIndex = this.state.index;
    // if(currentIndex == 0){

    // }
    this.setState({ index });

  }

  handleBackButton = () => {
    
    console.log("Nav BACK currentscene : " + Actions.currentScene);
    if (Actions.currentScene === "nav") {

      if (this.state.index === 1 || this.state.index === 2 || this.state.index === 3
        || this.state.index === 4) {
        this.setState({
          index: 0
        });
        return;
      }
      this.onBackPressed();
    } else if (Actions.currentScene === "setting" || Actions.currentScene === "FriendsList") {
      this.setState({
        index: 0
      });
    }else if (Actions.currentScene === "CreateTeam") {
      console.log("team...");

      return true ;
    }

  }

  onBackPressed() {
    if (this.state.doubleBackToExitPressedOnce) {
      this.setState({
        doubleBackToExitPressedOnce: false
      });
      BackHandler.exitApp()
      return;
    }
    this.setState({
      doubleBackToExitPressedOnce: true
    }, () => {
      show("Please click BACK again to exit");

    });
    setTimeout(function () {
      console.log("setTimeout...");
      this.setState({
        doubleBackToExitPressedOnce: false
      });
    }.bind(this), 2000);


  }



  //  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  //  // then navigate
  //  navigate('NewScreen');

  _renderScene = BottomNavigation.SceneMap({
    home: Home,
    MyMatches: MyMatchesTab,
    setting: Setting
  });


  constructor() {
    super();

  }


  render() {
    return (


      <BottomNavigation
        barStyle={{ backgroundColor: Colors.white }}
        onNav={(pos) => this._handleIndexChange}
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        shifting={false}
        activeColor={Colors.logoColor}
        inactiveColor={Colors.appDarkest}
      />


    )
  }

}
