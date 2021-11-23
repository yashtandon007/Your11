import React, { Component } from 'react';
import CustomText from './CustomText';
const card = ({ title, desc }) => (
  <View style={{
    paddingTop: 30,
    paddingBottom: 30,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { x: 0, y: 10 },
    shadowOpacity: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    marginTop: 20,
  }}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 20,
    }}>
      <View style={{ flexDirection: 'column' }}>
        <CustomText>{title}</CustomText>
        <CustomText>{desc}</CustomText>
      </View>
    </View>
  </View>
)


export default class Card extends Component {
  render() {
    return (
      <Card
        title={"d"}
        desc={"card.desc"}
      />
    )
  }
}

