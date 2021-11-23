import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';
import Colors from './colors';


export default class MyToolbar extends Component {
	render() {
		return (
			<View>
		<View
				style={{
					paddingVertical:16,
					width:"100%",
					backgroundColor:Colors.dream11red,
					flexDirection: "row",
					alignItems:"center"
				}}
			>
					<TouchableOpacity
							onPress={this.props.onBack}>

							<Image style={{
								marginStart: 8, width: undefined, height: 20, aspectRatio: 1, alignContent: "flex-start", alignItems: "flex-start"
							}}
								source={require('../images/back_white.png')} />

						</TouchableOpacity>
				<CustomText
					style={{
						fontSize: 17,
						fontWeight: 'bold' ,
						color: "#fff",
						textAlign: 'center'
					}}

				> {this.props.title}
				</CustomText>
			</View>
		
			</View>
		)
	}
}

