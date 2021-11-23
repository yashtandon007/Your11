import React from 'react';
import { StatusBar, View } from 'react-native';

// here, we add the spacing for iOS
// and pass the rest of the props to React Native's StatusBar

export default function (props) {
    const height = StatusBar.currentHeight;
    const { backgroundColor } = props;

    return (
        <View style={{ height, backgroundColor }}>
            <StatusBar {...props} />
        </View>
    );
}
