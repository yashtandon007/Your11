import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { FlatList, Keyboard, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import Nodata from '../components/Nodata';
import styles from '../components/styles';
import { width } from './home/Home';


export default class NotificationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadMoreFlag: 0,
      loading: true,
      response: null
    };
  }

  componentDidMount() {
    this.loadDashboard();
  }

  onBack = () => {
   Actions.pop();
  }

  loadDashboard() {

    this.setState({ loading: true });

    fetch(GLOABAL_API + 'notifications/byuser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("notification " + JSON.stringify(responseJson));
        this.setState({
          loading: false,
          response: responseJson.data
        });
      })


    Keyboard.dismiss();
  }

  onNotificationClick = (action) => {

    console.log("Action : " + action);
    // if (action == "friend") {
    //   Actions.RequestTabs();
    // } else if (action == "game_profile") {
    //   Actions.ContestsTab();
    // } else {
    //   Actions.pop();
    // }

  }

  onWallet = () => {
    console.log("item selected..");
    Actions.wallet();
  }


  render() {

  

    return (
      <View
        style={styles.container_home}
      >

       
          <MyToolbar
            title="Notifications"
            onBack={this.onBack}
          />

          {this.state.response != null ?
           <FlatList
           refreshControl={
            <RefreshControl refreshing={this.state.loading
            } onRefresh={this.loadDashboard.bind(this)} />
          }
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={Nodata("")}
            horizontal={false}
            keyExtractor={(item, index) => index.toString()}
            style={{ margin: 16 }}
            data={this.state.response}
            renderItem={({ item, index, separators }) =>
              <View style={{
                borderRadius: 12,
                marginBottom: 6,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: { x: 0, y: 10 },
                shadowOpacity: 1,
                alignSelf: 'stretch',
                backgroundColor: COLORS.white,
              }}>

                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                  onPress={this.onNotificationClick.bind(this, item.action)}>

                  <View
                    style={{
                      padding: 16,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      flex: 1,

                    }}>

                    <CustomText
                      style={{
                        fontSize: 14,
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        color:"#000"
                      }}
                    >
                      {item.title}
                    </CustomText>

<View style={{marginVertical:1,height:3,backgroundColor:COLORS.app,width:width}}/>
                    <CustomText
                      style={{
                        fontSize: 13,
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        color: COLORS.textDark
                      }}
                    >
                      {item.body}

                    </CustomText>

                    <CustomText
                      style={{
                        fontSize: 12,
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        color: COLORS.textLight
                      }}
                    >
                      <Moment format="DD/MM/YYYY HH:mm" date={item.createdAt}
                        element={Text} interval={0}
                      />
                    </CustomText>
                  </View>


                </TouchableOpacity>
              </View>
            }
          /> : null}
      </View>


    )



  }





}


