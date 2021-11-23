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



export default class Contest extends Component {


  constructor(props) {
    super(props);
    this.state = {
      filters: [
        {
          name: "All"
        },
        {
          name: "Head to Head"
        },
        {
          name: "Practice"

        }
      ],
      selected: {
        prizePool: 2,
        spots: 0,
        entry: 0
      },
      response: null
    }
  }

  componentDidMount() {
    this.loadDashboard();
  }

  loadDashboard() {


    console.log("loading...contests " + this.props.mObj.key);
    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matchcontests/getbymatch', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: JSON.stringify({
        match_key: this.props.mObj.key
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response contest page" + JSON.stringify(responseJson));
        this.setState({
          loading: false, response: responseJson.data
        });
      })

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



  onItemCLicked(myItem, isCardClicked) {
    if (isCardClicked) {
      Actions.ContestDetailTab({
        isMyCard: false,
        mItem: myItem,
        teamName: this.props.teamName,
        date: this.props.date,
        teamSize: this.props.teamSize,
        mObj: this.props.mObj
      });
    } else {
      console.log("myItem " + JSON.stringify(myItem));
      if (this.props.teamSize < 1) {
        Actions.CreateTeam({
          date: this.props.date,
          match_key: this.props.mObj.key
        });
      } else {
        Actions.SelectTeams({
          date: this.props.date,
          match_key: this.props.mObj.key,
          mItem: myItem
        });
      }
    }

  }

  render() {

    var selected = this.state.selected;
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >

        <View style={{ alignSelf: "stretch", paddingHorizontal: 32, paddingVertical: 8, backgroundColor: Colors.dream11Bg, flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={
              () => {

                selected.prizePool = selected.prizePool == 2 ? 1 : 2
                selected.entry = 0;
                selected.spots = 0;
                this.setState({
                  selected: selected
                });
              }
            }

          >
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ fontSize: 12 }}>PRIZE POOL</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.prizePool)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              () => {

                selected.spots = selected.spots == 2 ? 1 : 2
                selected.entry = 0;
                selected.prizePool = 0;
                this.setState({
                  selected: selected
                });
              }
            }>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ fontSize: 12 }}>SPOTS</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.spots)} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              () => {

                selected.entry = selected.entry == 2 ? 1 : 2
                selected.spots = 0;
                selected.prizePool = 0;
                this.setState({
                  selected: selected
                });
              }
            }
          >
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ fontSize: 12 }}>ENTRY</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.entry)} />
            </View>
          </TouchableOpacity>


        </View>

        <View
          style={{ flex: 1, alignSelf: "stretch", paddingTop: 8 }}
        >
        

          {
            this.state.response == null ? <View /> :
              <FlatList
                refreshControl={
                  <RefreshControl refreshing={this.state.response == null
                  } onRefresh={this.loadDashboard.bind(this)} />
                }
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 100 }}></View>}
                ListEmptyComponent={Nodata()}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
                data={this.state.response.sort((a, b) => {

                  var selected = this.state.selected;
                  if (selected.entry == 1) {
                    return parseFloat(a.joining_fee) < parseFloat(b.joining_fee)

                  } else if (selected.entry == 2) {
                    return parseFloat(b.joining_fee) < parseFloat(a.joining_fee)

                  } else if (selected.spots == 1) {
                    return a.spots_count < b.spots_count

                  } else if (selected.spots == 2) {
                    return b.spots_count < a.spots_count;
                  }
                  else if (selected.prizePool == 1) {
                    return a.prize_pool < b.prize_pool

                  } else if (selected.prizePool == 2) {
                    return b.prize_pool < a.prize_pool;
                  }
                  return a.prize_pool < b.prize_pool

                })}
                renderItem={({ item, index, separators }) =>
                  <ContestCard

                    isMyCard={false}
                    myItem={item}
                    onItemCLicked={this.onItemCLicked.bind(this)}
                  />
                }
              />
          }
        </View>
        <TouchableOpacity
          style={{ position:"absolute", alignSelf: 'center',bottom:16, }}
          onPress={
            () => {
              if(this.props.teamSize>=11){
                    show("Cant create more teams.");
              }else{
                Actions.CreateTeam({
                  date: this.props.date,
                  match_key: this.props.mObj.key
                });
              }
              
            }
          }
        >

          <View
            style={{ borderRadius:6,backgroundColor: Colors.white,borderColor:Colors.green,borderWidth:1,
               height: 40,width:150, justifyContent: "center", alignItems: "center" }}
          >
            <CustomText style={{ color: Colors.green, fontWeight: "bold", fontSize: 12 }}>
              CREATE TEAM
                  </CustomText>
          </View>
        </TouchableOpacity>


        {
          this.state.response == null ? <View
            style={{
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