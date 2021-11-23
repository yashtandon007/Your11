import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import SelectTeamPrizeBreakup from '../components/SelectTeamPrizeBreakup';
import TeamCard from '../components/TeamCard';
import Nodata from '../components/Nodata';
import styles from '../components/styles';
import { show } from '../utils/Globals';
import Loader from '../components/Loader';
import {getSeconds} from '../utils/Globals';


export default class SelectTeamsSwitch extends Component {

  

  constructor(props) {
    super(props);
    this.state = {
      response: null
    }
  }

  getTeam() {

    var mTeam = null;
    var teams = this.state.response;
    for (var i = 0; i < teams.length; i++) {
      var team = teams[i];
      if (team.selected) {
        mTeam = team;
        break;
      }
    }
    return mTeam;
  }

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("AboutUs onBack");
    Actions.pop();
  }

  seconds =0;

  componentDidMount() {
    console.log('my teams match_key :' + this.props.match_key);
    this.seconds = getSeconds(this.props.date);
    console.log("this.seconds "+this.seconds);
    this.myinerverl = setInterval(() => {
     
      this.seconds = (this.seconds -1);
      if(this.seconds ==0 || this.seconds <0){
        clearInterval(this.myinerverl);
      }
      


    }, 1000);


    this.loadDashboard()
  }

  loadDashboard() {

    console.log(" loading..." + GLOBAL_TOKEN);

    this.setState({ loading: true });

    fetch(GLOABAL_API + 'teams/bymatchuser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        match_key: this.props.match_key
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response  myteams " + JSON.stringify(responseJson));
        
        var list = responseJson.data;
        list[0].selected = true;
        this.setState({ loading: false, response: list });
      })

  }

  render() {


    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.app }}
      >


        <MyToolbar
          title="SELECT TEAMS"
          onBack={this.onBack}
        />
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            shouldCancelWhenOutside={false}
            style={styles.list_container}
            refreshControl={
              <RefreshControl refreshing={this.state.loading
              } onRefresh={this.loadDashboard.bind(this)} />
            }>
            {this.state.response != null ?
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 16 }}
                ListFooterComponent={<View style={{ height: 30 }}></View>}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
                data={this.state.response}
                renderItem={({ item, index, separators }) =>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ flex: 1 }}>
                      <TeamCard
                        date={this.props.date}
                        myItem={item}
                        selectTeam={true}
                        team_id ={item._id}
                        toRefresh={false}
                      />

                    </View>
                    <TouchableOpacity
                      onPress={
                        () => {
                          var teams = this.state.response;
                          for (var i = 0; i < teams.length; i++) {
                            var team = teams[i];
                            team.selected = false;
                            if (team._id == item._id) {
                              team.selected = true;
                            }
                          }
                          this.setState({
                            response: teams
                          });
                        }
                      }
                      style={{ marginEnd: 16 }}>
                      <CustomText style={item.selected ? stylesCurrent.itemSelected : stylesCurrent.item} />
                    </TouchableOpacity>



                  </View>

                }

              /> : null}

          </ScrollView>

          {
            this.state.response == null ? null : <View style={{ paddingHorizontal: 16, justifyContent: "space-between", flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, paddingVertical: 16 }}>
              <CustomText style={{ marginStart: 16 }}>Selected: {this.getTeam().team_order_key}</CustomText>
              <TouchableOpacity
                onPress={()=>{
                  if(this.seconds == 0 || this.seconds<0){
                    show("Deadline passed.");
                    Actions.pop();
                    return ;
                  }
                  
                  this.setState({
                    loading: true
                  });
                  console.log("this.props.matchcontest_id "+this.props.matchcontestid);
                  console.log("his.props.old_team_id "+this.props.old_team_id);
                  
                  var bodyTxt = JSON.stringify({
                    matchcontest_id: this.props.matchcontestid,
                    old_team_id: this.props.old_team_id,
                    new_team_id: this.getTeam()._id
                  })
                
                  console.log("BODY "+bodyTxt);
                
                  fetch(GLOABAL_API + 'usercontests/switch_team', {
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
          
                      console.log("response  " + JSON.stringify(responseJson));
                      show(responseJson.message);
                      EventBus.getInstance().fireEvent("refreshLeaderboard", null
                      )

                      this.setState({
                        loading: false
                      });
                      Actions.pop();
                      
          
                  
          
                    })
          
          
                }}
                >
                
              <CustomText style={{
                textStyle:"bold",
                alignContent:"center",paddingHorizontal:16,borderRadius:6, 
                alignItems:"center",textAlignVertical:"center",
                height:30,marginEnd: 16,backgroundColor:Colors.green,
                color:Colors.white
               }}>SWITCH TEAM</CustomText>


                </TouchableOpacity>             
            </View>

          }
        </View>



       


{this.state.loading ?

<Loader /> : null}

      </View>


    )



  }

}

const stylesCurrent = StyleSheet.create({

  item: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1
  },
  itemSelected: {
    backgroundColor: Colors.accent,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1

  }


});