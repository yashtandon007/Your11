import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';
import Colors from './colors';
import MatchTimer from './MatchTimer';
import { Actions } from 'react-native-router-flux';


export default class MyToolbarContests extends Component {

	onFinishTime() {

	}
	render() {
		return (
			<View>
				<View
					style={{
						paddingVertical:4,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: Colors.black
					}}
				>
						<TouchableOpacity
						style={{position:"absolute",
						left:16,}}
							onPress={this.props.onBack}>

							<Image style={{
								 width: undefined, height: 20, aspectRatio: 1, 
							}}
								source={require('../images/back_white.png')} />

						</TouchableOpacity>
						<View
						>
							<CustomText
								style={{
									fontSize: 14,
									color: Colors.white
								}}

							> {this.props.short_name}
							</CustomText>
							<View
								style={{
									
								}}>
								<MatchTimer

									bgColor={Colors.black}
									txtColor={Colors.white}
									onFinishTime={this.onFinishTime.bind(this)}
									indexNumber={0}
									time={this.props.time}
								/>
							</View>

					   </View>


<View 					style={{position:"absolute",
						right:16,flexDirection:"row"}}
	>
{this.props.showCreateContestIcon?
<TouchableOpacity
style={{marginEnd:16}}
							onPress={
								this.props.openBottomSheet.bind(this)
							}>

							<Image style={{
								tintColor:Colors.white,
								 width: undefined, height: 20, aspectRatio: 1, 
							}}
								source={require('../images/trophywhite.png')} />

						</TouchableOpacity>
:null}	

						<TouchableOpacity
							onPress={
								()=>{
									Actions.wallet();
								}
							}>

							<Image style={{
								tintColor:Colors.white,
								 width: undefined, height: 20, aspectRatio: 1, 
							}}
								source={require('../images/wallet.png')} />

						</TouchableOpacity>
	


</View>
				</View>

			</View>
		)
	}
}

