// CustomText.js
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default class CustomTexts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.noOfLine == null ?
                <Text style={[styles.defaultStyle, this.props.style]}>
                    {this.props.children}
                </Text>
                :
                <Text numberOfLines={this.props.noOfLine} style={[styles.defaultStyle, this.props.style]}>
                    {this.props.children}
                </Text>

        );
    }
}

const styles = StyleSheet.create({
    defaultStyle: {
        fontFamily: 'myfont'
    }
});
