import React from 'react';
import { View } from 'react-native';
import COLORS from './colors';
import CustomText from './CustomText';



export default Nodata = () => {

  return <View style={{
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }}>
    {/* <Image style={{
      height: 60, aspectRatio: 1,
    }}
      source={require('../images/nodata.png')} /> */}

    <CustomText
      style={{
        margin: 6,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.e6grey,

      }}>
      No data is currently available.
          </CustomText>

    <CustomText
      style={{

        fontSize: 12,
        color: COLORS.button,

      }}>
      Please pull down to refresh.
          </CustomText>
  </View>

}

