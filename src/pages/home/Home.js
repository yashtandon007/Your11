import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import { RefreshControl, Platform, Dimensions, ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Badge, ProgressBar } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import MatchCard from '../../components/MatchCard';
import Message from '../../components/Message';
import COLORS, { default as Colors } from '../../components/colors';
import CustomText from '../../components/CustomText';
import { show } from '../../utils/Globals';
import * as Updates from 'expo-updates';
import { Dialog } from 'react-native-simple-dialogs';
import Loader from '../../components/Loader'
import Constants from 'expo-constants';

import SwiperFlatList from 'react-native-swiper-flatlist';
import moment, { min } from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';

export default class Home extends Component {

  state = {
    progressAmount: 0.0,
    messageShown: "",
    mymatches: [],
    advertisements: [
      {
        image_url: "https://your11fantasy.com/images/banner.gif",
        size: 9,
      }
    ],
    index: 0,
    loading: false,
    response: null,
    isUpdateAvailable: false,
    isNewAppAvailable: false,
  };
  constructor() {
    super();

  }


  componentDidMount() {



    this.loadDashboard();
    this.registerForPushNotificationsAsync();
    //this.checkForUpdates();
    Linking.getInitialURL().then((url) => {
      let { path, queryParams } = Linking.parse(url);
      if (Object.keys(queryParams).length > 0) {
        if (Actions.currentScene !== 'ContestJoin') {
          Actions.ContestJoin(queryParams);
        }

      }

    }).catch(err => console.error('An error occurred', err));

    Linking.addEventListener('url', (event) => {
      this._handleOpenURL(event);
    })

  }


  _handleOpenURL(event) {
    console.log("URL >>>_handleOpenURL " + event.url);
    let { path, queryParams } = Linking.parse(event.url);
    if (Object.keys(queryParams).length > 0) {
      if (Actions.currentScene !== 'ContestJoin') {
        Actions.ContestJoin(queryParams);
      }
    }
  }







  callback = downloadProgress => {
    var progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    var progressVal = parseFloat(progress.toFixed(1));
    this.setState({
      progressAmount: progressVal
    });
    console.log("progress " + progressVal);

  };

  checkUpdateApp() {


    let uri = "https://www.your11fantasy.com/downloads/Your11-app.apk";
    let fileUri = FileSystem.documentDirectory + "y1.apk";
    const downloadResumable = FileSystem.createDownloadResumable(uri, fileUri, {}, this.callback);
    try {
      downloadResumable.downloadAsync()
        .then((obje) => {
          console.log('Finished downloading to ', obje.uri);
          this.setState({
            isNewAppAvailable: false
          });
          this.openFile();
        });


    } catch (e) {
      console.log('error ', e);
      console.error(e);
    }
  }


  async openFile() {

    FileSystem.getContentUriAsync(FileSystem.documentDirectory + "y1.apk").then(cUri => {
      console.log("uri obj " + cUri);
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: 'application/vnd.android.package-archive'
      })

    });


  }

  onFinishTime(ind) {
    console.log("onFinishTime .. " + ind);
    let newimagesAddFile = this.state.response;
    newimagesAddFile.splice(ind, 1); //to remove a single item starting at index
    this.setState({ response: newimagesAddFile })
  }




  async registerForPushNotificationsAsync() {
    console.log("GLOBAL_userObj " + GLOBAL_userObj.username);
    let token;
    let finalStatus;

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      //    try{
      token = (await Notifications.getExpoPushTokenAsync()).data;

      // }catch(ex){

      // }
      console.log(token);
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: Colors.dream11red,
        });
      }

      fetch(GLOABAL_API + 'users/push_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          Authorization: GLOBAL_TOKEN
        },
        body: JSON.stringify({
          expo_token: token
        }),
      });
    }



  }



  async checkForUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      console.log("update.isAvailable " + update.isAvailable);
      if (update.isAvailable) {
        this.setState({
          isUpdateAvailable: true
        });
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        Updates.reloadAsync();
      }
    } catch (e) {

    }
  }

  onAdClick(data) {
    if (data.action == "contest") {

      Actions.ContestDetail({
        contestId: data.contest_id,
        from: "Upcoming"
      });
    }

  }

  loadDashboard() {

    console.log("Device  manufacturer" + Device.manufacturer);
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matches/oneweek', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }

    })
      .then((response) => response.json())
      .then((responseJson) => {


        console.log("response  home " + JSON.stringify(responseJson));
        if (Platform.OS === 'android') {
          if (Constants.manifest.android.versionCode == 14) {
          } else {
            this.setState({
              isNewAppAvailable: true
            });
            this.checkUpdateApp();
          }


        }


        this.setState({
          loading: false, response: responseJson.data.matches, mymatches: responseJson.data.mymatches
        });
      }).catch(error => {
        // handle the error
        console.log("No internet.." + JSON.stringify(error));
        show("No Internet connection. Make sure that Wi-Fi or mobile data is turned on,then try again. ")
        this.setState({
          loading: false
        });
      });

  }

  adsList() {

    return this.state.advertisements.map((data) => {
      return (
        <TouchableOpacity
          onPress={
            () => {
              this.onAdClick(data);
            }
          }
        >
          <View style={{


            height: 55,
            width: width,
            justifyContent: 'center'
          }}>
            <Image style={{

              height: 55,
              resizeMode: "contain",
              width: width,
            }}
              source={{
                uri: data.image_url + "?d=" + new Date()
              }} />
          </View>
        </TouchableOpacity>
      )
    })

  }


  getMatchCard(item, ind) {

    console.log("iso " + item.start_date.iso)
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

  getMatchCardMyMatches(item, ind) {

    console.log("iso " + item.start_date.iso)
    var dateParsed = moment(item.start_date.iso);
    var date = dateParsed.format("MM/DD/YYYY HH:mm:ss")
    if (item.status == "completed") {
      date = "completed";
    } else if (item.status == "started") {
      date = "live";
    }
    return <MatchCard
      mymatches={true}
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


  onLiveClick(item) {
    Actions.ContestsTabCompleted(
      {
        isLive: true,
        mObj: item
      }
    );
  }
  onCompletedClick(item) {
    Actions.ContestsTabCompleted(
      {
        fromCompleted: true,
        mObj: item
      }
    );
  }
  onMatchItemCLicked(mItem) {

    global.short_name = mItem.short_name;

    if (mItem.status == "completed") {
      this.onCompletedClick(mItem);
      return;
    } else if (mItem.status == "started") {
      this.onLiveClick(mItem);
      return;
    }
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


  onWallet = () => {
    Actions.wallet();
  }

  onNotificationPage = () => {
    Actions.NotificationPage();
  }


  getTopHeader(){
    return (  <View
      style={{
        backgroundColor: Colors.dream11red,
        paddingVertical: 6,
        flexDirection: 'row', justifyContent: "center", alignItems: "center"
      }}>

      <View style={{

        flexDirection: "row", justifyContent: "center", alignItems: "center"
      }}>
        <Image
          source={require('../../images/icon.png')} style={{
            width: 40, height: 40, borderRadius: 150 / 2,
            overflow: "hidden"
          }} />
        <CustomText
          style={{
            fontSize: 22,
            color: Colors.white, fontWeight: "bold"
          }}
        >Your11</CustomText>
      </View>



      <TouchableOpacity
        style={{
          position: "absolute",
          start: 0,
          justifyContent: "flex-end",
          marginStart: 16, alignItems: "center"


        }}

        onPress={() => {
          Actions.signup({
            fromRegistration: false
          });
        }}>



        {GLOBAL_userObj.image_url == "" ? <Image style={{
          overflow: "hidden",
          alignSelf: "center",
          width: undefined, height: 28, aspectRatio: 1,
        }}
          source={require('../../images/userIcon.png')} /> :
          <Image
            source={{ uri: GLOBAL_userObj.image_url + "?", cache: 'reload' }} style={{
              aspectRatio: 1, height: 28, borderRadius: 50 / 2,
              overflow: "hidden",
              alignSelf: "center",
              backgroundColor: COLORS.app
            }} />
        }

      </TouchableOpacity>







      <View style={{
        position: "absolute",
        end: 0,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginEnd: 16, alignItems: "center"
      }}
      >

        <TouchableOpacity
          style={{


          }}
          onPress={this.onNotificationPage.bind(this)}>

          <Image style={{
            alignSelf: 'baseline', justifyContent: "center",
            alignContent: "center",
            tintColor: Colors.white, marginStart: 8, width: undefined, height: 18, aspectRatio: 1,
          }}
            source={require('../../images/bell.png')} />



        </TouchableOpacity>



        <TouchableOpacity
          style={{


          }}
          onPress={this.onWallet.bind(this)}>

          <Image style={{
            alignSelf: 'baseline', justifyContent: "center",
            alignContent: "center", tintColor: Colors.white,
            marginStart: 24, width: undefined, height: 18, aspectRatio: 1,
          }}
            source={require('../../images/wallet.png')} />



        </TouchableOpacity>


      </View>


    </View>
)
  }

  getListHeader = (myStyle) => {
    return (<View>
    

      <View >


        {this.state.mymatches.length > 0 ? <View >
          <Image style={{
            width: width, height: 115,
          }}
            source={require('../../images/bannertop.png')} />
          <View style={{ position: "absolute" }}>

            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
              <CustomText
                style={{
                  marginHorizontal: 16,
                  marginTop: 6,
                  fontSize: 17,
                  color: Colors.white, fontWeight: "bold"
                }}
              >My Matches</CustomText>
              <TouchableOpacity
                onPress={() => {
                  EventBus.getInstance().fireEvent("mymatches", null)
                }}>
                <View style={{
                  marginTop: 6,
                  flexDirection: "row", alignItems: "center"
                }}>
                  <CustomText
                    style={{

                      fontSize: 13,
                      color: Colors.white, fontWeight: "bold"
                    }}
                  >View All</CustomText>
                  <Image style={{
                    width: 8,
                    marginStart: 6,
                    tintColor: COLORS.white,
                    marginEnd: 16, width: undefined, height: 8, aspectRatio: 1,
                  }}
                    source={require('../../images/arrowRight.png')} />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList

              style={{ marginBottom: 16, marginTop: 8 }}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.mymatches}
              renderItem={({ item, index, separators }) => {
                var styl = {};
                if (index == 0) {
                  styl = { marginStart: 8, }
                }
                if (index == this.state.mymatches.length - 1) {
                  styl = { marginEnd: 8, }
                }
                return <View style={[{}, styl]}>
                  {this.getMatchCardMyMatches(item, index)}
                </View>
              }}
            />
          </View>
        </View> : null}

      </View>



      <View style={myStyle}>
        <SwiperFlatList
          autoplayLoop
          keyExtractor={(item, index) => index.toString()}
          autoplayDelay={3}
          showPagination
          paginationStyleItem={{ width: 5, height: 5 }}
        >
          {this.adsList()}
        </SwiperFlatList>
      </View>
      <Text style={{fontFamily: 'robotoBold',marginHorizontal: 16, textAlignVertical: "bottom",fontSize: 17, marginBottom: 3}}>Upcoming Matches</Text>








    </View>)
  }

  getListFooter = () => {

  }



  render() {

    var pVal = this.state.progressAmount;
    console.log("pVal  " + pVal);
    var myStyle = {};
    if (this.state.mymatches.length > 0) {
      myStyle = { marginTop: 85, marginBottom: 12 };
    } else {
      myStyle = { marginBottom: 16, marginTop: 6 };
    }
    return (


      <View

        style={{
          flex: 1,
          backgroundColor: COLORS.dream11Bg
        }}
      >


        <View

          style={{
            flex: 1
          }}
        >

          {this.getTopHeader()}
          {this.state.response != null ? <View>
 
            <FlatList

              refreshControl={
                <RefreshControl refreshing={this.state.loading
                } onRefresh={this.loadDashboard.bind(this)} />
              }
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={this.getListHeader(myStyle)}
              ListFooterComponent={<View style={{ height: 30 }}></View>}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              data={this.state.response}
              renderItem={({ item, index, separators }) => this.getMatchCard(item, index)}
            />
          </View>


            : null}


        </View>


        {this.state.messageShown == "" ? null : <Message
          message={this.state.messageShown}
        />
        }

        <Dialog
          style={{ backgroundColor: Colors.white }}
          visible={this.state.isUpdateAvailable}
          title="Updating app..Please wait...">

          <ActivityIndicator
            style={{
              height: 50, width: 50, alignContent: "center", alignItems: "center", alignSelf: 'center'
              , justifyContent: 'center', borderRadius: 10
            }}
            color={Colors.dream11red}
            size="small"
          />
        </Dialog>

        <Dialog
          style={{ backgroundColor: Colors.white }}
          visible={this.state.isNewAppAvailable}
          title="The Your11 experience just got more awesome! Downloading...">
          <View>
            <ProgressBar style={{ marginTop: 10, marginBottom: 15 }} progress={pVal} color={Colors.dream11red} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <CustomText>{pVal * 100}%</CustomText>
              <CustomText>{pVal * 100}/100</CustomText>
            </View>

          </View>
        </Dialog>

{this.state.response == null?
  <Loader />:null}

      </View>


    )



  }


}

export const { width, height } = Dimensions.get('window');



