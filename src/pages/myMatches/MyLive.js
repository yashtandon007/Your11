import React, { Component } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import MatchCard from '../../components/MatchCard';
import Nodata from '../../components/Nodata';
import styles from '../../components/styles';
import moment from 'moment';
import Loader from '../../components/Loader';


export default class MyLive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      response: null
    };

  }



  componentWillUnmount() {
    console.log("componentWillUnmount mylive")
  }

  componentDidMount() {
    console.log('componentDidMount my live');
    this.loadDashboard();

  }

  loadDashboard() {

    console.log(" live loading...");
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matches/live', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify()

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response _id mylive " + JSON.stringify(responseJson));
         this.setState({ loading: false, response:responseJson.data });
       })
       .catch(error => {
        // handle the error
        console.log("No internet..");
        this.setState({
          loading: false
        });
    });
  }

  onFinishTime(ind) {
    console.log("onFinishTime .. " + ind);
    let newimagesAddFile = this.state.response;
    newimagesAddFile.splice(ind, 1); //to remove a single item starting at index
    this.setState({ response: newimagesAddFile })
  }




  onMatchItemCLicked = (myItem) => {
    console.log("onMatchItemCLicked.."+JSON.stringify(myItem));
    Actions.ContestsTabCompleted(
      {
        isLive:true,
        mObj:myItem
      }
    );
  }



  getMatchCard(item, ind) {
    return <MatchCard
      myItem={item}
      indexNumber={ind}
      onFinishTime={this.onFinishTime.bind(this)}
      onMatchItemCLicked={this.onMatchItemCLicked.bind(this)}
      team1={item.teams.a}
      team2={item.teams.b}
      time="live"
      name={item.name}
      format={item.format}

      title={item.title}
    />
  }



  render() {

    return (

      <View style={{flex:1,paddingTop:16}}>
        
        {this.state.response != null ? <FlatList
        refreshControl={
          <RefreshControl refreshing={this.state.loading
          } onRefresh={this.loadDashboard.bind(this)} />
        }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={Nodata()}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.response}
          renderItem={({ item, index, separators }) => this.getMatchCard(item, index)}
          />: null}


        {this.state.response==null?<Loader /> :null}
      </View>


    )

  }


}