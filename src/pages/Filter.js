import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import CheckBox from 'react-native-check-box';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';


export default class Filter extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0,
      newLi: props.newList
    }

  }


  onSelectKey(index) {
    this.setState({
      selectedItem: index
    });
  }
  onApply() {

    Actions.pop();
    EventBus.getInstance().fireEvent(this.props.eventKey, {
      "list": this.props.newList
    })


  }

  onBack = () => {

    console.log("onBack " + this.props.oldList[0].sublist[0].isChecked)
    Actions.pop();
    EventBus.getInstance().fireEvent(this.props.eventKey, {
      "list": this.props.oldList
    })
  }

  clearFilters = () => {

    var list = this.state.newLi;
    for (i = 0; i < list.length; i++) {
      var sublist = list[i].sublist;
      for (j = 0; j < sublist.length; j++) {
        var obj = sublist[j];
        obj.isChecked = false;
      }
    }
    this.setState({
      selectedItem: 0,
      newLi: list
    });
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: Colors.app,
          flex: 1
        }}>

        <View
          style={{
            height: 70,

            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={this.onBack.bind(this)}><Image style={{
              margin: 16, width: undefined, height: 30, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
            }}
              source={require('../images/back.png')} />

          </TouchableOpacity>
          <CustomText
            style={{
              flex: 1,
              marginTop: 16,
              fontSize: 21,
              fontWeight: '500',
              color: '#ffffff',
              textAlign: 'center'
            }}

          > Filters
          </CustomText>


          <TouchableOpacity
            style={{
              marginTop: 19, marginEnd: 16

            }}

            onPress={this.clearFilters}>

            <CustomText
              style={{
                fontSize: 15,
                color: '#ffffff',
                textAlign: 'center'
              }}

            > Clear Filters
          </CustomText>

          </TouchableOpacity>




        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 1
          }}>

          <View style={{ flex: 2 }}>
            <FlatList
              style={{

                flex: 1, backgroundColor: Colors.applight
              }
              }
              keyExtractor={(item, index) => index.toString()}
              data={this.state.newLi}
              renderItem={({ item, index, separators }) =>



                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {
                    this.state.selectedItem == index ?
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10 / 2,
                          justifyContent: "center",
                          backgroundColor: COLORS.button,
                          marginStart: 16, marginEnd: 3
                        }} /> : <View style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10 / 2,
                          justifyContent: "center",
                          backgroundColor: Colors.applight,
                          marginStart: 16, marginEnd: 3
                        }} />
                  }
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      height: 60, marginStart: 6
                    }}
                    onPress={this.onSelectKey.bind(this, index)}>

                    <CustomText style={{
                      color: COLORS.white
                    }}>


                      {item.key}


                    </CustomText>
                  </TouchableOpacity>
                </View>

              }
            />

          </View>

          <View style={{ flex: 3 }}>
            <FlatList


              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.newLi[this.state.selectedItem].sublist}
              renderItem={({ item, index, separators }) =>
                <View style={{
                  marginEnd: 16,
                  marginBottom: 6,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowOffset: { x: 0, y: 10 },
                  shadowOpacity: 1,
                  alignSelf: 'stretch',
                  marginTop: 6,
                }}>

                  <CheckBox
                    style={{ flex: 1, padding: 10 }}
                    onClick={() => {
                      var res = this.state.newLi;
                      var selectedIt = this.state.selectedItem;
                      res[selectedIt].sublist[index].isChecked = !res[selectedIt].sublist[index].isChecked
                      this.setState({
                        newLi: res
                      });

                    }}
                    checkBoxColor={COLORS.white}
                    isChecked={item.isChecked}
                    rightText={item.key}
                    rightTextStyle={{
                      color: COLORS.white
                    }
                    }
                  />



                </View>
              }
            />
          </View>



        </View>


        <TouchableOpacity
          style={{ marginTop: 6, height: 50, backgroundColor: COLORS.applight, alignItems: "center", alignContent: "center", justifyContent: "center" }}
          onPress={this.onApply.bind(this)}>
          <CustomText
            style={{
              fontWeight: '500', color: COLORS.white, alignItems: "center", alignContent: "center", justifyContent: "center"
              , color: COLORS.button, fontSize: 19,
            }}

          >
            APPLY
              </CustomText>
        </TouchableOpacity>





      </View>
    );
  }
}
