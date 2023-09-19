// Importing components from react native
import React from 'react-native';
import {StyleSheet} from 'react-native';

// creating stylesheet for features styles
export const styles=StyleSheet.create ({
  // styles for container
    container: {
      flex:1,
      backgroundColor: '#8432df',
      justifyContent: 'center',
      textAlign: 'center',
    },
    // styles for 2nd container
    container2: {
      flex: 1,
      justifyContent: 'center',
    },
    //styles for touchables
    Touchables:{
      backgroundColor: 'transparent',
      marginLeft:120,
      marginRight: 120,
      borderRadius: 20,
    },
    //styles for logo of app
    logo: {
        width: 150,
        height: 150,
    },
    //styles for card or logo
    card: {
      height: 200 ,
      width: 300,
      marginLeft: 35,
      marginRight: 75,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#7393B3'
    },
    //styles for graph/ line chart
    graph:{
        marginLeft: 35,
        marginRight: 35,
    },
    //styles for bottom of icons or modals
    bottom:{
      flex:1,
      flexDirection:'row',
      borderColor:'#00008b',
      borderTopWidth:4,
      backgroundColor:'#88194E',
      justifyContent:'space-between',
      alignItems:'center',
  },
  //styles for input style
    input: {
       padding: 8,
        margin: 10,
       marginTop: 50,
        borderWidth: 2,
        borderRadius: 10,
        color: 'white',
        fontSize: 15,
        borderColor: 'transparent',
        borderBottomColor: '#fff',
    },
    //styles for input of notifications
    notification_input:{
      width:'80%',
      height:'40%',
      borderWidth:5,
      borderRadius:15,
      marginLeft: 35,
      marginRight: 35,
      borderColor:'#841851',
      backgroundColor:'#2e3137',
      justifyContent:"center",
      color:'silver',
      marginVertical:10,
      fontWeight: 'bold',
      fontSize: 17,
      padding:15,
  },
  //styles for multi line inputs
    multilineinput: {
      padding: 8,
      margin: 10,
      marginTop: 10,
      marginLeft:30,
      marginRight: 30,
      borderWidth: 2,
      borderRadius: 10,
      color: 'white',
      fontSize: 15,
      borderColor: 'transparent',
      borderColor: '#fff',
      fontWeight: 'bold'
   },
   //styles for text input styles
    textinputstyles: {
      fontSize: 18,
      marginLeft: 10,
      marginRight: 10,
      color: 'black',
      fontWeight: 'bold',
      borderWidth: 2,
      borderRadius: 10,
      borderColor: 'transparent',
      borderBottomColor: '#fff' 
    },
    //styles for pickerstyle
    pickerstyle: { 
      color: 'white',
      marginLeft: 20,
      marginRight: 20,
      fontSize: 15,
      backgroundColor: 'transparent',
      borderRadius: 10,
      opacity: 0.9,
      borderColor: 'transparent',
      borderWidth: 2,
      borderBottomColor: 'white'
    },
    //styles for deny inputs
    denyinputs: {
      padding: 2,
      margin: 30,
      marginTop: 4,
      borderWidth: 2,
      borderRadius: 10,
      color: 'white',
      fontSize: 15,
      borderColor: 'transparent',
      borderBottomColor: '#fff',
    },
    //styles for header
    header:{
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize:30,
      color: '#fff',
      justifyContent: 'center',
      fontFamily: 'times new roman'
    },
    //styles for buttons
    buttons: {
      backgroundColor: 'black',
      borderWidth: 3,
      borderColor: '#c0c0c0',
      borderRadius: 15,
      marginTop: 7,
      paddingTop: 4,
      marginBottom: 5,
      marginLeft: 120,
      marginRight: 120,
      textAlign: 'center',
      fontSize: 20,
      justifyContent: 'center',
      color: '#c0c0c0',
      fontFamily: 'times new roman',
    },
    //styles for adder
    adder: {
      backgroundColor: '#841851',
      width: 50,
      height: 50,
      borderWidth: 0,
      borderColor: '#c0c0c0',
      borderRadius: 50,
      marginTop: 7,
      paddingTop: 10,
      marginBottom: 2,
      marginLeft: 170,
      //marginRight: 170,
      textAlign: 'center',
      fontSize: 30,
      //justifyContent: 'center',
      color: '#c0c0c0',
      fontFamily: 'times new roman',
    },
    //styles for icons
    icons:{
      paddingTop: 15,
      color: 'white',
      fontSize: 20
    },
  });