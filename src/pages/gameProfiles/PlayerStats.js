import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import YImageLoad from '../../components/YImageLoad';
import styles from '../../components/styles';
import { show } from '../../utils/Globals';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Nodata from '../../components/Nodata';
import * as constants from '../../utils/constants';
import Loader from '../../components/Loader';

export default class PlayerStats extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selected: {
        fullname: 2,
        points: 0
      },
      response: null
    }
  }



  componentDidMount() {
    this.loadDashboard()
  }




  loadDashboard() {

    console.log("my completed loading..." + GLOBAL_TOKEN);

    this.setState({ loading: true });

    fetch(GLOABAL_API + 'matchpoints/bymatch', {
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

        EventBus.getInstance().fireEvent("scorecard", {});


        console.log("response  mycompleted " + JSON.stringify(responseJson));
        this.setState({ loading: false, response: responseJson.data.players });
      })

  }



  updatePLayerItemSelection(player) {
    var list = this.state.response;
    player.selected = !player.selected;
    this.setState({
      response: list
    });
  }

  onSelect(player, ind) {
    var list = this.state.response;
    var obj = list[ind];
    Actions.PlayerInfo({
      position: ind,
      item: obj,

    });
  }

  getUpDownIcon(number) {
    if (number == 1) {
      return require('../../images/ic_arrow_up.png');
    } else if (number == 2) {
      return require('../../images/ic_arrow_down.png');
    } else if (number == 0) {
      return null;
    }
    return null;
  }
  render() {
    var selected = this.state.selected;

    return (
      <View
        style={{ backgroundColor: Colors.app, flex: 1 }}>

        <View style={{
          borderColor: Colors.textLight, borderWidth: 0.2,
          paddingHorizontal: 16,
          paddingVertical: 8, backgroundColor: Colors.white,
          flexDirection: "row", justifyContent: "space-between"
        }}>



          <TouchableOpacity
            style={{ flex: 2 }}
            onPress={
              () => {

                selected.fullname = selected.fullname == 2 ? 1 : 2
                selected.points = 0;
                this.setState({
                  selected: selected
                });
              }
            }>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CustomText style={{ fontSize: 11, }}>NAME</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.fullname)} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.points = selected.points == 2 ? 1 : 2
                selected.fullname = 0
                this.setState({
                  selected: selected
                });
              }
            }
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CustomText style={{ marginStart: 32, fontSize: 11 }}>POINTS</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.points)} />
            </View>
          </TouchableOpacity>


        </View>



        {this.state.response != null ? <FlatList
          refreshControl={
            <RefreshControl refreshing={this.state.loading
            } onRefresh={this.loadDashboard.bind(this)} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 30 }}></View>}
          ListEmptyComponent={Nodata()}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          data={this.state.response.sort((a, b) => {

            var selected = this.state.selected;
            if (selected.fullname == 1) {
              return a.fullname.localeCompare(b.fullname);
            } else if (selected.fullname == 2) {
              return b.fullname.localeCompare(a.fullname);

            } else if (selected.points == 1) {
              return a.match_points > b.match_points

            } else if (selected.points == 2) {
              return a.match_points < b.match_points

            }
            return a.match_points > b.match_points

          })}
          renderItem={({ item, index, separators }) => {
            console.log("JSON " + JSON.stringify(item));
            var bgColor = item.selected ? Colors.greenLight : Colors.white;
            var ext = "";
            ext = item.key;
            ext = ext.toLowerCase() + ".png";
            var date = new Date();

            return <TouchableOpacity
              onPress={
                () => {
                  this.onSelect(item, index);
                }
              }
            >
              <View style={{ padding: 16, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: bgColor, marginBottom: 6 }}>

                <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <YImageLoad

                      style={{
                        marginEnd: 16, width: 38, height: 38
                      }}

                      placeholderSource={require('../../images/player.png')}
                      yurl={constants.PLAYER_IMAGE + ext + "?a=" + date + ""} />

                  </View>

                  <View>
                    <CustomText style={{ fontSize: 13, fontWeight: "bold" }}>{item.fullname}</CustomText>
                    <CustomText style={{ fontSize: 11, color: Colors.textLight }}>{item.player_type}</CustomText>
                  </View>
                </View>
                <CustomText style={{ textAlign: "center", flex: 1 }}>{item.match_points}</CustomText>

              </View>
            </TouchableOpacity>
          }

          }
        /> : <Loader />}



      </View>


    )



  }

}


