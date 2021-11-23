import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import EventBus from 'react-native-event-bus';
import { Actions } from 'react-native-router-flux';
import COLORS from '../components/colors';
import MyToolbar from '../components/MyToolbar';
import { WebView } from 'react-native-webview';
import EditTextName from '../components/EditTextName';
import CustomText from '../components/CustomText';
import EditTextContextSize from '../components/EditTextContextSize';
import ModalSelector from 'react-native-modal-selector';
import styles from '../components/styles';

const globalHeader = "Select Number Of Entries Allowed";

export default class ContestCreate extends Component {

  constructor() {
    super();
    this.state = {
      spots: 0,
      contestName: "",
      joiningFee: 0,
      entry: [
        { ind: 0, val: globalHeader }
      ],
      entrySelected: 0,
      prizePool: 0,
      validation: "",
      validationKeyError: "",
    };
  }




  onBack = () => {
    Actions.pop();
  }




  onChangeFunName = (key, value) => {
    if (/^[a-zA-Z0-9]+$/.test(value)) {
      this.setState({ [key]: value });
    }
    if (value == "") {
      this.setState({ [key]: value });
    }
  }


  onChangeContestSize = (key, value) => {
    this.setState({ [key]: value }, () => {
      this.setPrizePool()
    });

  }

  onChangeSpots = (key, value) => {
    this.setState({ [key]: value }, () => {

      this.updateArray();
      this.setPrizePool()
    });

  }


  updateArray() {
  
    let tempArray = [];
    tempArray.push( { ind: 0, val: globalHeader });
    var spot = this.state.spots;
    console.log("spot "+spot)
    var i=1;
    if(spot <= 10 && spot>=1) {
      for ( i = 1; i < 2; i++) {
        tempArray.push({
          ind: i,
          val: i+""
        })
      }

    } 
    
    if(spot <= 20 && spot>=11) {
      for ( i = 1; i < 3; i++) {

        tempArray.push({
          ind: i,
          val: i+""
        })
      }
    }
    
    if(spot <= 50 && spot>=21) {

      for ( i = 1; i < 7; i++) {
        console.log("i>>> "+i);
        tempArray.push({
          ind: i,
          val: i+""
        })
      
      }
    }
    
    if(spot >= 51) {
      for ( i = 1; i < 12; i++) {
        tempArray.push({
          ind: i,
          val: i+""
        })
      }
    }

    this.setState({
      entry: tempArray,
      entrySelected:0
    })
  }



  setPrizePool = () => {
    let cal = (this.state.spots * this.state.joiningFee);
    let pPoll = cal * 0.01 * 95;
    this.setState({
      prizePool: pPoll.toFixed()
    });
  }


  onDropdownChage(itemValue, itemIndex) {
    this.setState({
      entrySelected: itemIndex
    })
  }

  createContest(){
 
    const {contestName,spots,entry,entrySelected,joiningFee,prizePool} = this.state;
    var entryToSend = spots<11?1:entry[entrySelected].val;
    
    if(contestName === ""){
      this.setState({
        validation: "Name is empty",
        validationKeyError: "name"
      });
      return ;
    }else if(spots<2 || spots>1000){
      this.setState({
        validation: "Number of Spots must be between 2-1000",
        validationKeyError: "spots"
      });

      return ;
    }else if(entryToSend === globalHeader ){
      this.setState({
        validation: "Select number of entries.",
        validationKeyError: "entry"
      });

    }else if(joiningFee<5 || joiningFee>10000){
      this.setState({
        validation: "Joining Fee must be between 5-10000",
        validationKeyError: "joiningFee"
      });

    }else{
      this.setState({
        validation: "",
        validationKeyError: ""
      });
      Actions.ContestCreateBreakup({
        ...this.state,
        teamSize:this.props.teamSize,
        entryToSend,
        match_key:this.props.match_key
      });    
    }

   

  }


  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.app

        }}>

        <MyToolbar
          title={"Create a Contest"}
          onBack={this.onBack}
        />


        <View style={{ marginLeft: 16, marginRight: 16, marginTop: 6, }}>
          <EditTextName
            val={this.state.contestName}
            validationEr={this.state.validationKeyError}
            placeho="Contest Name"
            mkey="contestName"
            onChangeFunName={this.onChangeFunName}
            inputRef={(input) => {
              this.contestName = input
            }} />

          <EditTextContextSize
            val={this.state.spots}
            validationEr={this.state.validationKeyError}
            placeho="Number of Spots"
            mkey="spots"
            onChangeContestSize={this.onChangeSpots}
            inputRef={(input) => {
              this.spots = input
            }}
          />

        {this.state.spots>10? <View
            style={stylesCurrent.picker}>



            <ModalSelector
              data={this.state.entry.map((obj, index) => {
                obj = {
                  ind: index,
                  key: obj.ind,
                  label: obj.val
                }
                return obj;
              })}
              onChange={(option) => {
                this.onDropdownChage(option.label, option.ind)
              }} >

              <CustomText style={{ paddingVertical: 16 }}>{this.state.entry[this.state.entrySelected].val}</CustomText>
            </ModalSelector>


          </View>:null} 


          <EditTextContextSize
            val={this.state.joiningFee}
            validationEr={this.state.validationKeyError}
            placeho="Joining Fee"
            mkey="joiningFee"
            onChangeContestSize={this.onChangeContestSize}
            inputRef={(input) => {
              this.joiningFee = input
            }}
  
          />






          <View style={{ backgroundColor: "#e6e6e6", marginHorizontal: 6, marginTop: 16, padding: 6 }}>
            <CustomText>Prize Pool</CustomText>
            <CustomText style={{ fontSize: 25, fontWeight: "bold" }}>{RUPPE}{this.state.prizePool}</CustomText>

          </View>

          <CustomText style={[styles.errorText,{marginVertical:6}]}>{this.state.validation}</CustomText>


          <View style={{ flexDirection: "row", alignSelf: 'baseline' }}>

            <TouchableOpacity style={stylesCurrent.submit} onPress={
              () => {
                  this.createContest();
              }
            }>
              <CustomText style={styles.buttonText}>

                CREATE CONTEST


  </CustomText>
            </TouchableOpacity>
          </View>


        </View>



      </View>
    );
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

