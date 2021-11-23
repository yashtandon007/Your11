import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import SelectTeamPrizeBreakupCreateContest from '../components/SelectTeamPrizeBreakupCreateContest';
import TeamCard from '../components/TeamCard';
import Nodata from '../components/Nodata';
import styles from '../components/styles';
import { show } from '../utils/Globals';
import Loader from '../components/Loader';
import { cos } from 'react-native-reanimated';
import { getSeconds } from '../utils/Globals';

export default class ContestCreateSelectTeams extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSeleteamPopUpShown: false,
      response: null
    }
  }

  getTeamName() {

    var teamName = "";
    try {
      var teams = this.state.response;
      for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        if (team.selected) {
          teamName = team.team_order_key;
          break;
        }
      }
    } catch (e) {

    }
    return teamName;
  }

  onBack = () => {
    Actions.pop();
  }

  disablePopUp() {
    this.setState({
      isSeleteamPopUpShown: false
    });
  }



  onJoin(walletDeduction){
    if(this.props.fromJoinContest){
        this.onJoinContest(walletDeduction);
    }else{
      this.onCreateContest(walletDeduction);

    }
  }

  onCreateContest(walletDeduction) {
    var teams = this.state.response;
    var teamSelected = null;
    for (var i = 0; i < teams.length; i++) {
      var team = teams[i];
      if (team.selected) {
        teamSelected = team;
      }
    }
    var bodyTxt = {
      ...global.createContest,
      team_id: teamSelected._id,
      team_order_key: teamSelected.team_order_key,
      wallet: walletDeduction
    }


    var walletAmountSum = parseInt(walletDeduction.deposits) + parseInt(walletDeduction.winnings);
    console.log("walletAmountSum " + walletAmountSum);
    console.log("body >>>>>> " + JSON.stringify(bodyTxt));
    if (global.createContest.contest_details.joining_fee != walletAmountSum) {
      return;
    }
    var boodyT = JSON.stringify(bodyTxt);
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'privatecontests/insert', {
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

        console.log("response create contest" + JSON.stringify(responseJson));
        show(responseJson.message);
        Actions.ShareContestCode({
          goBackToHome:true,
          short_name: responseJson.data.short_name,
          contest_code: responseJson.data.contest_code
        });
        this.setState({
          loading: false
        });
      })


  }

  onJoinContest(walletDeduction) {
    var teams = this.state.response;
    var teamSelected = null;
    for (var i = 0; i < teams.length; i++) {
      var team = teams[i];
      if (team.selected) {
        teamSelected = team;
      }
    }
    var bodyTxt = {
      privatecontest_id:this.props._id,
      team_id: teamSelected._id,
      team_order_key: teamSelected.team_order_key,
      match_key:this.props.match_key,
      wallet: walletDeduction
    }


    var walletAmountSum = parseInt(walletDeduction.deposits) + parseInt(walletDeduction.winnings);
    if (this.props.contest_details.joining_fee != walletAmountSum) {
      return;
    }
    var boodyT = JSON.stringify(bodyTxt);
    console.log("boodyT "+boodyT);
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'privatecontests/join', {
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

        console.log("response contest join" + JSON.stringify(responseJson));
        show(responseJson.message);
        this.setState({
          loading: false
        });
        Actions.popTo("nav");
      })


  }

  componentDidMount() {

    EventBus.getInstance().addListener("updateContestTeams",
      this.listener = player => {
        this.loadDashboard();
      })
    this.loadDashboard();
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
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
        if (responseJson.status == 1) {
          var list = responseJson.data;
          if(list.length>0){
            list[0].selected = true;
         
          }else{
            Actions.CreateTeam({
              ...this.props,
              fromSelectTeam: true,
              match_key: this.props.match_key
            })
          }
          
          this.setState({ loading: false, response: list });

        } else {
          

        }
      })

  }


  render() {


    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.app }}
      >


        {this.state.isSeleteamPopUpShown ? null : <MyToolbar
          title={this.props.fromJoinContest ? "JOIN CONTEST" : "CREATE CONTEST"}
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

            <TouchableOpacity
              style={{ alignSelf: "flex-end", margin: 6 }}
              onPress={
                () => {
                  Actions.CreateTeam({
                    ...this.props,
                    fromSelectTeam: true,
                    match_key: this.props.match_key
                  })
                }
              }>
              <CustomText style={{ fontWeight: "bold", fontSize: 14, color: COLORS.dream11red }}>CREATE TEAM</CustomText>
            </TouchableOpacity>
            {this.state.response != null ?
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 6 }}
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
                        team_id={item._id}
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
                  if (this.getTeamName() === "") {
                    show("Select team first.");
                    return;
                  }
                  this.setState({
                    isSeleteamPopUpShown: true
                  });
                }
              }>
                <CustomText style={[styles.myButtonText, { backgroundColor: Colors.green }]}>{this.props.fromJoinContest ? "JOIN" : "CREATE"}</CustomText>
              </TouchableOpacity>
            </View>

          }
        </View>



        {this.state.isSeleteamPopUpShown ?

this.props.fromJoinContest?<SelectTeamPrizeBreakupCreateContest
fromJoinContest={true}
joiningFee={this.props.contest_details.joining_fee}
mItem={this.props.mItem}
disablePopUp={this.disablePopUp.bind(this)}
onJoin={this.onJoin.bind(this)}
/>:
          <SelectTeamPrizeBreakupCreateContest
          fromJoinContest={false}
          joiningFee={global.createContest.contest_details.joining_fee}
          mItem={this.props.mItem}
          disablePopUp={this.disablePopUp.bind(this)}
          onJoin={this.onJoin.bind(this)}
        />
 : null}


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