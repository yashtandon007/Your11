import React, { Component } from 'react';
import { StyleSheet, TextInput as TextInput, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from './colors';
import CustomText from './CustomText';
import { Colors } from 'react-native-paper';

export default class EditTextVerification extends Component {


  componentWillReceiveProps(nextProps) {
    if (nextProps.validationEr === nextProps.mkey) {
      this.setState({
        borderColor: "#ff0000"
      });
    }else{
      this.setState({
        borderColor: COLORS.black
      });   
    }

  }


  componentDidMount() {
    this.setState({
      borderColor: COLORS.black
    });
  }

  constructor(props) {
    super(props);



    {

      (this.props.mkey === "password" ||
        this.props.mkey === "repassword" || this.props.mkey === "oldpassword" || this.props.mkey === "newpassword") ?
        this.state = {
          icEye: 'visibility-off', // default icon to show that password is currently hidden
          password: '', // actual value of password entered by the user
          showPassword: true // boolean to show/hide the password

        } : this.state = {
          showPassword: false // boolean to show/hide the password

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

    return (
      <View
        style={
          {
            margin: 3,
            borderColor: bordCol,
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
          color: COLORS.textDark,
          fontSize: 16
        }}
          returnKeyType='done'
          value={this.props.val}
          placeholderTextColor={Colors.grey500}
          selectionColor={COLORS.textLight}
          placeholder={this.props.placeho}
          secureTextEntry={this.state.showPassword}
          keyboardType={this.props.mkey.includes("mobile") ? "number-pad" : "default"}
          maxLength={this.props.mkey.includes("mobile") ? 10 : 35}
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
                color={COLORS.accent}
                size={30}
                onPress={this.changePwdType}
              />)

            } else {
              return (<TouchableOpacity style={styles.icon} onPress={this.onStartPasswordReset.bind(this)}>
                <CustomText style={{ color: COLORS.accent }}>
                  CHANGE
                  </CustomText>
              </TouchableOpacity>)
            }
          }
        })()}


      </View>


    )
  }
}
export const styles = StyleSheet.create({

  icon: {

    position: 'absolute', right: 0, marginRight: 16

  }

});
