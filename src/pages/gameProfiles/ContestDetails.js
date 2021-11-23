import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, RefreshControl, TextInput as TextInput, TouchableOpacity, View } from "react-native";
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Capsule from '../../components/Capsule';
import { default as Colors, default as COLORS } from '../../components/colors';
import CustomText from '../../components/CustomText';
import MyToolbar from '../../components/MyToolbar';
import styles from '../../components/styles';
import { show } from '../../utils/Globals';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Nodata from '../../components/Nodata';


export default class ContestDetails extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selected: {
        rank: 1,
        prize:0,
      }
    }
  }


  loadDashboard() {
    this.setState({ loading: false });
    EventBus.getInstance().fireEvent("scorecardLeaderboard",null
    )
   

  }



  getItem(item,index){
    var bgStripColor = index%2==0?Colors.white:Colors.white;
 
   return  <View style={{ paddingHorizontal: 16, paddingVertical:16,
   alignItems: "center", justifyContent: "space-between",
    flexDirection: "row", backgroundColor: bgStripColor,
     marginBottom:2 }}>

                  <View style={{ flex:2,flexDirection: "row", alignItems: "center" }}>
                    
                    <View>
                      <CustomText style={{ fontSize: 13 ,fontWeight:"bold"}}># {item.from_rank==item.to_rank?item.from_rank:item.from_rank+"-"+item.to_rank}</CustomText>
                    </View>
                  </View>
                  <View style={{flex:1,alignItems:"flex-end"}}>
                  <CustomText style={{  fontWeight:"bold"}}>{RUPPE}{item.pay_amount}</CustomText>
                  </View>

                </View>
           
           
  }

  updatePLayerItemSelection(player) {
    var list = this.state.response;
    player.selected = !player.selected;
    this.setState({
      response: list
    });
  }

  onSelect(mItem, mInd) {
    Actions.TeamView( {
      toRefresh:false,
      team_id:mItem.team_id
    });
  }

  onBack = () => {
    Actions.pop();
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

{this.props.showHeader?
<MyToolbar
            title="Prize Breakup"
            onBack={this.onBack}
          />
          :null}
        <View style={{
          borderColor: Colors.textLight, borderWidth: 0.2,
          paddingHorizontal: 16,
          paddingVertical: 8, backgroundColor: Colors.white,
          flexDirection: "row", justifyContent: "space-between"
        }}>



          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.rank = selected.rank == 2 ? 1 : 2
                selected.prize = 0;
                this.setState({
                  selected: selected
                });
              }
            }>
            <View style={{ flexDirection: "row",justifyContent:"flex-start" }}>
              <CustomText style={{ fontSize: 11,color:Colors.textlightCreateTeam }}>RANK</CustomText>
      
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={
              () => {

                selected.prize = selected.prize == 2 ? 1 : 2
                selected.rank = 0;
                this.setState({
                  selected: selected
                });
              }
            }
          >
            <View style={{ flexDirection: "row",justifyContent:"flex-end" }}>
              <CustomText style={{ fontSize: 11 ,color:Colors.textlightCreateTeam}}>PRIZE</CustomText>
   
            </View>
          </TouchableOpacity>

      
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          shouldCancelWhenOutside={false}
          style={styles.list_container}
          refreshControl={
            <RefreshControl refreshing={this.state.loading
            } onRefresh={this.loadDashboard.bind(this)} />
          }>

     
            <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props.prize_formula}
            data={this.props.prize_formula}
             
            renderItem={({ item, index, separators }) =>
             this.getItem(item,index) 
            }
          /> 
  
        </ScrollView>



      </View>


    )



  }

}


