import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { default as Colors, default as COLORS } from './colors';


export default class Loader extends Component {
  render() {
    return (


      <View style={{

        justifyContent: 'center'
        , alignContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%'
        , flex: 1
      }}>

        <ActivityIndicator
          style={{
            height: 60, width:60,
            backgroundColor:"#fff",
            alignContent: "center", alignItems: "center",
            alignSelf: 'center', justifyContent: 'center',
            borderColor:"#000",borderWidth:1, borderRadius: 30,
           
          }}
          color={Colors.dream11red}
          size="large"
        />

      </View>
    )
  }
}
