import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-root-toast';

global.GLOABAL_API = "https://api.your11fantasy.com/";
global.USER_LOGGEDIN = "userloggedin";
global.RUPPE = "\u20B9";
global.GLOBAL_TOKEN = ""
global.ISCURRENT_VERIOSN = true
global.LOADING = "Loading data..."
global.RESPONSE = "response..."
global.GLOBAL_userObj = {};


global.TEAM_WK_MIN = 1;
global.TEAM_WK_MAX = 4;
global.TEAM_BAT_MIN = 3;
global.TEAM_BAT_MAX = 6;
global.TEAM_BOWLER_MIN = 3;
global.TEAM_BOWLER_MAX = 6;
global.TEAM_ALL_ROUNDER_MIN = 1;
global.TEAM_ALL_ROUNDER_MAX = 4;
global.player_type_batsman = "batsman";
global.player_type_bowler = "bowler";
global.player_type_wk = "keeper";
global.player_type_ar = "allrounder";

global.team_error_bowler_max = "You can select only 6 Bowlers";
global.team_error_bowler_min = "You must select at least 3 Bowlers";
global.team_error_batsman_max = "You can select only 6 Batsmen";
global.team_error_batsman_min = "You must select at least 3 Batsmen";
global.team_error_wicket_keepers_max = "You can select only 4 Wicket-Keepers";
global.team_error_wicket_keepers_min = "You must select at least 1 Wicket-Keepers";
global.team_error_allrounder_max = "You can select only 4 All-Rounders";
global.team_error_allrounder_min = "You must select at least 1 All-Rounders";
global.selectWK = "Select 1-4 Wicket-Keepers";
global.selectBAT = "Select 3-6 Batsmen";
global.selectAR = "Select 1-4 All-Rounders";
global.selectBOWL = "Select 3-6 Bowlers";




export const getPLayerByCategory = (isMyPlayer, players, flag) => {
  console.log("flag " + flag);
  var listCat = []
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    if (player.player_type == flag) {
      if (isMyPlayer) {
        if (player.is_selected) {
          listCat.push(player);
        }
      } else {
        listCat.push(player);

      }
    }

  }
  return listCat;
}

export const getPLayerByTeamType = (isMyPlayer, players, flag) => {
  console.log("flag " + flag);
  var listCat = []
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    if (player.team_key == flag) {

      if (isMyPlayer) {
        if (player.is_selected) {
          listCat.push(player);
        }
      } else {
        listCat.push(player);

      }

    }

  }
  return listCat;
}

export const getSelectedPlayers = (players) => {
  var listCat = []
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    if (player.is_selected) {
      listCat.push(player);
    }

  }
  return listCat;
}

export const getPLayerByKey = ( players,mkey) => {
  var mPlayer = {};
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    if (player.player_key == mkey) {
      mPlayer = player;
    }
  }
  return mPlayer;
}

export const isValidatePassword = (password) => {
  let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (reg.test(password)) {
    return true;
  } else {
    return false;
  }

}

export const isValidateMobile = (mobile) => {
  console.log("validate mobile > " + mobile);
  let reg = /^\d{10}$/;
  if (reg.test(mobile)) {
    return true;
  } else {
    return false;
  }

}

export const isNumbersOnly = (string) => {
  console.log("validate text > " + string);
  let reg = /^[0-9]*$/;
  if (reg.test(string) && string) {
    return true;
  } else {
    return false;
  }

}


export const isValidateEmail = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email)) {
    return true;
  } else {
    return false;
  }

}

export const isValidateUsername = (username) => {
  let reg1 = /^([a-zA-Z0-9_]){6,15}$/;
  let reg2 = /^.*([a-zA-Z])+.*$/;


  if (
    reg1.test(username) &&
    reg2.test(username)
  ) {
    return true;
  } else {
    return false;
  }

}


export const getSeconds = (time) => {
  const secondDate = new Date(time);
  const firstDate = new Date();
  var Difference_In_Time = secondDate.getTime() - firstDate.getTime();
  Difference_In_Time = Difference_In_Time / 1000;
  return parseInt(Difference_In_Time);
}


export const storeData = async (Key, Value) => {
  try {
    await AsyncStorage.setItem(Key, Value);
  } catch (error) {
    // Error saving data
  }

}

export const retrieveData = async (Key) => {
  try {
    const value = await AsyncStorage.getItem(Key);

    return value;
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
}



export const validateJoiningWallet = (bonus_percent,
  joiningFee,
  initbonus, initdeposits, initwinnings) => {
 
  console.log("validateJoiningWallet: bonus_percent " + bonus_percent);
  console.log("validateJoiningWallet: joiningFee " + joiningFee);
  console.log("validateJoiningWallet: initbonus " + initbonus);
  console.log("validateJoiningWallet: initdeposits " + initdeposits);
  console.log("validateJoiningWallet: initwinnings " + initwinnings);
  
  var walletDeduction = {};
  // if (joiningFee <= walletAmount) {
  //   //kharid sakte ho
 
  var finalBonus = getDeductBonus(bonus_percent,initbonus, joiningFee);
  joiningFee = joiningFee - finalBonus;
  
  var finalDeposit = getDeductedDeposit(initdeposits, joiningFee);
  joiningFee = joiningFee - finalDeposit;
  var finalWinning = getDeductedWinnning(initwinnings, joiningFee);
  joiningFee = joiningFee - finalWinning;

  console.log("validateJoiningWallet: joiningFee " + joiningFee);
  console.log("validateJoiningWallet: finalBonus" + finalBonus);
  console.log("validateJoiningWallet: finalDeposit " + finalDeposit);
  console.log("validateJoiningWallet: finalWinning " + finalWinning);
  walletDeduction.bonus = finalBonus;
  walletDeduction.deposits = finalDeposit;
  walletDeduction.winnings = finalWinning;
  return walletDeduction;

  // } else {
  //   //aukat ke baahr
  //   console.log("validateJoiningWallet: ..........aukat ke baahr");
  //   return null;
  // }

}




export const validateWalletNoBonus = (joiningFee, initdeposits, initwinnings) => {
 

  console.log("validateJoiningWallet: joiningFee " + joiningFee);
  console.log("validateJoiningWallet: initdeposits " + initdeposits);
  console.log("validateJoiningWallet: initwinnings " + initwinnings);
  
  var walletDeduction = {};
  var finalDeposit = getDeductedDeposit(initdeposits, joiningFee);
  joiningFee = joiningFee - finalDeposit;
  var finalWinning = getDeductedWinnning(initwinnings, joiningFee);
  joiningFee = joiningFee - finalWinning;

  console.log("validateJoiningWallet: joiningFee " + joiningFee);
  console.log("validateJoiningWallet: finalDeposit " + finalDeposit);
  console.log("validateJoiningWallet: finalWinning " + finalWinning);
  walletDeduction.bonus = 0;
  walletDeduction.deposits = finalDeposit;
  walletDeduction.winnings = finalWinning;
  return walletDeduction;

}


export const getDeductedDeposit = (initdeposit, joiningFee) => {
 var finalDepositDeducted = 0;
  if ((initdeposit - joiningFee) >= 0) {
    finalDepositDeducted = joiningFee;
  } else {
    finalDepositDeducted = initdeposit;
  }
  return finalDepositDeducted;
}

export const getDeductedWinnning = (initWunning, joiningFee) => {
  console.log("getDeductedWinnning " + initWunning + " >> " + joiningFee);
var  finalWinningDeducted = 0;
  if ((initWunning - joiningFee) >= 0) {
    finalWinningDeducted = joiningFee;
  } else {
    finalWinningDeducted = initWunning;
  }
  return finalWinningDeducted;
}

export const getDeductBonus = (bonus_percent,initBonus, joiningFee) => {
  var BONUS_MAX_DEDUCTION_PERCENTAGE =bonus_percent/100;
  var finalBonus = 0;
 
    if ((initBonus - joiningFee) >= 0) {
      finalBonus = joiningFee * BONUS_MAX_DEDUCTION_PERCENTAGE;
    } else {

      if (initBonus >= (joiningFee * BONUS_MAX_DEDUCTION_PERCENTAGE)) {
        finalBonus = joiningFee * BONUS_MAX_DEDUCTION_PERCENTAGE;
      } else {
        finalBonus = initBonus;
      }
    }


  return  Math.floor(finalBonus);
}


export const show = (message) => {
  Toast.show(message, {
    backgroundColor: "#000",
    textColor: "#fff",
    duration: Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });

  setTimeout(function () {
    try {
      Toast.hide(toast);
    } catch (e) {

    }
  }, 500);

}





