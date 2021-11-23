import countryCitySt from 'country-state-city';
import * as ImagePicker from 'expo-image-picker';
import React, { Component } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ModalSelector from 'react-native-modal-selector';
import { Actions } from 'react-native-router-flux';
import { default as Colors, default as COLORS } from '../components/colors';
import CustomText from '../components/CustomText';
import EditTextVerification from '../components/EditTextVerification';
import Loader from '../components/Loader';
import MyToolbar from '../components/MyToolbar';
import Pan from '../components/Pan';
import AccountNumber from '../components/AccountNumber';
import styles from '../components/styles';
import { show } from '../utils/Globals';
import EventBus from 'react-native-event-bus';



export default class VerifyYourAccount extends Component {


  maxDate = "";

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      stateLabel: "SELECT STATE",
      name: "",
      pan: '',
      dob: "",
      fileObj: {},
      accNum: "",
      reAccNum: "",
      ifscCode: "",
      bankName: "",
      account_holder_name: "",
      bankBranch: "",

      validationKeyError: "",
      response: null,
      stateSelected: 0,
      statesList: null
    };
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    this.maxDate = "" + day + "-" + month + "-" + year;
    console.log("max date " + this.maxDate);
    this.loadDashboard();
  }


  componentDidMount() {

    EventBus.getInstance().addListener("mobileUpdated",
      this.listener = player => {
        this.loadDashboard();
      })

    var stateIndex = 0;
    var stateListTemp;
    stateListTemp = countryCitySt.getStatesOfCountry("101");
    stateListTemp.unshift({ "name": "Select state", "id": "" })
    this.setState({
      stateSelected: 0,
      statesList: stateListTemp
    });


  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadDashboard() {


    fetch(GLOABAL_API + 'users/get', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        Authorization: GLOBAL_TOKEN
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log("response " + JSON.stringify(responseJson));
        this.setState(
          {
            loading: false, response: responseJson.data
          }
        );
      })
  }


  onBack = () => {
    Actions.pop();
  }

  verifyEmail = () => {

    if (this.state.response.email == "") {
      Actions.VerifyEmail();
    } else {

      this.setState({ loading: true });
      var bodyTxt = {
        email: this.state.response.email.trim()
      };
      console.log("registartion body : " + JSON.stringify(bodyTxt));
      var api = GLOABAL_API + 'users/update_email';
      fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: GLOBAL_TOKEN
        },
        body: JSON.stringify(bodyTxt)
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log({ "response": responseJson });
          this.setState({ loading: false });
          if (responseJson.status === 1) {
            show("Verification email sent to this email...");
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  verifyMobile = () => {

    Actions.EnterMobile();

  }
  onChangeFun = (key, value) => {
    //Alert.alert('OnChage '+key+" "+value);
    this.setState({ [key]: value });
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {

      console.log("result ok");
      let localUri = result.uri;
      let filename = localUri.split('/').pop();
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      this.setState({
        fileObj: { uri: localUri, name: filename, type }
      })

    }
  };

  panVerification = () => {
    var name = this.state.name.trim();
    var pan = this.state.pan.trim();
    var dob = this.state.dob.trim();
    var stateSelected = this.state.stateSelected;

    if (name == "") {
      show("Name cant be empty.");
      return;
    } else if (pan.length != 10) {
      show("Pan number must be of 10 digits.");
      return;
    } else if (dob == "") {
      show("Date of birth cant be empty.");
      return;

    } else if (stateSelected == 0) {
      show("State must be selected.");
      return;

    } else if (this.state.fileObj.name == undefined || this.state.fileObj.name == "") {
      show("Must select pan card image.");
      return;
    }

    let formData = new FormData();
    var bodyTxt = {
      name: name,
      pan_number: pan,
      date_of_birth: dob,
      state: this.state.stateLabel
    };
    formData.append('pan_body', JSON.stringify(bodyTxt));
    formData.append('pan_file', this.state.fileObj);
    console.log("body " + JSON.stringify(formData));

    this.setState({
      loading: true
    });
    fetch(GLOABAL_API + 'users/update_pan', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'multipart/form-data',
        Authorization: GLOBAL_TOKEN
      }, body: formData
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson.status " + JSON.stringify(responseJson));
        show(responseJson.message);
        this.loadDashboard();
      })

  }
  bankVerification() {
    var accNum = this.state.accNum.trim();
    var reAccNum = this.state.reAccNum.trim();
    var ifscCode = this.state.ifscCode.trim();
    var bankName = this.state.bankName.trim();
    var bankBranch = this.state.bankBranch.trim();
    var account_holder_name = this.state.account_holder_name.trim();

    if (account_holder_name == "") {
      show("Account Holder Name cant be empty.");
      return;
    }
    if (accNum == "") {
      show("Account Number cant be empty.");
      return;
    } else if (reAccNum != accNum) {
      show("Account Numbe doesnt match.");
      return;
    } else if (ifscCode == "") {
      show("IFSC Code cant be empty.");
      return;

    } else if (bankName == "") {
      show("Bank name cant be empty.");
      return;

    } else if (bankBranch == "") {
      show("Bank branch cant be empty.");
      return;

    } else if (this.state.fileObj.name == undefined || this.state.fileObj.name == "") {
      show("Must select bank proof image.");
      return;
    }

    let formData = new FormData();
    var bodyTxt = {
      account_holder_name: account_holder_name,
      account_number: accNum,
      ifsc_code: ifscCode,
      bank_name: bankName,
      bank_branch: bankBranch
    };
    formData.append('bank_body', JSON.stringify(bodyTxt));
    formData.append('bank_file', this.state.fileObj);
    console.log("body " + JSON.stringify(formData));

    this.setState({
      loading: true
    });
    fetch(GLOABAL_API + 'users/update_bank', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'multipart/form-data',
        Authorization: GLOBAL_TOKEN
      }, body: formData
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson.status " + JSON.stringify(responseJson));
        show(responseJson.message);
        this.loadDashboard();
      })
  }

  getStep1() {
    var borderCol = Colors.green;
    var borderColMobile = Colors.green;
    var txtMobile = "Your mobile number is verified";
    var txt = "Your email address is verified";
    if (this.state.response != null) {

      if (!this.state.response.is_email_verified) {
        borderCol = Colors.red;
        txt = "Your email address is not verified";
      }
      if (!this.state.response.mobile == null || this.state.response.mobile == undefined || this.state.response.mobile == "") {
        borderColMobile = Colors.red;
        txtMobile = "Your mobile number is not verified";
      }

    }

    return <View style={{ marginHorizontal: 6, marginTop: 16 }}>
      <View style={{ margin: 6, padding: 16, borderColor: borderColMobile, borderWidth: 2, flexDirection: "row" }}>
        <Image style={{
          marginTop: 6,
          tintColor: Colors.green, width: undefined, height: 25, aspectRatio: 1,
        }}

          source={require('../images/phone.png')} />
        <View style={{ marginHorizontal: 16, flex: 1 }}>
          <CustomText>{txtMobile}</CustomText>
          <View style={{ flexDirection: "row" }}>
            <CustomText style={{ flex: 1, color: Colors.green, fontWeight: "bold" }}>{this.state.response.mobile}</CustomText>
            {
              this.state.response.mobile == "" ? <TouchableOpacity
                onPress={
                  () => {
                    this.verifyMobile();
                  }
                }>
                <CustomText style={{ borderWidth: 1, borderRadius: 6, borderColor: Colors.green, paddingHorizontal: 6, color: Colors.green, fontWeight: "bold" }}>Verify</CustomText>
              </TouchableOpacity> : null
            }
          </View>
        </View>
      </View>

      <View style={{ margin: 6, padding: 16, borderColor: borderCol, borderWidth: 2, flexDirection: "row" }}>
        <Image style={{
          tintColor: borderCol, width: undefined, height: 30, aspectRatio: 1,
        }}

          source={require('../images/mail.png')} />
        <View style={{ marginHorizontal: 16, flex: 1 }}>
          <CustomText>{txt}</CustomText>
          <View style={{ flexDirection: "row" }}>
            <CustomText style={{ flex: 1, color: borderCol, fontWeight: "bold" }}>{this.state.response.email}</CustomText>
            {
              this.state.response.is_email_verified ? null : <TouchableOpacity
                onPress={
                  () => {
                    this.verifyEmail();
                  }
                }>
                <CustomText style={{ borderWidth: 1, borderRadius: 6, borderColor: Colors.green, paddingHorizontal: 6, color: Colors.green, fontWeight: "bold" }}>Verify</CustomText>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    </View>
  }


  getStep2() {
    return <View>
      <View style={{ marginHorizontal: 6, marginTop: 16 }}>
        <EditTextVerification
          val={this.state.name}
          validationEr={this.state.validationKeyError}
          placeho="Name"
          mkey="name"
          onChangeFun={this.onChangeFun}
          jumpTo={this.password}
          inputRef={(input) => {
            this.name = input
          }} />
        <CustomText style={stylesCurrent.text}>As on PAN card</CustomText>
        <Pan
          val={this.state.pan}
          placeho="PAN number"
          mkey="pan"
          validationEr={this.state.validationKeyError}
          onChangeFun={this.onChangeFun}
          jumpTo={this.username}
          inputRef={(input) => {
            this.mobile = input
          }} />

        <CustomText style={stylesCurrent.text}>10 Digit PAN no</CustomText>
        {
          this.state.statesList == null ? null : <View
            style={stylesCurrent.picker}>





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

              <CustomText style={styles.EditTextVerification}>{this.state.stateLabel}</CustomText>
            </ModalSelector>



          </View>

        }
        <View
          style={{ marginTop: 16 }}
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
        <CustomText style={[stylesCurrent.text, { fontWeight: "bold", marginTop: 6, }]}>Verify Your Pan</CustomText>
        <TouchableOpacity
          onPress={
            () => {
              this._pickImage();
            }
          } style={{

            borderWidth: 0.4, borderRadius: 16,
            backgroundColor: Colors.blue,
            height: 40
            , alignItems: "center", justifyContent: "center"
            , marginHorizontal: 40,
            marginVertical:6
          }}
        >

          <CustomText
            style={{
              justifyContent: 'center',
              alignItems: "center",
              color: "#fff",
              fontSize: 15
            }}>
            SELECT PAN CARD IMAGE
                    </CustomText>
        </TouchableOpacity>
        <CustomText style={[stylesCurrent.text]}>{this.state.fileObj.name}</CustomText>

      </View>
      <TouchableOpacity
        onPress={
          () => {
            this.panVerification();
          }
        } style={{

          borderWidth: 0.4, borderRadius: 1,
          backgroundColor: Colors.green,
          height: 45
          , alignItems: "center", justifyContent: "center"
          , margin: 6
        }}
      >

        <CustomText
          style={{
            justifyContent: 'center',
            alignItems: "center",
            color: "#fff",
            fontSize: 15
          }}>
          SUBMIT FOR VERIFICATION
                    </CustomText>
      </TouchableOpacity>


    </View>
  }
  getStep2Verified() {

    var borderCol = Colors.green;
    var txt = "Your PAN number is verified";
    if (this.state.response.pan_details.status == "in review") {
      txt = "Your PAN status is in review";
      borderCol = Colors.red;
    }else if(this.state.response.pan_details.status == "rejected"){
      txt = "Your PAN status is rejected";
      borderCol = Colors.red;
    }
    return <View style={{ marginHorizontal: 6, marginTop: 16, }}>
      <View style={{ margin: 6, padding: 16, borderColor: borderCol, borderWidth: 2, flexDirection: "row" }}>
        <Image style={{
          marginTop: 6,
          tintColor: borderCol, width: undefined, height: 25, aspectRatio: 1,
        }}

          source={require('../images/pancard.png')} />
        <View style={{ marginHorizontal: 16, flex: 1 }}>
          <CustomText style={{ fontSize: 15, }}>{txt}</CustomText>
          <View style={{ padding: 6 }}>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Name:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.pan_details.name}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Pan Number:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.pan_details.pan_number}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>DOB:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.pan_details.date_of_birth}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>State:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.pan_details.state}</CustomText>
            </View>
          </View>
        </View>
      </View>

    </View>
  }

  getStep2Rejected(){

    return <View>
      {this.getStep2Verified()}
        {this.getStep2()}
    </View>
  }


  getStep3Rejected(){

    return <View>
      {this.getStep3Verified()}
        {this.getStep3()}
    </View>
  }

  getStep3() {
    return <View style={{ marginHorizontal: 6, marginTop: 16 }}>
      <EditTextVerification
        val={this.state.account_holder_name}
        validationEr={this.state.validationKeyError}
        placeho="Account Holder Name"
        mkey="account_holder_name"
        onChangeFun={this.onChangeFun}
        inputRef={(input) => {
          this.account_holder_name = input
        }} />
      <AccountNumber
        val={this.state.accNum}
        validationEr={this.state.validationKeyError}
        placeho="Account number"
        mkey="accNum"
        onChangeFun={this.onChangeFun}
        inputRef={(input) => {
          this.accNum = input
        }} />
      <AccountNumber
        val={this.state.reAccNum}
        validationEr={this.state.validationKeyError}
        placeho="Retype account Number"
        mkey="reAccNum"
        onChangeFun={this.onChangeFun}
        inputRef={(input) => {
          this.reAccNum = input
        }} />
      <EditTextVerification
        val={this.state.ifscCode}
        validationEr={this.state.validationKeyError}
        placeho="IFSC Code"
        mkey="ifscCode"
        onChangeFun={this.onChangeFun}
        inputRef={(input) => {
          this.ifscCode = input
        }} />
      <EditTextVerification
        val={this.state.bankName}
        validationEr={this.state.validationKeyError}
        placeho="Bank name"
        mkey="bankName"
        onChangeFun={this.onChangeFun}
        inputRef={(input) => {
          this.bankName = input
        }} />
      <EditTextVerification
        val={this.state.bankBranch}
        validationEr={this.state.validationKeyError}
        placeho="Bank branch"
        mkey="bankBranch"
        onChangeFun={this.onChangeFun}
        inputRef={(input) => {
          this.bankBranch = input
        }} />

      <CustomText style={[stylesCurrent.text, { fontWeight: "bold", marginTop: 6, }]}>Verify Bank Account</CustomText>
      <TouchableOpacity
        onPress={
          () => {
            this._pickImage();
          }
        } style={{

          borderWidth: 0.4, borderRadius: 16,
          backgroundColor: Colors.blue,
          height: 40
          , alignItems: "center", justifyContent: "center"
          , marginHorizontal: 40,
          marginVertical:6
        }}
      >

        <CustomText
          style={{
            justifyContent: 'center',
            alignItems: "center",
            color: "#fff",
            fontSize: 15
          }}>
          Select Account Proof Image
                    </CustomText>
      </TouchableOpacity>
      <CustomText style={[stylesCurrent.text]}>{this.state.fileObj.name}</CustomText>
      <CustomText style={[stylesCurrent.text]}>Bank proof of passbook,Cheque book or Bank Statement which shows your <CustomText style={{ fontWeight: "bold" }}>Name,IFSC Code & Account No.</CustomText></CustomText>

      <TouchableOpacity
        onPress={
          () => {
            this.bankVerification();
          }
        } style={{

          borderWidth: 0.4, borderRadius: 1,
          backgroundColor: Colors.green,
          height: 45
          , alignItems: "center", justifyContent: "center"
          , margin: 6
        }}
      >

        <CustomText
          style={{
            justifyContent: 'center',
            alignItems: "center",
            color: "#fff",
            fontSize: 15
          }}>
          SUBMIT FOR VERIFICATION
                    </CustomText>
      </TouchableOpacity>

    </View>
  }

  getStep3Verified() {
    var borderCol = Colors.green;
    var txt = "Your BANK ACCOUNT is verified";
    if (this.state.response.bank_details.status == "in review") {
      txt = "Your BANK status is in review";
      borderCol = Colors.red;
    }else if (this.state.response.bank_details.status == "rejected") {
      txt = "Your BANK status is rejected";
      borderCol = Colors.red;
    }
    return <View style={{ marginHorizontal: 6, marginTop: 16 }}>
      <View style={{ margin: 6, padding: 16, borderColor: borderCol, borderWidth: 2, flexDirection: "row" }}>
        <Image style={{
          marginTop: 6,
          tintColor: borderCol, width: undefined, height: 25, aspectRatio: 1,
        }}

          source={require('../images/bank.png')} />
        <View style={{ marginHorizontal: 16, flex: 1 }}>
          <CustomText style={{ fontSize: 15, }} >{txt}</CustomText>

          <View style={{ padding: 6 }}>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Acc Holder Name:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.bank_details.account_holder_name}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Acc No:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.bank_details.account_number}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Ifsc Code:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.bank_details.ifsc_code}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Bank Name:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.bank_details.bank_name}</CustomText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <CustomText style={{ flex: 1, }}>Branch:</CustomText>
              <CustomText style={{ flex: 2, }}>{this.state.response.bank_details.bank_branch}</CustomText>
            </View>
          </View>
        </View>
      </View>

    </View>
  }
  onStateChage(itemValue, itemIndex) {
    var stateObj = this.state.statesList[itemIndex];
    console.log("State name " + stateObj.name);
    console.log("State id " + stateObj.id);
    if (stateObj.id === "") {
      this.setState({
        stateSelected: itemIndex,
        stateID: stateObj.id,
        stateLabel: "SELECT STATE"
      })
    } else {
      this.setState({
        stateLabel: stateObj.name,
        stateSelected: itemIndex,
        stateID: stateObj.id
      })

    }

  }


  render() {

    var showPanBox = false;
    var showBankBox = false;
    if (this.state.response != null) {
      if (!this.state.response.mobile == "" && this.state.response.is_email_verified) {
        showPanBox = true;
      }
      if (this.state.response.pan_details.status == "verified") {
        showBankBox = true;
      }
    }


    var mypanItem = null;
    if (this.state.response != null) {
      if (this.state.response.pan_details.status == "not verified") {
        mypanItem = this.getStep2();
      } else if (this.state.response.pan_details.status == "rejected") {
        mypanItem =  this.getStep2Rejected();
      } else {
        mypanItem = this.getStep2Verified();

      }

    }

    var myBankItem = null;
    if (this.state.response != null) {
      if (this.state.response.bank_details.status == "not verified") {
        myBankItem = this.getStep3();
      } else if (this.state.response.bank_details.status == "rejected") {
        myBankItem =  this.getStep3Rejected();
      } else {
        myBankItem = this.getStep3Verified();

      }

    }

    return (

      <View

        style={{
          width: "100%",
          flex: 1,
          backgroundColor: Colors.app
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          shouldCancelWhenOutside={false}
          keyboardShouldPersistTaps="always"
          style={styles.list_container}
        >

          {
            this.state.response == null ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator
                style={{
                  height: 80, width: 80,
                  alignContent: "center", alignItems: "center",
                  alignSelf: 'center', justifyContent: 'center'

                }}
                color={COLORS.dream11red}
                size="large"
              />
            </View> :

              <View>
                <MyToolbar
                  title="VERIFY YOUR ACCOUNT"
                  onBack={this.onBack}
                />
                <View style={{ paddingHorizontal: 16 }}>
                  <View style={{ backgroundColor: Colors.appDark, height: 4 }} />
                  <CustomText style={{ fontWeight: "bold", fontSize: 15, marginTop: 16 }}>Step 1 : Mobile and Email Verification</CustomText>
                  {this.getStep1()}
                  <View style={{ marginTop: 16, backgroundColor: Colors.appDark, height: 4 }} />
                  <CustomText style={{ fontWeight: "bold", fontSize: 15, marginTop: 16 }}>Step 2 : PAN Verification</CustomText>
                  {showPanBox ? mypanItem : null}
                  <View style={{ marginTop: 16, backgroundColor: Colors.appDark, height: 4 }} />
                  <CustomText style={{ fontWeight: "bold", fontSize: 15, marginTop: 16 }}>Step 3 : BANK Verification</CustomText>
                  {showBankBox ? myBankItem: null}
                  <View style={{ marginTop: 16, backgroundColor: Colors.appDark, height: 4 }} />


                </View>

              </View>

          }
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
  text: { marginStart: 6, color: Colors.appDarkest },
  picker: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingStart: 6,
    margin: 3,
    borderRadius: 6,
    borderWidth: 0.2,
    borderColor: "#000",
    marginTop: 8,
  }
})