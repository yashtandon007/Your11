import React, { Component } from 'react';
import { Image,Alert, ActivityIndicator, Keyboard, RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import { show } from '../utils/Globals';


export default class Wallet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      response: null
    };


  }



  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..Wallet");
    Actions.pop();
  }

 

  componentDidMount(){
    EventBus.getInstance().addListener("refreshWallet",
    this.listener = player => {
        this.loadDashboard();
    })

    this.loadDashboard();
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
}
  loadDashboard() {

  
    fetch(GLOABAL_API + 'users/get', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response " + JSON.stringify(responseJson.data));
        this.setState({ loading: false, response: responseJson.data });
      })

    Keyboard.dismiss();
  }

  addMoney = () => {
    const amountMoney = this.state.amount;
    console.log("addMoney " + amountMoney);
    if (amountMoney >= 1) {
      if(this.props.fromContestDetails){
          Actions.pop();
      }
     // Linking.openURL(GLOABAL_API + "payments/initiate")
    
      Actions.WebViewPayment({
        fromContest:this.props.fromContestDetails,
        amountProps: amountMoney
      });
    } else {
      Alert.alert("Enter a minimum amount of rupees 1.");

    }

  }

  render() {

    var txt = "Verify Now";
    if(this.state.response !=null){
      if(this.state.response.bank_details.status == "verified"){
        txt = "WITHDRAW";
    }
    }
    return (

      <View

        style={{
          width: "100%",
          flex: 1,
          backgroundColor: Colors.app
        }}
      >
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
          shouldCancelWhenOutside={false}
          keyboardShouldPersistTaps="always"
          style={styles.list_container}
          refreshControl={
            <RefreshControl refreshing={this.state.loading
            } onRefresh={this.loadDashboard.bind(this)} />
          }>
          {this.state.loading ?
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
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
          />
              </View>

            :
            <View style={{
              flex: 1, backgroundColor: Colors.app
            }}>
              {this.props.fromContestDetails?
              <MyToolbar
              title="INSUFFICIENT BALANCE"
              onBack={this.onBack}
            />:
            <MyToolbar
                title="Wallet"
                onBack={this.onBack}
              />}


            

     <View style={{
          paddingStart:6,
          paddingEnd:6,}}>
            
            <View >

<View
                style={{

                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <CustomText
                  style={{
                    marginTop:16,
                    color: COLORS.textLight,
                    fontSize: 15
                  }}>
                  Total Balance
       </CustomText>
                <CustomText
                  style={{
                    textAlign: 'right',
                    color: COLORS.textDark,
                    fontSize: 20
                  }}>
                  {RUPPE} {this.state.response.wallet.deposits +
                    this.state.response.wallet.winnings +
                    this.state.response.wallet.bonus}
                </CustomText>
              </View>
                        {/* {DEPOSIST} */}
                        <View style={{ padding: 2 }}>
                          <View style={{ height: 1, backgroundColor: COLORS.applight, marginBottom: 3 }} />
                          <View
                            style={{
                              marginStart: 6, marginEnd: 6,
                              flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center"
                            }}>
                            <View
                              style={{
                                flex: 1, flexDirection: "row"
                              }}>
                              <CustomText
                                style={{
                                  marginEnd: 6,
                                  color: COLORS.e6grey,
                                  fontSize: 11
                                }}>
                                DEPOSITS
        
                  </CustomText>
        
                              <TouchableOpacity
                                onPress={
                                  () => {
                                    show('Money deposited by you that you can use to join any contest but can not withdraw')
        
                                  }
                                }
                              >
                                <Icon
                                  size={15}
                                  name="help"
                                  color={Colors.button}
                                />
                              </TouchableOpacity>
        
        
                            </View>
                            <CustomText
                              style={{
                                color: COLORS.e6grey,
                                fontSize: 13,
                                fontWeight:"bold"
                              }}>
                              {RUPPE}  {this.state.response.wallet.deposits}
                            </CustomText>
                          </View>
                          <View style={{ height: 1, backgroundColor: COLORS.applight, marginTop: 3 }} />
        
        
                        </View>
                        {/*  */}
                        <View style={{ padding: 2 }}>
        
                          <View
                            style={{
                              marginStart: 6, marginEnd: 6,
                              flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center"
                            }}>
                            <View
                              style={{
        
                                flexDirection: "row"
                              }}>
                              <CustomText
                                style={{
                                  marginEnd: 6,
                                  color: COLORS.e6grey,
                                  fontSize: 11
                                }}>
                                WINNINGS
                  </CustomText>
        
                              <TouchableOpacity
                                onPress={
                                  () => {
                                    show('Money that you can withdraw or re-use to join contests ')
        
        
                                  }
                                }
                              >
                                <Icon
                                  size={15}
                                  name="help"
                                  color={Colors.button}
                                />
                              </TouchableOpacity>
        
                            </View>
                            <View style={{ flex: 1, marginTop: 6, marginBottom: 6, alignItems: "center", justifyContent: "center" }}>
                            <View
                    style={{

                      flex: 1
                    }}>
                    <TouchableOpacity
                      onPress={
                        () => {

                          if(this.state.response.bank_details.status == "verified"){
                            Actions.WithdrawPage( {
                              obj:this.state.response.wallet
                            });
                          }else{
                            Actions.VerifyYourAccount();
                          }
                        }
                      }
                    >
                      <CustomText
                        style={{
                          borderRadius:12,
                          paddingHorizontal:6,
                          paddingVertical:3,
                          borderWidth:1,
                          borderColor:COLORS.green,
                          alignItems:"center",
                          alignContent:"center",
                          textAlign:"center",
                          textAlignVertical:"center",
                          color: COLORS.green,
                          fontSize: 11
                        }}>
                        {txt}
          </CustomText>
                    </TouchableOpacity>

                  </View>
                            </View>
                            <CustomText
                              style={{
                                color: COLORS.e6grey,
                                fontSize: 13,
                                fontWeight:"bold"
                              }}>
                              {RUPPE}  {this.state.response.wallet.winnings}
                            </CustomText>
        
        
                          </View>
        
        
                        </View>
                        {/*  */}
                        <View style={{ padding: 2 }}>
                          <View style={{ height: 1, backgroundColor: COLORS.applight, marginBottom: 3 }} />
        
                          <View
                            style={{
                              marginStart: 6, marginEnd: 6,
                              flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center"
                            }}>
                            <View
                              style={{
        
                                flex: 1, flexDirection: "row"
                              }}>
                              <CustomText
                                style={{
                                  marginEnd: 6,
                                  color: COLORS.e6grey,
                                  fontSize: 11
                                }}>
                                BONUS
                  </CustomText>
        
                              <TouchableOpacity
        
                                onPress={
                                  () => {
                                    show('Money that you can use to join any public contests ')
        
        
                                  }
                                }
                              >
                                <Icon
                                  size={15}
                                  name="help"
                                  color={Colors.button}
                                />
                              </TouchableOpacity>
        
                            </View>
        
        
                            <CustomText
                              style={{
                                color: COLORS.e6grey,
                                fontSize: 13,
                                fontWeight:"bold"
                              }}>
                              {RUPPE}  {this.state.response.wallet.bonus}
                            </CustomText>
        
                          </View>
        
                        </View>
        
        
        
                      </View>
                        
              <View style={{ marginStart: 6, marginEnd: 6, padding: 3 }}>
                <View style={{ height: 1, backgroundColor: COLORS.applight, marginBottom: 3 }} />

                <View
                  style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <View
                    style={{

                      flex: 1
                    }}>
                    {/* <TouchableOpacity
                      onPress={
                        () => {
                          Actions.WalletDetails(  )
                        }
                      }
                    >
                      <CustomText
                        style={{
                          color: COLORS.green,
                          fontSize: 11
                        }}>
                        Know More About Wallet
          </CustomText>
                    </TouchableOpacity> */}

                  </View>

                 

                </View>

                <View style={{ height: 1, backgroundColor: COLORS.applight, marginTop: 3 }} />
              </View>





{this.props.fromContestDetails?              <CustomText
                style={{
                  justifyContent: 'center',
                  alignItems: "center",
                  color: COLORS.e6grey,

                  fontSize: 15
                  , marginStart: 6, marginTop: 8, marginBottom: 3
                }}>

               Add cash to your account to join this contest.
            </CustomText>
:              <CustomText
style={{
  justifyContent: 'center',
  alignItems: "center",
  color: COLORS.textLight,

  fontSize: 11
  , marginStart: 6, marginTop: 8, marginBottom: 3
}}>

Please select or enter an amount to add.
</CustomText>
}



              <View
                style={{
                  borderWidth:0.4,borderRadius:1,
                  backgroundColor: Colors.white, justifyContent: "center",
                  marginStart: 6, marginEnd: 6, flexDirection: "row"
                }}>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingStart: 16,
                    paddingTop: 6,
                    paddingBottom: 6
                  }}>


                  <CustomText
                    style={{
                      textAlign: "left",
                      fontSize: 25
                    }}>

                    {RUPPE}
                  </CustomText>

                  <TextInput
                    style={{
                      marginStart: 6,
                      flex: 1,
                      fontSize: 25
                    }}
                    placeholderTextColor="#ffffff"
                    selectionColor="#ffffff"
                    keyboardType="number-pad"
                    maxLength={14}
                    autoFocus={false}
                    onChangeText={(amount) => this.setState({ amount })}
                    value={this.state.amount}
                  />

                  {/* {RUPPE} {this.state.amount} */}

                </View>



              </View>



              {/* white frame */}
              <View

                style={{
                  marginVertical:6,  
                  flex: 1
                }}
              >


                {/* /////////////////////////// */}
                {/* ROW 2 */}

                <View
                  style={{
                    alignItems: 'stretch',
                    flexDirection: "row",
                    justifyContent: 'center', alignSelf: 'baseline'
                  }}
                >
                  <TouchableOpacity
                    onPress={
                      () => this.setState({
                        amount: "25"
                      })
                    }
                    style={{
                      borderWidth:0.4,borderRadius:1,
                      backgroundColor: Colors.white,
                      flex: 1,paddingVertical:6
                      , alignItems: "center", justifyContent: "center"
                      , margin: 6
                    }}
                  >
                    <CustomText
                      style={{
                        justifyContent: 'center',
                        alignItems: "center",
                
                        fontSize: 15
                      }}>

                      {RUPPE}25
            </CustomText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={
                      () => this.setState({
                        amount: "100"
                      })
                    }
                    style={{
                      borderWidth:0.4,borderRadius:1,
                      backgroundColor: Colors.white,
                      flex: 1
                      , alignItems: "center", justifyContent: "center"
                      , margin: 6
                    }}
                  >
                    <CustomText
                      style={{
                        justifyContent: 'center',
                        alignItems: "center",
                        

                        fontSize: 15
                      }}>

                      {RUPPE}100
            </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={
                      () => this.setState({
                        amount: "200"
                      })
                    } style={{

                      borderWidth:0.4,borderRadius:1,
                      backgroundColor: Colors.white,
                      flex: 1
                      , alignItems: "center", justifyContent: "center"
                      , margin: 6
                    }}
                  >

                    <CustomText
                      style={{
                        justifyContent: 'center',
                        alignItems: "center",
                     
                        fontSize: 15
                      }}>
                      {RUPPE}200
            </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={
                      () => this.setState({
                        amount: "500"
                      })
                    } style={{

                      borderWidth:0.4,borderRadius:1,
                      backgroundColor: Colors.white,
                      flex: 1
                      , alignItems: "center", justifyContent: "center"
                      , margin: 6
                    }}
                  >

                    <CustomText
                      style={{
                        justifyContent: 'center',
                        alignItems: "center",
                     
                        fontSize: 15
                      }}>
                      {RUPPE}500
            </CustomText>
                  </TouchableOpacity>

                </View>

                <TouchableOpacity
                  onPress={
                    () => {
                      this.addMoney();
                    }
                  } style={{

                    borderWidth:0.4,borderRadius:1,
                    backgroundColor: Colors.green,
                    height: 50
                    , alignItems: "center", justifyContent: "center"
                    , margin: 6
                  }}
                >

                  <CustomText
                    style={{
                      justifyContent: 'center',
                      alignItems: "center",
                      color:"#fff",
                      fontSize: 15
                    }}>
                    Add Money
                  </CustomText>
                </TouchableOpacity>


                <TouchableOpacity
                  onPress={
                    () => {
                      Actions.Transactions()
                    }
                  }
                >
                 {this.props.fromContestDetails?null:      <View style={{ marginStart: 6, marginEnd: 6, padding: 3 }}>
                  
                                     <View style={{
                                      flexDirection: "row", flex: 1, justifyContent: "center",
                                      alignContent: "center"
                                    }}>
                                      <CustomText
                                        style={{
                                          flex: 1,
                                          marginTop: 6,
                                          color: COLORS.textDark,
                                          fontSize: 13,
                                          textAlign: "left"
                                        }}>
                                        Transaction Logs
                                      </CustomText>
                
                                      <View style={{
                                        justifyContent: "center",
                                        alignContent: "center"
                                      }}
                                      >
                                        <Image style={{
                                          width: 10,
                                          marginTop: 6,
                
                                          marginStart: 8, width: undefined, height: 10, aspectRatio: 1,
                                        }}
                                          source={require('../images/arrowRight.png')} />
                                      </View>
                                    </View>
            
                 
                    <View style={{ height: 1, backgroundColor: COLORS.textLight, marginTop: 6 }} />
                  </View>
    }
                </TouchableOpacity>


              </View>

            
            </View>               

      
            </View>
          }
        </ScrollView>
      </View>
    )

  }



}


