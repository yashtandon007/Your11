import React, { Component } from 'react';
import { TouchableOpacity, View, Dimensions, Image ,ActivityIndicator} from 'react-native';
import COLORS from './colors';
import CustomText from './CustomText';
import { show, validateJoiningWallet } from '../utils/Globals';
import { Actions } from 'react-native-router-flux';
import EventBus from 'react-native-event-bus';



export default class SelectTeamPrizeBreakup extends Component {


  amount_to_play = 0;
  state = {
    loading:true,
    userObj:{

    },
    walletDeduction: {
      deposits:0,
      winnings:0,
      bonus:0,
    }
  }

  constructor(props) {
    super(props);
   
  }

  componentDidMount(){

    EventBus.getInstance().addListener("mobileUpdated",
    this.listener = player => {
      this.props.onJoin( this.state.walletDeduction);
    })


    var url = GLOABAL_API + 'users/get';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log({ "response": JSON.stringify(responseJson.data) });
        if (responseJson.status === 1) {
          var userObj = responseJson.data;
          var walletD = validateJoiningWallet(this.props.mItem.bonus_percent,this.props.mItem.joining_fee, userObj.wallet.bonus
            , userObj.wallet.deposits, userObj.wallet.winnings);
      
          var totalSum = walletD.winnings + walletD.bonus + walletD.deposits;
          this.amount_to_play = this.props.mItem.joining_fee - totalSum;
          console.log("walletDeduction "+JSON.stringify(walletD));
            
          this.setState({
            userObj:responseJson.data,
            loading:false,
            walletDeduction: walletD
          });
        
        }
      })
      .catch((error) => {
        console.error(error);
      });      


  }
  
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  render() {
    return (

      <View style={{
        backgroundColor: COLORS.black,
        width: width,
        justifyContent: "center",
        paddingHorizontal: 50,
        height: height
      }}>



{this.state.loading?
  <ActivityIndicator
  style={{
    height: 80, width:80,
    backgroundColor:"#fff",
    alignContent: "center", alignItems: "center",
    alignSelf: 'center', justifyContent: 'center',
    borderColor:"#000",borderWidth:1, borderRadius: 10,
   
  }}
  color={COLORS.dream11red}
  size="large"
/>:
<View style={{ paddingHorizontal: 8, paddingVertical: 16, width: "100%", height: 400, backgroundColor: "#fff", borderRadius: 3 }}>
          <View style={{ paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText
              style={{ fontSize: 16 }}>

              CONFIRMATION
            </CustomText>
            <TouchableOpacity
              onPress={this.props.disablePopUp.bind(this)}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require('../images/close.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 32, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText
              style={{ fontSize: 15 }}>

              From Bonus
            </CustomText>
            <CustomText style={{ fontWeight: "bold", textAlignVertical: "bottom" }}>
              -{this.state.walletDeduction.bonus}
            </CustomText>

          </View>

          <View style={{ marginTop: 16, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText
              style={{ fontSize: 15 }}>

              From Deposits
            </CustomText>
            <CustomText style={{ fontWeight: "bold", textAlignVertical: "bottom" }}>
              -{this.state.walletDeduction.deposits}
            </CustomText>

          </View>

          <View style={{ marginTop: 16, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText
              style={{ fontSize: 15 }}>

              From Winnings
            </CustomText>
            <CustomText style={{ fontWeight: "bold", textAlignVertical: "bottom" }}>
              -{this.state.walletDeduction.winnings}

            </CustomText>

          </View>

          <View style={{ marginTop: 16, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <CustomText
              style={{ fontSize: 15 }}>

              To Pay
            </CustomText>
            <CustomText style={{ fontWeight: "bold", textAlignVertical: "bottom" }}>
              {this.amount_to_play}
            </CustomText>

          </View>

          <TouchableOpacity
            onPress={()=>{
              if(this.amount_to_play>0){
                Actions.wallet({
                  fromContestDetails:true
                });
              }else{
                console.log(">>>>>>>>>>>>>>>>>>>>>>");

                if(this.state.userObj.mobile ==""){
                    Actions.EnterMobile();
                }else{
                  this.props.onJoin( this.state.walletDeduction);
                }
                
              }
            
            }}
            style={{ marginBottom: 16, position: "absolute", bottom: 10, backgroundColor: COLORS.green, height: 35, width: 170, borderRadius: 3, justifyContent: "center", alignItems: "center", alignSelf: "center" }}

          >

            <CustomText style={{ color: COLORS.white, fontWeight: "bold", fontSize: 12 }}>
              JOIN CONTEST
          </CustomText>
          </TouchableOpacity>

        </View>}
        



      </View>

    );
  }
}

export const { width, height } = Dimensions.get('window');
