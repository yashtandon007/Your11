import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList,ScrollView } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import CustomText from '../components/CustomText';
import Loader from '../components/Loader'
import styles from '../components/styles';

export default class ContestCreateBreakup extends Component {



  constructor() {
    super();

    this.state = {
      selectedIndex:0,
      response: [],
      loading: false,
      list: [1, 2, 3, 4]
    };
  }


  componentDidMount() {
    this.loadDashboard();
  }

  loadDashboard() {


    this.setState({ loading: true });

    var bodyTxt = JSON.stringify({
      spots_count: parseInt(this.props.spots),
      prize_pool: parseInt(this.props.prizePool)
    })
    console.log("Body " + bodyTxt);
    fetch(GLOABAL_API + 'privatecontests/getprizebreakup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      },
      body: bodyTxt

    })
      .then((response) => response.json())
      .then((responseJson) => {


        console.log("response " + JSON.stringify(responseJson));
        this.setState({
          loading: false, response: responseJson.data
        });
      }).catch(error => {
        // handle the error
        this.setState({
          loading: false
        });
      });

  }

  getItem(item,index) {
    var borderColor = this.state.selectedIndex == index?COLORS.green:COLORS.iconGrey;
    var winnerText = item.winners==1?"Winner":"Winners";
    return <TouchableOpacity onPress={()=>{
      this.setState({
        selectedIndex:index
      })
    }}><View style={{ marginTop:12,marginHorizontal:10, backgroundColor: COLORS.white, borderColor: borderColor, borderWidth: 1.3, borderRadius: 6, paddingVertical: 16 }}>
      <View style={{ paddingHorizontal:12,flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <View style={{flexDirection:"row"}}>
        <CustomText style={{ fontWeight: "bold",fontSize:13 }}>{item.winners} {winnerText} </CustomText>
        {/* {
          index==0?        <CustomText style={{ marginTop:2,textAlignVertical:"auto",fontWeight: "bold",fontSize:10,color:COLORS.green }}> (Recommended)</CustomText>
:null
        }         */}
        </View>
        {this.state.selectedIndex == index? this.getSelectedIcon():this.getNormalIcon()}
      
      </View>
      {this.getRow(null, -1,item.prize_formula)}
      {
        item.prize_formula.map((itemRow, index) => this.getRow(itemRow, index,item.prize_formula))
      }

    </View>
    </TouchableOpacity>
  }

  getRow(itemRow, index,list) {

    var rankToShow = "";
    if (itemRow != null) {
      rankToShow = itemRow.from_rank === itemRow.to_rank ? itemRow.from_rank : "" + itemRow.from_rank + " - " + itemRow.to_rank
    }
    return <View style={{}}>
      {index == -1 ? <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2, paddingVertical:4, paddingHorizontal: 16, }}>

        <CustomText style={{flex:1,fontSize:10}}>Rank</CustomText>
        <CustomText style={{flex:1.3,fontSize:10}}>% Of Prize Pool</CustomText>
        <CustomText style={{flex:1,fontSize:10}}>Total Winnings</CustomText>

      </View> :
        <View style={{ flexDirection: "row", marginBottom: 2, paddingVertical: 8, paddingHorizontal: 16, }}>



          <CustomText style={{flex:1,fontSize:11,}}>{rankToShow}</CustomText>
          <CustomText style={{flex:1.3,fontSize:11,}}>{itemRow.pay_percent}</CustomText>
          <CustomText style={{flex:1,fontSize:11,}}>{RUPPE}{itemRow.pay_amount}</CustomText>

        </View>}

        {index === list.length-1?null:<View style={{backgroundColor:COLORS.iconGrey,height:0.4}}></View>
}

    </View>;
  }

  onBack = () => {
    Actions.pop();
  }

  createContest() {
    const {response,selectedIndex} = this.state;

    global.createContest = {
      
        match_key:this.props.match_key,
        short_name:global.short_name,
        contest_details:{
          joining_fee: this.props.joiningFee,
          spots_count:this.props.spots,
          number_of_teams_allowed:this.props.entryToSend,
          total_amount:this.props.spots*this.props.joiningFee,
          contest_name:this.props.contestName,
          prize_pool:this.props.prizePool,
          winner_count:response[selectedIndex].winners,
          prize_formula:response[selectedIndex].prize_formula,
        },
        
    };
    console.log("create COntest obj = "+JSON.stringify(global.createContest));
    var futureDate = new Date(2030, 11, 24, 10, 33, 30);
    if (this.props.teamSize > 0) {
      Actions.ContestCreateSelectTeams({
        ...this.props,
      });
    } else {
      Actions.CreateTeam({
        joiningFee: this.props.joiningFee,
        fromCreateContest: true,
        date: futureDate.toString,
        match_key: this.props.match_key
      });
    }

  }

  getSelectedIcon() {
    return <View style={stylesCurrent.item}>
      <View style={stylesCurrent.itemSelected}>

      </View>
    </View>
  }

  getNormalIcon() {
    return <View style={stylesCurrent.item}>
  </View>
  }



  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.dream11Bg

        }}>

        <MyToolbar
          title={"Create a Contest"}
          onBack={this.onBack}
        />


        <View style={{ padding: 4, backgroundColor: COLORS.white }}>
          <View style={{}}>
    
            <CustomText style={{marginTop:6,marginLeft:10, fontSize: 12, fontWeight: "bold" }}>{this.props.contestName}</CustomText>

          </View>

          <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", }}>
            <View style={{}}>
              <CustomText style={{ fontSize: 10, color: COLORS.textLight }}>

                Prize Pool
            </CustomText>
              <CustomText style={{ fontSize: 13, fontWeight: "bold" }}>{RUPPE}{this.props.prizePool}</CustomText>

            </View>


            <View style={{}}>
              <CustomText style={{ fontSize: 10, color: COLORS.textLight }}>

                Entry
            </CustomText>
              <CustomText style={{ fontSize: 13, fontWeight: "bold" }}>{RUPPE}{this.props.joiningFee}</CustomText>

            </View>

            <View style={{}}>
              <CustomText style={{ fontSize: 10, color: COLORS.textLight }}>

                Contest Size
            </CustomText>
              <CustomText style={{ fontSize: 13, fontWeight: "bold" }}>{this.props.spots}</CustomText>

            </View>


          </View>

        </View>
        <View style={{ backgroundColor: COLORS.black, height: 0.3 }}></View>



        <ScrollView

showsVerticalScrollIndicator={false}
shouldCancelWhenOutside={false}
style={{flex:1}}
>
<View>
{
          this.state.response.map((item,index) => this.getItem(item,index))
        }

</View>
  </ScrollView>




        
        <View style={{ backgroundColor:COLORS.white,paddingLeft: 12, paddingRight: 12,paddingTop:3,borderColor:COLORS.iconGrey,borderWidth:1, }}>


          <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>

            <TouchableOpacity style={stylesCurrent.submit} onPress={
              () => {
                this.createContest();
              }
            }>
              <CustomText style={[styles.buttonText,{fontSize:12}]}>

                CREATE CONTEST


  </CustomText>
            </TouchableOpacity>
          </View>


        </View>



        {this.state.loading ? <Loader /> : null}
      </View>
    );
  }
}


const stylesCurrent = StyleSheet.create({

  submit: {
    flex: 1,
    alignSelf: 'baseline',
    paddingVertical: 10,

    borderRadius: 6,
    paddingHorizontal: 16,
    marginBottom: 6,
    fontSize: 16,
    backgroundColor: COLORS.button
  },
  picker: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingStart: 6,
    margin: 3,

    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: "#000000",
    marginTop: 8,
  },
  item: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: COLORS.green,
    borderWidth: 2.2
  },
  itemSelected: {
    backgroundColor: COLORS.green,
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    borderColor: COLORS.black,
    borderWidth: 1

  }

});

