import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { Image, Text, TouchableOpacity, View, FlatList, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as Colors, default as COLORS } from './colors';
import CustomText from './CustomText';
import styles from './styles';
import MatchTimer from './MatchTimer';
import { ProgressBar } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';


export default class ContestCard extends Component {

  constructor(props) {
    super(props);

  }

  onFinishTime() {
    // this.props.onFinishTime(this,this.props.indexNumber);
  }



  getContestShareView(item){
    console.log("username "+GLOBAL_userObj.username);
    console.log("item >> "+JSON.stringify(item))

    if(this.props.fromCompletedOrLive){
      return (<View style={{marginTop:12}}/>)
      ;
    }
    try{
      if(item.user_details.username ==GLOBAL_userObj.username ){
        return (<View style={{backgroundColor:COLORS.dream11Bg,marginTop:12}}>
          <View style={{paddingHorizontal:12,alignItems:"center",height:29,flexDirection:"row",marginHorizontal:12,backgroundColor:"#dcebfe"}}>
            <Text style={{flex:1,opacity:.5,fontSize:11 ,color:COLORS.black}}>Share this contest with your friends!</Text>
            <TouchableOpacity onPress={()=>{
                Actions.ShareContestCode({
                  short_name:item.short_name,
                  contest_code:item.contest_code
                });
            }}>
            <Image style={{

marginEnd: 4, width: undefined, height: 15, aspectRatio: 1,
}}
source={require('../images/share.png')}
/>
            </TouchableOpacity>
        </View>
         </View>)
       
      }else{
        return (<View style={{marginTop:12}}/>)
        ;
      }
    }catch(e){
      return (<View style={{marginTop:12}}/>)
        ;
    }
    
  }

  getContestName(item){

    return (item.contest_name?<View>
      <View style={{height:22,justifyContent:"center",marginHorizontal:16,marginVertical:6}}>
        <CustomText style={{fontSize:12,fontWeight:"bold",textTransform:"uppercase"}} >{item.contest_name}</CustomText>
    </View>
      <View style={{marginVertical:2,height:1,backgroundColor:COLORS.dream11Bg}}/>
    </View>:null)

  }





  componentDidMount() {
    console.log("this.props.myItem.teams " + JSON.stringify(this.props.myItem.teams));
  }
  render() {


    var isJoinDisable = false;
    var mOpacity = 1;

    if (this.props.myItem.spots_filled == this.props.myItem.spots_count) {
      isJoinDisable = true;
      mOpacity = 0.7;
    }
    return (<View>
        {this.getContestShareView(this.props.myItem)}
        <TouchableOpacity
        onPress={this.props.onItemCLicked.bind(this, this.props.myItem, true)}
      >
        <View style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 1,
          elevation: 1,
          backgroundColor: Colors.white,
          marginHorizontal: 8,
          borderColor: Colors.black,
          borderWidth: 0.1,
          justifyContent: "center"
        }}>
          
            {this.getContestName(this.props.myItem)}

          <View style={{}}>

            <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", }}>
              <View style={{}}>
                <CustomText style={{ fontSize: 12, color: Colors.textLight }}>

                  Prize Pool
</CustomText>
                <CustomText style={{ fontSize: 22, fontWeight: "bold" }}>{RUPPE}{this.props.myItem.prize_pool}</CustomText>

              </View>

              <View style={{ alignItems: "flex-end" }}>
                <CustomText style={{ fontSize: 12, color: Colors.textLight }}>
                  Entry
</CustomText>

                <TouchableOpacity

                  onPress={() => {
                    if (this.props.isMyCard) {

                    } else {
                      if (isJoinDisable) {
                        return;
                      }
                      this.props.onItemCLicked(this.props.myItem, false)

                    }
                  }}

                >
                  <View
                    style={{ opacity: mOpacity, marginTop: 3, backgroundColor: Colors.green, height: 25, width: 75, borderRadius: 3, justifyContent: "center", alignItems: "center", alignSelf: "flex-end" }}
                  >

                    <CustomText style={{ color: Colors.white, fontWeight: "bold", fontSize: 12 }}>
                      {RUPPE}{this.props.myItem.joining_fee}
                    </CustomText>
                  </View>
                </TouchableOpacity>



              </View>

            </View>
            <View
              style={{ paddingHorizontal: 10 }}
            >


              <ProgressBar
                style={{ backgroundColor: "#f2f2f2", height: 10, borderRadius: 3 }}
                progress={this.props.myItem.spots_filled / this.props.myItem.spots_count}
                color={Colors.progress}
              />
              <View style={{ paddingVertical: 6, flexDirection: "row", justifyContent: "space-between" }}>
                <CustomText style={{ marginBottom: 3, color: Colors.dream11red, fontWeight: "bold", fontSize: 12 }}>
                  {this.props.myItem.spots_count - this.props.myItem.spots_filled} spots left
                </CustomText>
                <CustomText style={{ marginBottom: 3, fontSize: 12 }}>
                  {this.props.myItem.spots_count} spots
                </CustomText>
              </View>
            </View>



            <View style={{ backgroundColor: "#f7f7f7", alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1, paddingStart: 6, flexDirection: "row", justifyContent: "space-between" }}>

                <View style={{ alignItems: "baseline" }}>
                  <CustomText style={{ paddingVertical: 6, fontSize: 10, marginEnd: 32 }}>{this.props.myItem.number_of_teams_allowed == 1 ? <CustomText>Single Entry</CustomText> : <CustomText>Upto {this.props.myItem.number_of_teams_allowed} Entries</CustomText>}</CustomText>

                  {
                    this.props.myItem.is_confirmed ? <CustomText style={{ paddingVertical: 6, fontSize: 10 }}>Confirmed</CustomText> : null

                  }

                </View>


              </View>

              {this.props.myItem.bonus_percent > 0 ? <CustomText style={{ marginEnd: 6, paddingVertical: 6, fontSize: 10, color: Colors.green }}>{this.props.myItem.bonus_percent}% Bonus Applicable</CustomText> : null}

              {this.props.fromCompletedOrLive ? <TouchableOpacity
                style={{ marginStart: 16 }}
                onPress={this.props.onBottomSheetShow.bind(this, this.props.myItem.matchcontest_id)}
              >

                <View style={{ flexDirection: "row", marginEnd: 16, alignItems: "center" }}>
                  <Image style={{

                    marginEnd: 4, width: undefined, height: 15, aspectRatio: 1,
                  }}
                    source={require('../images/down.png')}
                  />

                  <CustomText style={{ paddingVertical: 6, fontSize: 10 }}>All Teams</CustomText>


                </View>
              </TouchableOpacity>

                : null}

            </View>

          </View>

          {this.props.fromCompletedOrLive ? <FlatList
            style={{}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props.myItem.teams}
            data={this.props.myItem.teams}
            renderItem={({ item, index, separators }) => {
              var amountString = "";
              if (this.props.fromCompletedOrLive) {
                if (!this.props.isLive) {
                  amountString = "WON " + RUPPE + "" + item.pay_amount + "";
                } else {
                  amountString = "WINNING " + RUPPE + "" + item.pay_amount + "";
                }

              }
              return <TouchableOpacity
                onPress={() => {
                  Actions.TeamView({
                    team_id: item.team_id,
                    toRefresh: true
                  });
                }}
                style={{ paddingHorizontal: 6,  justifyContent: "space-between", paddingVertical: 6, flexDirection: "row", width: "100%", backgroundColor: Colors.greenLight }}>
                <View>
                  <CustomText>Team: {item.team_order_key}</CustomText>
                  {/* {item.pay_amount>0?<CustomText style={{fontSize:13,color:Colors.green}}>{amountString}</CustomText>:null}  */}
                </View>
                <CustomText>Rank: {item.rank}</CustomText>
                <CustomText>Points: {item.total_match_points}</CustomText>
              </TouchableOpacity>
            }

            }
          /> : null}
        </View>



      </TouchableOpacity>
    </View>


     
    );
  }
}
