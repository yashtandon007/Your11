import React, { Component } from 'react';
import { FlatList, Keyboard, RefreshControl,View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import MatchCard from '../../components/MatchCard';
import Nodata from '../../components/Nodata';
import Loader from '../../components/Loader';
import styles from '../../components/styles';
import moment from 'moment';



export default class MyUpcomming extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      response: null
    };

  }

  componentWillUnmount() {
    console.log("componentWillUnmount myupcomming")
  }

  componentDidMount() {
    console.log('componentDidMount myupcomming');
    this.loadDashboard();
  }


  loadDashboard() {


    
    console.log("myupcomming...");
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matches/upcoming', {
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

        console.log("response _id myupcomming " + JSON.stringify(responseJson));
        this.setState({ loading: false, response:responseJson.data });
       })
       .catch(error => {
        // handle the error
        console.log("No internet..");
        
        this.setState({
          loading: false
        });
    });
    Keyboard.dismiss();
  }


  
  onFinishTime(ind) {
    console.log("onFinishTime .. " + ind);
    let newimagesAddFile = this.state.response;
    newimagesAddFile.splice(ind, 1); //to remove a single item starting at index
    this.setState({ response: newimagesAddFile })
  }



  onMatchItemCLicked(mItem) {

    var dateParsed = moment(mItem.start_date.iso);
    var date = dateParsed.format("MM/DD/YYYY HH:mm:ss")
    console.log("Clicked ind>>> " + JSON.stringify(mItem));
    if (mItem.is_enabled == false) {
      this.setState({
        messageShown: "Contest for this match will open soon. Stay tuned!"
      });
      setTimeout(() => {
        this.setState({
          messageShown: ""
        });

      }, 2500)
    } else {
      Actions.ContestsTab({
        mObj: mItem,
        mDate: date
      });
    }

  }



  getMatchCard(item, ind) {

    var dateParsed = moment(item.start_date.iso);
    var date = dateParsed.format("MM/DD/YYYY HH:mm:ss")
    return <MatchCard
      myItem={item}
      indexNumber={ind}
      onFinishTime={this.onFinishTime.bind(this)}
      onMatchItemCLicked={this.onMatchItemCLicked.bind(this)}
      team1={item.teams.a}
      team2={item.teams.b}
      time={date}
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
                  />
: null}


{this.state.response==null?<Loader /> :null}


      </View>


    )

  }


}


