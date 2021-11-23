import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, Image, Text, View,TouchableOpacity } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbar from '../../components/MyToolbar';
import MyCompleted from './MyCompleted';
import MyLive from './MyLive';
import MyUpcomming from './MyUpcomming';


export default class MyMatchesTab extends Component {



  componentWillUnmount() {
    console.log("componentWillUnmount MyContests")
    EventBus.getInstance().removeListener(this.listener);
  }

  constructor() {
    super();
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Upcoming' },
        { key: 'second', title: 'Live' },
        { key: 'third', title: 'Completed' }
      ],
      loading: false,
      response: {}
    };
  }






  componentDidMount() {
    EventBus.getInstance().addListener("mycontest",
      this.listener = data => {
        // handle the event

        console.log("even receiveded " + data.list[0].sublist[0].isChecked);
        var oldStateRespose = this.state.response
        this.setState({
          response: oldStateRespose
        })

      })
    //this.loadDashboard();
  }


  loadDashboard() {
    console.log("loading mycontest...")
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'home', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response my contests > " + responseJson);

        this.setState({
          loading: false, response: responseJson
        }, () => {

          console.log("response mycontets ... " + JSON.stringify(responseJson));
         
        });

      })
      .catch((error) => {
        this.setState({ loading: false, response: null });
      });



  }

  onBack(){
    Actions.pop();
  }



  render() {
    return (

      <View

        style={{
          width: "100%",
          flex: 1
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
                , justifyContent: 'center', backgroundColor: COLORS.appdark, borderRadius: 10
              }}
              color={Colors.dream11red}
              size="large"
            />
          </View> :

            <View

              style={{
                width: "100%",
                flex: 1,
                backgroundColor: Colors.dream11Bg
              }}
            >
              <View style={{alignItems:"center",backgroundColor:Colors.dream11red,flexDirection:"row"}}>
              <TouchableOpacity
   style={{
   
                  justifyContent:"flex-end",
                  marginStart: 16,alignItems:"center"


   }}
   
   onPress={()=>{
     Actions.signup({
       fromRegistration: false
     });
   }}>

   

{GLOBAL_userObj.image_url==""?<Image style={{
                    overflow: "hidden",
                    alignSelf:"center",
   width: undefined, height: 28, aspectRatio: 1,
   }}
     source={require('../../images/userIcon.png')} />:
     <Image
 source={{ uri: GLOBAL_userObj.image_url + "?", cache: 'reload' }} style={{
  aspectRatio: 1,height: 28, borderRadius: 50 / 2,  
   overflow: "hidden",
   alignSelf:"center",
       backgroundColor: COLORS.app
 }} />
  }

 </TouchableOpacity>
             
              <CustomText style={{color:Colors.white,fontWeight:"bold",padding:16,fontSize:17,}}>My Matches</CustomText>


                </View>

              <TabView
                style={{ flex: 1 }}
                navigationState={this.state}
                renderScene={SceneMap({
                  first: MyUpcomming,
                  second: MyLive,
                  third: MyCompleted
                })}
                renderTabBar={props => (
                  <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: COLORS.button }}
                    style={{ backgroundColor: COLORS.white }}
                    renderLabel={({ route }) => (
                      <View>
                        <Text style={{
                          fontSize: 14, textAlign: 'center',
                          color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            Colors.textDark : Colors.textLight
                        }}>
                          {route.title}
                        </Text>
                      </View>
                    )}

                  />
                )}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width }}
              />
             

            </View>

        }


      </View>


    )



  }





}


