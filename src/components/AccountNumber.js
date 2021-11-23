import React, { Component } from 'react';
import { StyleSheet, TextInput as TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from './colors';
import CustomText from './CustomText';

export default class AccountNumber extends Component {



  constructor(props) {
    super(props);
    {

      (this.props.mkey === "password" ||
        this.props.mkey === "repassword" || this.props.mkey === "oldpassword" || this.props.mkey === "newpassword") ?
        this.state = {
          icEye: 'visibility-off', // default icon to show that password is currently hidden
          password: '', // actual value of password entered by the user
          showPassword: true, // boolean to show/hide the password
          borderColor: COLORS.black
        } : this.state = {
          showPassword: false, // boolean to show/hide the password
          borderColor: COLORS.black
        }
    }
  }

  onStartPasswordReset() {
    Actions.ResetPassword(
    );
  }

  changePwdType = () => {
    let newState;
    if (this.state.showPassword) {
      newState = {
        icEye: 'visibility',
        showPassword: false,
        password: this.state.password
      }
    } else {
      newState = {
        icEye: 'visibility-off',
        showPassword: true,
        password: this.state.password
      }
    }
    // set new state value
    this.setState(newState)
  };
  render() {

    const bordCol = this.state.borderColor;
    if (this.props.validationEr === this.props.mkey) {
      this.state = {
        borderColor: COLORS.red
      };
    }
    return (
      <View style={{
      flex: 1,
      }}>
        <View
          style={
            {

              margin: 3,
              borderWidth: 0.2,
              alignItems: 'stretch',
              justifyContent: 'center',
              paddingVertical: 10,
              paddingStart: 6,
              marginTop: 8,
              borderRadius: 6,
              fontSize: 20,
            }}>
          <TextInput style={{
            color: Colors.textColor,
            fontSize: 16
          }}
            value={this.props.val}
            placeholderTextColor={Colors.grey500}
            selectionColor={Colors.grey800}
            placeholder={this.props.placeho}
            secureTextEntry={this.state.showPassword}
            keyboardType={"number-pad"}
            onChangeText={name => this.props.onChangeFun(this.props.mkey, name)}

            editable={
              this.props.isEditable === undefined ? true : this.props.isEditable
            }

            ref={(input) => this.props.inputRef(input)}
            onSubmitEditing={(event) => {

              if (this.props.jumpTo !== null && this.props.jumpTo !== undefined) {
                this.props.jumpTo.focus();
              }

            }}
          />



          {(() => {
            if (this.props.mkey === "password" ||
              this.props.mkey === "repassword" || this.props.mkey === "oldpassword" || this.props.mkey === "newpassword") {
              if (this.props.isEditable === true) {//from registration
                return (<Icon style={styles.icon}
                  name={this.state.icEye}
                  color={COLORS.button}
                  size={30}
                  onPress={this.changePwdType}
                />)

              } else {
                return (<TouchableOpacity style={styles.icon} onPress={this.onStartPasswordReset.bind(this)}>
                  <CustomText style={{ color: COLORS.button }}>
                    CHANGE
                  </CustomText>
                </TouchableOpacity>)
              }
            }
          })()}


        </View>
      

      </View>
    )
  }
}
export const styles = StyleSheet.create({

  icon: {

    position: 'absolute', right: 0, marginRight: 16

  }

});
