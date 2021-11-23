import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbar from '../../components/MyToolbar';
import TeamCard from '../../components/TeamCard';
import Nodata from '../../components/Nodata';
import styles from '../../components/styles';
import { show } from '../../utils/Globals';



export default class MyTeams extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      response: null
    }
  }


  componentDidMount() {
    console.log('my teams match_key :' + this.props.match_key);
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
        if(responseJson.status == 1){
          EventBus.getInstance().fireEvent("scorecard",{})
        }
        this.setState({ loading: false, response: responseJson.data });
      })

  }


  render() {


    return (
      <View
        style={{ flex: 1, justifyContent: "center" }}
      >
        {this.state.response != null ?

          <FlatList
            refreshControl={
              <RefreshControl refreshing={this.state.loading
              } onRefresh={this.loadDashboard.bind(this)} />
            } contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 16 }}
            ListFooterComponent={<View style={{ height: 30 }}></View>}
            ListEmptyComponent={Nodata()}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            data={this.state.response}
            renderItem={({ item, index, separators }) =>
              this.props.fromCompleted ? <TeamCard
                date={this.props.date}
                team_id={item._id}
                selectTeam={false}
                toRefresh={true}
                isMatchCompleted={true}
                myItem={item}
              /> : <TeamCard
              date={this.props.date}
              team_id={item._id}
              teamSize={this.state.response.length}
                  toRefresh={false}
                  selectTeam={false}
                  isMatchCompleted={false}
                  myItem={item}
                />

            }
          /> : null}


        {
          this.state.response == null ? <View
            style={{
              alignSelf: "center",
              justifyContent: 'center',
              position: "absolute"
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
          </View> : null}
      </View>


    )



  }

}



const stylesCurrent = StyleSheet.create({


});


