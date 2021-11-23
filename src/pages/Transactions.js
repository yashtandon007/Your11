import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { FlatList, Keyboard, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';


export default class Transactions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      response: {
        "data": []
      }
    };


  }


  componentDidMount() {
    this.loadDashboard();
  }

  onBack = () => {
    //Alert.alert('OnChage '+key+" "+value);
    console.log("onBack..Wallet");
    Actions.pop();
  }


  loadDashboard() {

    this.setState({ loading: true });

    fetch(GLOABAL_API + 'wallets/transactionlogs', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response " + responseJson);
        this.setState({ loading: false, response: responseJson });
      })
      .catch((error) => {
        this.setState({ loading: false, response: null });

      });
    Keyboard.dismiss();
  }



  render() {


    return (
      <View
        style={styles.container_home}
      >

        <ScrollView
          shouldCancelWhenOutside={false}
          keyboardShouldPersistTaps="always"
          style={styles.list_container}
          refreshControl={
            <RefreshControl refreshing={this.state.loading
            } onRefresh={this.loadDashboard.bind(this)} />
          }>
          <MyToolbar
            title="Transaction Logs"
            onBack={this.onBack}
          />

          <FlatList
            keyExtractor={(item, index) => index.toString()}
            style={{ margin: 16 }}
            data={this.state.response.data}
            renderItem={({ item, index, separators }) =>
              <View style={{
                borderRadius: 12,
                marginBottom: 6,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: { x: 0, y: 10 },
                shadowOpacity: 1,
                alignSelf: 'stretch',
                backgroundColor: Colors.white,
              }}>

                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >

                  <View
                    style={{
                      padding: 16,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      flex: 1,

                    }}>



                    <CustomText
                      style={{
                        fontSize: 14,
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        color: COLORS.textDark
                      }}
                    >
                      Trans id     : {item.transaction_id}

                    </CustomText>

                    <View style={{ flexDirection: "row" }}>

                      <CustomText
                        style={{
                          fontSize: 14,
                          flex: 1,
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          color: COLORS.textDark
                        }}
                      >
                        Trans Date : <Moment format="DD/MM/YYYY HH:mm" date={item.transaction_datetime}
                          element={Text} interval={0}
                        />
                      </CustomText>

                      {item.transaction_type == "credit" ?

                        <CustomText
                          style={{
                            fontSize: 14,
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            color: COLORS.green
                          }}
                        >
                          {RUPPE} {item.wallet.deposits
                            + item.wallet.winnings
                            + item.wallet.bonus}

                        </CustomText> :


                        <CustomText
                          style={{
                            fontSize: 14,
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            color: COLORS.red
                          }}
                        >
                          {RUPPE} {item.wallet.deposits
                            + item.wallet.winnings
                            + item.wallet.bonus}

                        </CustomText>
                      }
                    </View>
                    <CustomText
                      style={{
                        fontSize: 14,
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        color: COLORS.textDark
                      }}
                    >
                      {item.remarks}

                    </CustomText>




                  </View>



                </TouchableOpacity>
              </View>
            }
          />
        </ScrollView>
      </View>


    )



  }





}


