import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import COLORS from './colors';
import CustomText from './CustomText';

export default class MaleFemale extends Component {




    constructor(props) {
        super(props);


    }

    render() {
        return (
            <View style={{
                margin: 3,
                paddingStart: 6,
                marginTop: 8, borderRadius: 6,
                justifyContent: 'center',
                paddingVertical: 10,
                borderWidth:0.2
            }}>
                {/* TABS */}

                <View
                    style={{
                        flexDirection: "row",
                       
                        alignContent: "stretch"
                    }}>
                    <TouchableOpacity

                        style={[this.props.mkey === "male" ? stylesCurrent.tabSelected : stylesCurrent.tab]}
                        onPress={this.props.onMaleFemaleChange.bind(this, "male")}>

                        <CustomText
                            style={[this.props.mkey === "male" ? stylesCurrent.tabTextSelected : stylesCurrent.tabText]}

                        >MALE</CustomText>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[this.props.mkey === "male" ? stylesCurrent.tab : stylesCurrent.tabSelected]}
                        onPress={this.props.onMaleFemaleChange.bind(this, "female")}>

                        <CustomText
                            style={[this.props.mkey === "male" ? stylesCurrent.tabText : stylesCurrent.tabTextSelected]}

                        >FEMALE</CustomText>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

}


const stylesCurrent = StyleSheet.create({
    tabSelected: {
       
              flex: 1
    },
    tab: {
        flex: 1
    },
    tabTextSelected: {
        alignSelf: 'center', fontSize: 16,
        color: COLORS.button
    },
    tabText: {
        alignSelf: 'center', fontSize: 16,
        color: COLORS.darkGrey
    }
});
