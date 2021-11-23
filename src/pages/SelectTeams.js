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
import { cos } from 'react-native-reanimated';
import {getSeconds} from '../utils/Globals';



export default class SelectTeams extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSeleteamPopUpShown: false,
      response: null
    }
  }

  getTeamName() {

    var teamName = "";
    var teams = this.state.response;
    for (var i = 0; i < teams.length; i++) {
      var team = teams[i];
      if (team.selected) {
        teamName = team.team_order_key;
        break;
      }
    }
    return teamName;
  }

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("AboutUs onBack");
    Actions.pop();
  }

  disablePopUp() {
    console.log("disablePopUp...");
    this.setState({
      isSeleteamPopUpShown: false
    });
  }

  onJoin(walletDeduction) {
    console.log("join time"+this.seconds);
    console.log(">>>>   " + JSON.stringify(walletDeduction));
    
    if(this.seconds == 0 || this.seconds<0){
      show("Deadline passed.");
      Actions.pop();
      return ;
    }
    var teams = this.state.response;
    var teamSelected = null;
    for (var i = 0; i < teams.length; i++) {
      var team = teams[i];
      if(team.selected){
        teamSelected = team;
      }
    }
    var bodyTxt = {
      matchcontest_id: this.props.mItem.matchcontest_id,
      match_key: teamSelected.match_key,
      team_id: teamSelected._id,
      team_order_key: teamSelected.team_order_key,
      transaction_type: "debit",
      wallet: walletDeduction
    }

    var walletAmountSum = walletDeduction.bonus+walletDeduction.deposits+walletDeduction.winnings;
    var joiningFee = this.props.mItem.joining_fee;
    console.log("walletAmountSum "+walletAmountSum);
    console.log("joiningFee "+joiningFee);
    if(joiningFee != walletAmountSum){
      return ;
    }
    var boodyT = JSON.stringify(bodyTxt);
    console.log("body usercontests/join "+boodyT);
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'usercontests/join', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: boodyT

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response join" + JSON.stringify(responseJson));
        if(responseJson.status == 0){
          show(responseJson.message);
          Actions.pop();
        }else{
          EventBus.getInstance().fireEvent("updateContestTeams");
          show("Contest Joined");
          Actions.popTo('ContestsTab');
        } 

        this.setState({
          loading: false
        });
      })


  }

  seconds =0;
  componentDidMount() {
    console.log('my teams match_key :' + this.props.match_key);
    this.seconds = getSeconds(this.props.date);

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


        {this.state.isSeleteamPopUpShown ? null : <MyToolbar
          title="SELECT TEAMS"
          onBack={this.onBack}
        />}
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
              <CustomText style={{ marginStart: 16 }}>Selected: {this.getTeamName()}</CustomText>
              <TouchableOpacity onPress={
                () => {
                  this.setState({
                    isSeleteamPopUpShown: true
                  });
                }
              }>
                <CustomText style={[styles.myButtonText, { backgroundColor: Colors.green }]}>JOIN</CustomText>
              </TouchableOpacity>
            </View>

          }
        </View>



        {this.state.isSeleteamPopUpShown ?
          <SelectTeamPrizeBreakup

            mItem={this.props.mItem}
            disablePopUp={this.disablePopUp.bind(this)}
            onJoin={this.onJoin.bind(this)}
          /> : null}


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