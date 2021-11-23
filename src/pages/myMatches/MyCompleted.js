import React, { Component } from 'react';
import { FlatList, Keyboard, RefreshControl ,View} from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import MatchCard from '../../components/MatchCard';
import Nodata from '../../components/Nodata';
import styles from '../../components/styles';
import Loader from '../../components/Loader';


export default class MyCompleted extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      response: null
    };

  }

  componentDidMount() {
    console.log('componentDidMount mycompleted');
    this.loadDashboard()
  }




  loadDashboard() {

    console.log("my completed loading..." + GLOBAL_TOKEN);

    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matches/completed', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        type: "completed",
        // filters: this.state.filterList
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response  mycompleted " + JSON.stringify(responseJson));
        this.setState({ loading: false, response: responseJson });
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

  onMatchItemCLicked = (myItem) => {
    console.log("onMatchItemCLicked.." + JSON.stringify(myItem));
    Actions.ContestsTabCompleted(
      {
        fromCompleted:true,
        mObj: myItem
      }
    );
  }

  render() {

    return (

      <View style={{flex:1,paddingTop:16}}> 
        {this.state.response != null ?
        <FlatList
        refreshControl={
          <RefreshControl refreshing={this.state.loading
          } onRefresh={this.loadDashboard.bind(this)} />
        }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={Nodata()}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.response.data}
          renderItem={({ item, index, separators }) => {
            console.log("inex and key " + index + "  " + item.key)
            return <MatchCard
              short_name={item.name}
              team1={item.teams.a}
              team2={item.teams.b}
              time="completed"
              name={item.name}
              format={item.format}

              title={item.title}
              myItem={item}
              onMatchItemCLicked={this.onMatchItemCLicked.bind(this)}


            />

          }

          }
        /> : null}

{this.state.response==null?<Loader /> :null}

        </View>



    )

  }

}


