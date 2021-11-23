

import { Dimensions, StyleSheet } from 'react-native';
import Colors from './colors';
const window = Dimensions.get('window');

export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width / 7;

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.app,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    width: window.width - 30,
  },
  logo: {
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
    marginBottom: 20,
    padding: 10,
    marginTop: 20
  },
  register: {
    marginBottom: 20,
    width: window.width - 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#ffae'
  }

  ,

  containerForm: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row'
  },
  signupText: {
    color: Colors.textDark,
    fontSize: 16
  },
  errorText: {
    alignSelf: 'center',
    color: 'rgba(255,50,50,0.9)',
    fontSize: 13,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: "center"
  },

  signupButton: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: 'bold'
  }
  ,
  inputBox: {
    width: 300,
    backgroundColor: 'rgba(255, 255,255,0.2)',

    fontSize: 16,
    color: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 10
  },
  button: {
    width: 300,
    backgroundColor: Colors.button,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 20,
    color: '#ffffff',
    marginVertical: 10
  },
  card_button: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: 35,
    backgroundColor: Colors.button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center'
  },
  myButtonText:{
    width:120,height:35,backgroundColor:Colors.accent,
    textAlign:"center",fontWeight: 'bold',
    textAlignVertical:"center",color:Colors.white,
    borderRadius:6,
  
  },
  buttonTextDark: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    color: Colors.app
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 10
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000010'

  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignContent: 'center'
  },
  toolbar: {
    backgroundColor: '#384e7a',
    height: 56,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  container_home: {
    flex: 1,
    backgroundColor: Colors.app,
  },

  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  list_container: {
    flex: 1
  },
  list_item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  submit: {
    paddingVertical: 6,
    flex: 1,
    marginEnd: 6,
    backgroundColor: Colors.button,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 20,
    color: '#ffffff'

  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
  edittext:{
    marginTop: 8,
    textAlign:"center",
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingStart: 6,
    borderRadius: 6,
    fontSize: 16,
  }
});
