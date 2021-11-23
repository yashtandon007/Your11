import 'moment-timezone';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { FlatList, Image, Keyboard, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import EventBus from 'react-native-event-bus';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import Nodata from '../components/Nodata';
import styles from '../components/styles';
import { width } from './home/Home';


export default class PointSystem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      response: this.props.response
    };
  }


  onBack = () => {
    Actions.pop();
  }



  render() {



    return (
      <ScrollView

        showsVerticalScrollIndicator={false}
        shouldCancelWhenOutside={false}
        style={{ flex: 1 }}
      >
        <View
          style={styles.container_home}
        >





          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={Nodata("")}
            horizontal={false}
            keyExtractor={(item, index) => index.toString()}
            style={{ margin: 6 }}
            data={this.state.response}
            renderItem={({ item, index, separators }) => {

              var txtColor = parseInt(item.amount) >= 0 ? COLORS.green : COLORS.red;
              return <View style={{
                borderRadius: 12,
                marginBottom: 2,
                alignSelf: 'stretch',

              }}>
                {item.header ?
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginHorizontal: 16, }}>

                    <Image style={{
                      width: undefined, height: 30, aspectRatio: 1,
                    }}
                      source={require('../images/icon.png')} />

                    <CustomText
                      style={{
                        marginHorizontal: 6,
                        height: 50,
                        textAlign: "center",
                        textAlignVertical: "center",
                        fontSize: 14,
                        color: "#000"
                      }}
                    >
                      {item.header}
                    </CustomText>
                  </View> : null}


                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 16,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flex: 1,
                    flexDirection: "row"
                  }}>

                  <CustomText
                    style={{
                      fontSize: 14,
                      color: "#000"
                    }}
                  >
                    {item.name}
                  </CustomText>
                  <CustomText
                    style={{
                      color: txtColor,
                      fontSize: 14,
                    }}
                  >
                    {item.amount}
                  </CustomText>

                </View>




              </View>
            }}
          />

          <View style={{ margin: 25 }}>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ marginEnd: 16 }}>{'\u2022'}</CustomText>
              <CustomText style={{ fontSize: 12 }}>The cricketer you choose to be your Fantasy Cricket Team's Captain will receive 2 times the points</CustomText>
            </View>
            <View style={{ flexDirection: "row",marginTop:6 }}>
              <CustomText style={{ marginEnd: 16 }}>{'\u2022'}</CustomText>
              <CustomText style={{ fontSize: 12 }}>The Vice-Captain will receive 1.5 times the points for his/her performance</CustomText>
            </View>
            <View style={{ flexDirection: "row",marginTop:6 }}>
              <CustomText style={{ marginEnd: 16 }}>{'\u2022'}</CustomText>
              <CustomText style={{ fontSize: 12 }}>The Fielder will receive 1.25 times the points for his/her performance</CustomText>
            </View>
          </View>

        </View>
      </ScrollView>

    )



  }





}


