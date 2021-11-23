import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import Nodata from '../../components/Nodata';
import ContestCard from '../../components/ContestCard';
import styles from '../../components/styles';
import { show } from '../../utils/Globals';
import { Actions } from 'react-native-router-flux';
import RBSheet from "react-native-raw-bottom-sheet";
import * as IntentLauncher from 'expo-intent-launcher';

import * as FileSystem from 'expo-file-system';


export default class MyContest extends Component {


  constructor(props) {
    super(props);
    this.state = {
      downloadUrl: "",
      loadingGetpdf: false,
      fileDownloaded: 0,
      loading: true,
      selected: {
        prizePool: 2,
        spots: 0,
        entry: 0
      },
      response: null
    }
  }

  onBottomSheetShow(mcId) {
    this.setState({
      mcId: mcId
    });

    this.setState({ loadingGetpdf: true });
    this.RBSheet.open()
    var localFile = FileSystem.documentDirectory + this.props.mObj.key + mcId + ".pdf";
    FileSystem.getInfoAsync(localFile)
      .then((data) => {
        if (data.exists) {
          this.setState({
            fileDownloaded: 2, loadingGetpdf: false
          });
        } else {

          console.log("getPdf mcId " + mcId);

          fetch(GLOABAL_API + "matchcontests/get_pdf", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json',
              Authorization: GLOBAL_TOKEN
            },
            body: JSON.stringify({
              matchcontest_id: mcId
            })

          })
            .then((response) => response.json())
            .then((responseJson) => {


              console.log("response  matchcontests/get_pdf " + JSON.stringify(responseJson));
              this.setState({ loadingGetpdf: false, downloadUrl: responseJson.data });

            })

        }


      })
      .catch(error => {

      });

  }

  componentDidMount() {
    this.loadDashboard()
  }




  async downloadFile() {

    var localFile = FileSystem.documentDirectory + this.props.mObj.key + this.state.mcId + ".pdf";



    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      console.log("progress " + progress);

    };



    const downloadResumable = FileSystem.createDownloadResumable(
      this.state.downloadUrl,
      localFile,
      {},
      callback
    );



    try {
      downloadResumable.downloadAsync()
        .then((obje) => {
          console.log('Finished downloading to ', obje.uri);
          this.setState({
            fileDownloaded: 2
          });
        });


    } catch (e) {
      console.log('error ', e);
      console.error(e);
    }




  }

  async openFile() {
    FileSystem.getContentUriAsync(FileSystem.documentDirectory + this.props.mObj.key + this.state.mcId + ".pdf").then(cUri => {
      console.log("uri obj " + cUri);
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: '*/*'
      });
    });


  }


  getDownloadItem() {
    var status = this.state.fileDownloaded;
    if (status == 0) {
      return <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 2, paddingHorizontal: 6, borderColor: Colors.textDark, borderRadius: 1, borderWidth: 0.4 }}>

        <Image style={{


          marginHorizontal: 16, width: undefined, height: 12, aspectRatio: 1,
        }}
          source={require('../../images/down.png')}
        />

      </View>;
    } else if (status == 1) {
      return <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 2, paddingHorizontal: 6, borderColor: Colors.textDark, borderRadius: 1, borderWidth: 0.4 }}>
        <ActivityIndicator
          style={{
            marginHorizontal: 16,
            height: 10, width: 10
          }}
          color={Colors.dream11red}
          size={10}
        />
      </View>;
    } else {
      return <TouchableOpacity onPress={() => {
        this.openFile();
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 2, paddingHorizontal: 6, borderColor: Colors.textDark, borderRadius: 1, borderWidth: 0.4 }}>
          <CustomText>OPEN</CustomText>
        </View>
      </TouchableOpacity>
    }


  }




  loadDashboard() {
    console.log("my constest loading..." + JSON.stringify(this.props.mObj));

    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matchcontests/getbymatchuser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        match_key: this.props.mObj.key,
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response  mycontest " + JSON.stringify(responseJson));
        if (responseJson.message.includes("TypeError")) {
          this.loadDashboard();
          return;
        } else {
          if (this.props.fromCompletedOrLive) {
            EventBus.getInstance().fireEvent("scorecard", {})
          }
          this.setState({ loading: false, response: responseJson.data });

        }


      })

  }



  onItemCLicked(myItem, isCardClicked) {
    console.log("myItem " + JSON.stringify(myItem))
    //from completed or live
    if (this.props.fromCompletedOrLive) {
      Actions.LeaderBoardTab({
        fromCompleted: this.props.fromCompleted,
        isMyCard: true,
        isLive: this.props.isLive,
        mItem: myItem,
        teamName: this.props.teamName,
        date: this.props.date,
        teamSize: this.props.teamSize,
        mObj: this.props.mObj
      });
    } else {
      //join button clicked
      // Actions.ContestDetails({
      //   showHeader: true,
      //   prize_formula: myItem.prize_formula,
      //   matchcontest_id: myItem.matchcontest_id
      // })

      Actions.ContestDetailTab({
        isMyCard: true,
        mItem: myItem,
        teamName: this.props.teamName,
        date: this.props.date,
        teamSize: this.props.teamSize,
        mObj: this.props.mObj
      });

    }

  }





  getUpDownIcon(number) {
    if (number == 2) {
      return require('../../images/ic_arrow_up.png');
    } else if (number == 1) {
      return require('../../images/ic_arrow_down.png');
    } else if (number == 0) {
      return null;
    }
    return null;
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
            }
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 16 }}
            ListFooterComponent={<View style={{ height: 30 }}></View>}
            ListEmptyComponent={Nodata()}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            data={this.state.response}
            renderItem={({ item, index, separators }) =>
              <ContestCard
                isLive={this.props.isLive}
                isMyCard={true}
                myItem={item}
                onItemCLicked={this.onItemCLicked.bind(this)}
                fromCompletedOrLive={this.props.fromCompletedOrLive}
                onBottomSheetShow={this.onBottomSheetShow.bind(this)}
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


        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={150}
          openDuration={10}
          customStyles={{
            flex: 1
          }}
        >


          {this.state.loadingGetpdf ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator
              style={{
                marginHorizontal: 16,
                height: 10, width: 10
              }}
              color={Colors.dream11red}
              size={30}
            />
          </View> : <View style={{ flex: 1, backgroundColor: Colors.appMedium }}>
              <CustomText style={{ textAlignVertical: "center", flex: 1, width: "100%", textAlign: "center", fontWeight: "bold" }}>Download Teams</CustomText>
              <CustomText style={{ flex: 1, textAlignVertical: "center", textAlign: "center", }}>Teams Locked! Download & track your competition.</CustomText>
              <View style={{ paddingHorizontal: 6, flex: 1, alignItems: "center", flexDirection: "row", backgroundColor: Colors.white, margin: 16 }}>
                <CustomText style={{ textAlignVertical: "center", flex: 2, fontWeight: "bold" }}>ALL Teams</CustomText>
                <TouchableOpacity onPress={() => {
                  this.downloadFile();
                }}>


                  {this.getDownloadItem()}




                </TouchableOpacity>
              </View>

            </View>}
        </RBSheet>

      </View>


    )



  }

}



const stylesCurrent = StyleSheet.create({


});


