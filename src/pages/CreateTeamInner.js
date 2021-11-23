import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../components/Capsule';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import YImageLoad from '../components/YImageLoad';
import styles from '../components/styles';
import { show } from '../utils/Globals';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
 import * as constants from '../utils/constants';

export default class CreateTeamInner extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      response: this.props.list,
      
    }
  }

  componentDidMount() {
    EventBus.getInstance().addListener("updateListSort",
      this.listener = data => {
        // handle the event
        this.setState({
          selected: data
        })
      })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  updatePLayerItemSelection(inde) {
    var list = this.state.response;
    //  list[inde].is_selected = !list[inde].is_selected;
    this.setState({
      response: list
    });



  }



  onSelect(player, ind) {
    if (this.props.checkBeforeSelectingPLayer(player)) {
      console.log("onSelect");
      this.updatePLayerItemSelection(ind);
      EventBus.getInstance().fireEvent("updateCredits")
    }
  }


 


  getUpDownIcon(number) {
    if (number == 1) {
      return require('../images/ic_arrow_up.png');
    } else if (number == 2) {
      return require('../images/ic_arrow_down.png');
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
          flexDirection: "row",
        }}>



          <TouchableOpacity
            style={{ flex: 3 }}
            onPress={
              () => {

                selected.name = selected.name == 2 ? 1 : 2
                selected.season_points = 0;
                selected.credits = 0;
                this.setState({
                  selected: selected
                });
                EventBus.getInstance().fireEvent("updateListSort", this.state.selected
                )
              }
            }>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ fontSize: 11, marginStart: 64,  color:Colors.textlightCreateTeam }}>NAME</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.name)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.season_points = selected.season_points == 2 ? 1 : 2
                selected.name = 0;
                selected.credits = 0;
                this.setState({
                  selected: selected
                });
                EventBus.getInstance().fireEvent("updateListSort", this.state.selected
                )
              }
            }
          >
            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
              <CustomText style={{ fontSize: 11  ,color:Colors.textlightCreateTeam }}>POINTS</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.season_points)} />
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.credits = selected.credits == 2 ? 1 : 2
                selected.name = 0;
                selected.season_points = 0;
                this.setState({
                  selected: selected
                });
                EventBus.getInstance().fireEvent("updateListSort", this.state.selected
                )
              }
            }
          >
            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
              <CustomText style={{ fontSize: 11 }}>CREDITS</CustomText>
              <Image
                style={{
                  width: 15, height: 15, marginEnd: 3
                }}
                source={this.getUpDownIcon(selected.credits)} />
            </View>
          </TouchableOpacity>

        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 60 }}></View>}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          data={this.state.response.sort((a, b) => {

            var selected = this.state.selected;
            if (selected.name == 1) {
              return a.name.localeCompare(b.name);
            } else if (selected.name == 2) {
              return b.name.localeCompare(a.name);

            } else if (selected.season_points == 1) {
              return a.season_points > b.season_points

            } else if (selected.season_points == 2) {
              return a.season_points < b.season_points

            } else if (selected.credits == 1) {
              if (a.credit_value == b.credit_value) {
                return a.name.localeCompare(b.name);
              }
              return a.credit_value > b.credit_value
            } else if (selected.credits == 2) {
              if (a.credit_value == b.credit_value) {
                return a.name.localeCompare(b.name);
              }
              return a.credit_value < b.credit_value;
            }
          })}
          renderItem={({ item, index, separators }) => {
            var bgColor = item.is_selected ? Colors.greenLight : Colors.white;
            var icon = item.is_selected ? require('../images/ic_clear_red.png') : require('../images/add.png');
            console.log("yahs "+JSON.stringify(item));
            var ext = "";
            ext =item.player_key;
            ext = ext.toLowerCase()+".png";
            var date =new Date();
            
            
            return <TouchableOpacity
              onPress={
                () => {
                  this.onSelect(item, index);
                }
              }
            >
              <View>
              <View style={{ marginVertical:2,paddingHorizontal: 12, paddingVertical: 6, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: bgColor}}>

<View style={{ flex: 2.5, paddingEnd: 32, flexDirection: "row", alignItems: "center" }}>
  <View style={{}}>
    
    <YImageLoad
style={{
marginEnd:16,
width: undefined, height: 40, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
}}

placeholderSource={require('../images/player.png')}
yurl={constants.PLAYER_IMAGE+ext+"?a="+date+""}/>

    {/* <CustomText style={{position:"absolute",bottom:0}}>{item.team_key}</CustomText> */}
    <CustomText style={{ fontSize: 12, width: 60 }}>{item.team_key == "a" ? this.props.aName : this.props.bName}</CustomText>
  </View>

  <View>
    <CustomText style={{  height: 20,fontSize: 12,fontWeight:"bold" }}>{item.name}</CustomText>
    {
      item.is_playing ==2?
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={{
            width: undefined, height: 10, aspectRatio: 1
          }}
            source={require('../images/tick.png')} />
          <CustomText style={{ marginStart: 6, fontSize: 11 }}>Playing</CustomText>
        </View> :
        null

    }
    {
      item.is_playing ==1?
          <Image style={{
            width: undefined, height: 10, aspectRatio: 1
          }}
            source={require('../images/cross.png')} />
         :
        null

    }
  </View>
</View>
<CustomText style={{  height: 20,flex: 1, justifyContent: "center", textAlign: "center",fontSize:12, fontWeight: "bold" ,color:Colors.textlightCreateTeam  }}>{item.season_points}</CustomText>
 
<View style={{ flex: 1, flexDirection: "row" }}>

  <CustomText style={{ flex: 1, justifyContent: "center", textAlign: "center",fontSize:12, fontWeight: "bold" }}>{item.credit_value}</CustomText>
  <TouchableOpacity
    onPress={
      () => {
        this.onSelect(item, index);
      }
    }>
    <Image style={{
      marginStart: 16, width: undefined, height: 20, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
    }}
      source={icon}
    />
  </TouchableOpacity>

</View>


</View>

              </View>
            </TouchableOpacity>
          }

          }
        />



      </View>


    )



  }

}


