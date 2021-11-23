import countryCitySt from 'country-state-city';
import * as ImagePicker from 'expo-image-picker';
import ModalSelector from 'react-native-modal-selector';
import React, { Component } from 'react';
import { Alert,Image, Keyboard, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';
import EventBus from 'react-native-event-bus';
import { Colors } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import CustomText from '../components/CustomText';
import EditText from '../components/EditText';
import Loader from '../components/Loader';
import MaleFemale from '../components/MaleFemale';
import MyToolbar from '../components/MyToolbar';
import styles from '../components/styles';
import EditTextName from '../components/EditTextName';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { isValidateEmail, isValidateMobile, isValidatePassword, show } from '../utils/Globals';

keyEvent = "signup";

initState = {
  countryLabel: "INDIA",
  cityLabel: "SELECT CITY",
  stateLabel: "SELECT STATE",
  image_url: "",
  name: "",
  emailAddress: "",
  mobile: '',
  gender: "male",
  password: "",
  referCode: "",
  countryID: "101",
  country_code: "+91",
  sta: "",
  city: "",
  facebook_id: "",
  google_id: "",
  apple_id: "",
  loading: false,
  validation: "",
  validationKeyError: "",
  dob: "",
  message: ""
};



export default class Signup extends Component {

  maxDate = "";

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {

      console.log("result ok");

      let formData = new FormData();
      let localUri = result.uri;
      let filename = localUri.split('/').pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;


      // Assume "photo" is the name of the form field the server expects
      formData.append('user_image', { uri: localUri, name: filename, type });


      console.log("result ok uri > " + result.uri);

      fetch(GLOABAL_API + 'users/changeimage', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'multipart/form-data',
          Authorization: GLOBAL_TOKEN
        }, body: formData
      })
        .then((response) => response.json())
        .then((responseJson) => {

          console.log("responseJson.status " + responseJson.status);

          if (responseJson.status === 1) {
            this.setState({ image_url: result.uri });
            EventBus.getInstance().fireEvent("refreshHome", {
            })
          }
        })
    }
  };


  constructor(props) {
    super(props);
    console.log("PROPS fromRegistration > " + props.fromRegistration);
    console.log("PROPS google_id > " + props.google_id);
    console.log("PROPS props.name > " + props.userActualName);
    console.log("PROPS props.pwd > " + props.pwd);
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    this.maxDate = "" + day + "-" + month + "-" + year;
    console.log("max date " + this.maxDate);
  }


  onCountryChage(itemValue, itemIndex) {

  }

  onStateChage(itemValue, itemIndex) {
    var cityList = [{ "name": "SELECT CITY", "id": "" }]
    var stateObj = this.state.statesList[itemIndex];
    console.log("State name " + stateObj.name);
    console.log("State id " + stateObj.id);
    var stateId = stateObj.id;
    var stateLabel = stateObj.name;
    if (
      stateId == "4" ||
      stateId == "29" ||
      stateId == "26" ||
      stateId == "36" ||
      stateId == "34") {
      show("Cant select " + stateLabel + ".As per government guidelines, usage of this App is restricted in " + stateLabel);
    }

    if (stateObj.id === "") {
      this.setState({
        stateSelected: itemIndex,
        citiesList: cityList,
        citySelected: 0,
        stateID: stateObj.id,
        cityID: "",
        stateLabel: "SELECT STATE",
        cityLabel: "SELECT CITY",
      })


    } else {
      var citiesListTemp = countryCitySt.getCitiesOfState("" + stateObj.id);
      for (let co of citiesListTemp) {
        cityList.push(co);
      }
      this.setState({
        stateLabel: stateObj.name,
        stateSelected: itemIndex,
        citiesList: cityList,
        citySelected: 0,
        cityLabel: "SELECT CITY",
        stateID: stateObj.id,
        cityID: ""
      })

    }

  }

  onCiyChage(itemValue, itemIndex) {

    var cityObj = this.state.citiesList[itemIndex];

    this.setState({
      citySelected: itemIndex,
      cityID: cityObj.id,
      cityLabel: cityObj.name

    });

  }
  componentWillMount() {

    this.setState(initState);
    console.log("componentWillMount  ");
    if (this.props.fromRegistration === false) {
      console.log("to update...");
      this.setState({
        loading: true
      })
      this.loadData(this)
    }

    this.setState({
      name: this.props.userActualName,
      emailAddress: this.props.email,
      pic: this.props.photo,
      password: this.props.pwd,
      google_id: this.props.google_id,
      facebook_id: this.props.facebook_id,
      apple_id: this.props.apple_id,
      countrySelected: 101, stateSelected: 0, citySelected: 0
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps return callback " + nextProps.updated);
    console.log("otpVerified " + nextProps.otpVerified);
    if (this.props.fromRegistration) {

    } else {
      if (nextProps.updated) {
        this.loadData(this)
      }
    }


  }

  componentDidMount() {
    EventBus.getInstance().addListener(this.keyEvent,
      this.listener = player => {
        var bodyData = this.state.bodyData;
        console.log("registration " + bodyData);
        var api = GLOABAL_API + 'users/registration';
        fetch(api, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:
            this.state.bodyData
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log({ "response": responseJson });
            this.setState({ loading: false });

            if (responseJson.status === 1) {

              console.log(" responseJson.data.token >> " + responseJson.data.token);
              AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
                GLOBAL_userObj = responseJson.data;
                GLOBAL_TOKEN = GLOBAL_userObj.token;
                Actions.nav();
                Actions.pop();
              });
            } else {
              console.log(" responseJson.message >> " + responseJson.message);
              ;
            }
          })
          .catch((error) => {
            console.error(error);
          });



      });
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData() {
    console.log("load data..");
    var url = GLOABAL_API + 'users/get';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }



    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log({ "response": responseJson });
        if (responseJson.status === 0) {
          this.setState({ loading: false });

        } else if (responseJson.status === 1) {
          console.log("responseJson.data.name " + responseJson.data.name);
          console.log("responseJson.data.mobile " + responseJson.data.mobile);
          console.log("responseJson.data.country " + responseJson.data.country);
          console.log("responseJson.data.city " + responseJson.data.city);
          responseJson.data.country = "101";
          var countryList = countryCitySt.getAllCountries();
          var countryIndex = 0;
          var cityIndex = 0;
          var stateIndex = 0;
          var citiesListTemp, stateListTemp;

          for (let countryObj of countryList) {
            if (countryObj.id === responseJson.data.country) {
              break;
            }
            countryIndex++;
          }

          try {
            stateListTemp = countryCitySt.getStatesOfCountry(responseJson.data.country);
            for (let stateObj of stateListTemp) {
              if (responseJson.data.state === null
                || responseJson.data.state === "") {
                break;
              }
              stateIndex++;
              if (stateObj.id === responseJson.data.state) {
                break;
              }
            }


          } catch (e) {

          }
          try {

            citiesListTemp = countryCitySt.getCitiesOfState(responseJson.data.state);
            for (let cityObj of citiesListTemp) {
              if (responseJson.data.city === ""
                || responseJson.data.city === null) {
                break;
              }
              cityIndex++;
              if (cityObj.id === responseJson.data.city) {
                break;
              }
            }
          } catch (e) {

          }
          stateListTemp.unshift({ "name": "SELECT STATE", "id": "" })
          citiesListTemp.unshift({ "name": "SELECT CITY", "id": "" });
          console.log("responseJson.data.state ?>>> " + stateListTemp[stateIndex].name);

          if(!/^[a-zA-Z ]+$/.test(responseJson.data.name)){
            responseJson.data.name = "";
          }

          this.setState({
            name: responseJson.data.name,
            emailAddress: responseJson.data.email,
            image_url: responseJson.data.image_url,
            password: responseJson.data.pwd,
            mobile: responseJson.data.mobile + "",
            google_id: responseJson.data.google_id,
            facebook_id: responseJson.data.facebook_id,
            apple_id: responseJson.data.apple_id,
            country_code: responseJson.data.country_code,
            loading: false,
            validation: "",
            gender: responseJson.data.gender,
            dob: responseJson.data.dob,
            countryID: responseJson.data.country,
            stateID: responseJson.data.state,
            cityID: responseJson.data.city,
            citySelected: cityIndex,
            stateSelected: stateIndex,
            countrySelected: countryIndex,
            citiesList: citiesListTemp,
            countriesList: countryList,
            statesList: stateListTemp,
            pic: responseJson.data.image_url,
            countryLabel: "INDIA",
            stateLabel: stateListTemp[stateIndex].name,
            cityLabel: citiesListTemp[cityIndex].name
          });



        }
      })
      .catch((error) => {
        console.error(error);
      });

    Keyboard.dismiss();

  }

  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    this.setState({ [key]: value });
  }



  onChangeFunName = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    //value = value.replace(/[^A-Za-z]/ig, '')
    
    if (/^[a-zA-Z ]+$/.test(value) ){
      this.setState({ [key]: value });
    }
    if(value == ""){
       this.setState({ [key]: value });    
    }
    console.log("value "+value);
    
  
  }

  onMaleFemaleChange = (value) => {
    console.log("onMaleFemaleChange " + value)
    this.setState({
      gender: value
    });

  }

  onSignUp = () => {


    console.log("this.state.name " + this.state.name);
    if (this.state.name === "" || this.state.name === undefined || this.state.name.lenght<4) {
      this.setState({
        validation: " Name is empty or too short",
        validationKeyError: "name"
      });
      return;
    }

    if (!isValidatePassword(this.state.password)) {
      this.setState({
        validation: "password must be minimum eight characters, atleast one letter, one number and one special character:"
        , validationKeyError: "password"
      });
      return;
    }

    if (!isValidateEmail(this.state.emailAddress)) {
      this.setState({
        validation: "Email Address is incorrect", validationKeyError: "emailAddress"
      });
      return;
    }


    if (!isValidateMobile(this.state.mobile)) {
      this.setState({
        validation: "Mobile is invalid", validationKeyError: "mobile"
      });
      return;
    }


    this.setState({
      validation: "", validationKeyError: "", loading: true
    });



    var bodyTxt = {
      city: this.state.cityID,
      state: this.state.stateID,
      country: "India",
      mobile: this.state.mobile,
      google_id: this.state.google_id,
      facebook_id: this.state.facebook_id,
      apple_id: this.state.apple_id,
      pwd: this.state.password,
      email: this.state.emailAddress,
      name: this.state.name,
      gender: this.state.gender,
      dob: this.state.dob,
      country_code: this.state.country_code,
      referral: this.state.referCode,
      image_url: this.state.pic
    };

    this.setState({
      bodyData: JSON.stringify(bodyTxt)
    }, () => {
      let api = "";

      console.log("check exist ... " + this.state.bodyData);
      fetch(GLOABAL_API + "users/checkexistnew", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:
          this.state.bodyData
      })

        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({ loading: false });
          console.log({ "response": responseJson });
          if (responseJson.data.email === false &&
            responseJson.data.mobile === false &&
            responseJson.data.username === false
          ) {

            Actions.Verification({
              keyname: this.keyEvent,
              mobile: this.state.mobile
            });
          } else {
            prompt = "something went wrong";
            if (responseJson.data.email === true) {
              this.setState({
                validationKeyError: "emailAddress"
              });
              prompt = "Email already exists !!";
            } else if (responseJson.data.username === true) {
              prompt = "Username already exists !!";
              this.setState({
                validationKeyError: "username"
              });
            } else if (responseJson.data.mobile === true) {
              prompt = "mobile already exists !!";
              this.setState({
                validationKeyError: "mobile"
              });
            }
            Alert.alert(prompt)

          }

        })
        .catch((error) => {

          this.setState({ loading: false });
          console.error(error);
        });

      Keyboard.dismiss();


    });

  }

  onUpdate = () => {
    var stateId = this.state.stateID;
    var stateLabel = this.state.stateLabel;
    console.log("State id " + stateId);
    if(this.state.name == ""){
      show("Name cant be empty.");
      return;
    }
    if (
      stateId == "4" ||
      stateId == "29" ||
      stateId == "26" ||
      stateId == "36" ||
      stateId == "34") {
      show("Cant select " + stateLabel + ".As per government guidelines, usage of this App is restricted in " + stateLabel);
      return;
    }

    this.setState({
      validation: "", validationKeyError: "", loading: true
    });
    var bodyTxt = {
      city: this.state.cityID,
      state: this.state.stateID,
      country: "India",
      mobile: this.state.mobile,
      google_id: this.state.google_id,
      facebook_id: this.state.facebook_id,
      apple_id: this.state.apple_id,
      email: this.state.emailAddress,
      name: this.state.name,
      gender: this.state.gender,
      dob: this.state.dob,
      country_code: this.state.country_code,
      referral: this.state.referCode,
      image_url: this.state.pic
    };

    this.setState({
      bodyData: JSON.stringify(bodyTxt)
    }, () => {
      let api = "";
      console.log("updation..."+GLOBAL_TOKEN);
      console.log("body "+this.state.bodyData)
      api = GLOABAL_API + 'users/update';
      fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          Authorization: GLOBAL_TOKEN
        },
        body:
          this.state.bodyData

      })

        .then((response) => response.json())
        .then((responseJson) => {
          console.log("response"+JSON.stringify(responseJson) );
          if (responseJson.status === 1) {

            this.setState({ loading: false });
            // Actions.Verification({
            //   mobile:this.state.mobile
            // });

            responseJson.data.token = GLOBAL_TOKEN;
            AsyncStorage.setItem(USER_LOGGEDIN, JSON.stringify(responseJson.data)).then((value) => {
              GLOBAL_userObj = responseJson.data;
              this.setState({
                message: "Updated Successfully !!"
              })


              setTimeout(function () {

                this.setState({
                  message: ""
                })
                Actions.pop();
              }.bind(this), 500);


            });




          }
        })
        .catch((error) => {
          console.error(error);
        });




      Keyboard.dismiss();


    });

  }

  onSignIn() {
    Actions.pop();
    Actions.login();
  }

  onBack = () => {
    console.log("onBack..Signup");
    this.setState(this.initState);
    Actions.pop();
  }


  render() {
    return (

      <View
        style={{
          flex: 1, backgroundColor: COLORS.white
        }}>



        {
          this.props.fromRegistration ?
            <MyToolbar
              title="SIGNUP"

              onBack={this.onBack}
            /> :
            <MyToolbar
              title="My Profile"
              onBack={this.onBack}
            />
        }

        {this.props.fromRegistration ?
          null :


          <View
            style={{
              alignItems: 'center',
              paddingBottom: 16,
              marginBottom: 8,
              justifyContent: 'center'
            }}>


            <View>
              <Image
                source={{ uri: this.state.image_url + "?" + new Date().getTime(), cache: 'reload' }} style={{
                  width: 70, height: 70, borderRadius: 70 / 2,
                  overflow: "hidden",
                  marginTop: 16,
                  borderWidth: 0.1,
                  borderColor: "black",
                  backgroundColor: COLORS.white
                }} />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: -10,
                }}

                onPress={this._pickImage.bind(this)}>
                <Image style={{
                  overflow: "hidden",

                  alignSelf: "center",
                  width: undefined, height: 28, aspectRatio: 1,
                }}
                  source={require('../images/file-upload.png')} />
              </TouchableOpacity>


            </View>

            <CustomText style={{ fontSize: 12, marginTop: 6, color: COLORS.textLight }}>{this.state.emailAddress}</CustomText>
            <CustomText style={{ fontSize: 12, color: COLORS.textLight }}>{this.state.mobile}</CustomText>

          </View>



        }

        {
          this.state.message == "" || this.state.message == undefined || this.state.message == null ?
            null :
            <View style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: 70,
              position: "absolute",
              backgroundColor: Colors.green500
            }}>
              <CustomText style={{
                fontWeight: '500',
                fontSize: 21,
                textAlign: 'center',
                color: COLORS.white
              }}>
                {this.state.message}
              </CustomText>
            </View>

        }

        <ScrollView

          keyboardShouldPersistTaps="always"
          style={{ backgroundColor: COLORS.white }}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
          >


            <View style={{
              flex: 1,
              width: "90%",
              alignItems: "stretch",
              borderRadius: 2
            }}>


              <EditTextName
                val={this.state.name}
                validationEr={this.state.validationKeyError}
                placeho="Name"
                mkey="name"
                onChangeFunName={this.onChangeFunName}
                jumpTo={this.password}
                inputRef={(input) => {
                  this.name = input
                }} />


              {this.props.fromRegistration ?
                <View>
                  <EditText
                    val={this.state.password}
                    placeho={"Password"}
                    validationEr={this.state.validationKeyError}
                    mkey="password"
                    onChangeFun={this.onChangeFun}
                    isEditable={true}
                    jumpTo={this.emailAddress}
                    inputRef={(input) => {
                      this.password = input
                    }} />

                  <EditText
                    val={this.state.emailAddress}
                    placeho="Email Address"
                    mkey="emailAddress"
                    onChangeFun={this.onChangeFun}
                    validationEr={this.state.validationKeyError}
                    jumpTo={this.mobile}
                    inputRef={(input) => {
                      this.emailAddress = input
                    }} />


                  <EditText
                    val={this.state.mobile}
                    placeho="Mobile Number"
                    mkey="mobile"
                    validationEr={this.state.validationKeyError}
                    onChangeFun={this.onChangeFun}
                    jumpTo={this.referCode}
                    inputRef={(input) => {
                      this.mobile = input
                    }} />

                  <EditText
                    placeho="Refer Code (Optional)"
                    mkey="referCode"
                    validationEr={this.state.validationKeyError}
                    onChangeFun={this.onChangeFun}

                    inputRef={(input) => {
                      this.referCode = input
                    }} />

                </View>

                :

                <View>




                  {this.state.countriesList === undefined ? null :

                    <View>
                      <View
                        style={stylesCurrent.picker}>
                        <CustomText style={styles.edittext}>{this.state.countryLabel}</CustomText>
                      </View>
                      <View
                        style={stylesCurrent.picker}>
                        {this.state.statesList === undefined ? null :


                          <ModalSelector
                            data={this.state.statesList.map((obj, index) => {
                              obj = {
                                ind: index,
                                key: obj.id,
                                label: obj.name
                              }
                              return obj;
                            })}
                            initValue={this.state.statesList[this.state.stateSelected].name}
                            onChange={(option) => {
                              this.onStateChage(option.label, option.ind)
                            }} >

                            <CustomText style={styles.edittext}>{this.state.stateLabel}</CustomText>
                          </ModalSelector>

                        }

                      </View>
                      <View
                        style={stylesCurrent.picker}>
                        {this.state.citiesList === undefined ? null :


                          <ModalSelector
                            data={this.state.citiesList.map((obj, index) => {
                              obj = {
                                ind: index,
                                key: obj.id,
                                label: obj.name
                              }
                              return obj;
                            })}
                            initValue={this.state.citiesList[this.state.citySelected].name}
                            onChange={(option) => {
                              this.onCiyChage(option.label, option.ind)
                            }} >

                            <CustomText style={styles.edittext}>{this.state.cityLabel}</CustomText>
                          </ModalSelector>

                        }
                      </View>

                    </View>
                  }


                  <MaleFemale
                    onMaleFemaleChange={this.onMaleFemaleChange}
                    mkey={this.state.gender}
                  />
                  <View
                    style={{ margin: 16 }}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      date={this.state.dob}
                      mode="date"
                      placeholder="Date of Birth"
                      format="DD-MM-YYYY"
                      maxDate={
                        this.maxDate
                      }
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        placeholderText: {
                          color: COLORS.textDark
                        },
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0
                        },
                        dateText: {
                          color: COLORS.textDark,
                          justifyContent: 'flex-start'
                        }
                        , dateInput: {
                          marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => { this.setState({ dob: date }) }}
                    />


                  </View>

                  <TouchableOpacity onPress={() => {
                    Actions.ResetPassword();
                  }}>
                    <CustomText style={{ color: COLORS.accent, fontWeight: "bold", textAlign: "center" }}>UPDATE PASSWORD</CustomText>
                  </TouchableOpacity>
                </View>

              }





              <CustomText style={styles.errorText}>{this.state.validation}</CustomText>


              <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>

                <TouchableOpacity style={stylesCurrent.submit} onPress={
                  () => {
                    if (this.props.fromRegistration) {
                      this.onSignUp();
                    } else {
                      this.onUpdate();
                    }
                  }
                }>
                  <CustomText style={styles.buttonText}>

                    {this.props.fromRegistration ?
                      "Create Account" : "Update Profile"

                    }

                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>



            {
              this.props.fromRegistration ?

                <View style={[styles.signupTextCont, style = { marginBottom: 40 }]}>
                  <CustomText style={styles.signupText}>Already have an account ?</CustomText>
                  <TouchableOpacity onPress={this.onSignIn}><CustomText style={styles.signupButton}> SignIn</CustomText></TouchableOpacity>
                </View>
                : <View style={{ marginBottom: 40 }} />
            }

          </KeyboardAvoidingView>
        </ScrollView>
        {this.state.loading ?

          <View style={{ flex: 1, backgroundColor: "#fff", position: "absolute", width: "100%", height: "100%" }}>
            <Loader />
          </View> : null}
      </View>
    )
  }
}

const stylesCurrent = StyleSheet.create({

  submit: {
    flex: 1,
    alignSelf: 'baseline',
    paddingVertical: 10,

    borderRadius: 6,
    paddingHorizontal: 16,
    marginBottom: 32,
    fontSize: 20,
    backgroundColor: COLORS.button
  },
  picker: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingStart: 6,
    margin: 3,

    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: "#000000",
    marginTop: 8,
  }
});
