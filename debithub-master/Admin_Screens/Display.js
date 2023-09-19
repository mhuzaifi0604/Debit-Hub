// Importing components from react native
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
} from 'react-native';
// Importing libraries from react native
import {styles} from '../Styles/StyleSheet';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// imported screens from admin screens an screens folder
export default function Display({navigation}){
  //declaring and setting constants
    const [count, setCount]=useState(0);
    const [FAQs,setFAQs]=useState([]);
    const [hidden, setHidden]=useState([]);
// setting modal 
    const [modalopen, setmodalopen] = useState(false);
// function for getting data
    async function getData(){
      const temp=[];
      // getting accountdata collection from the firebase
      const subscriber=await firestore().collection("AccountData")
      .get()
      .then(querySnapshot=>{
        querySnapshot.forEach(documentSnapshot=>{
          const u=documentSnapshot.data();
          // pushing data from array into the database
          temp.push({email:documentSnapshot.id, data:u});
        });
        for(let i=0; i<temp.length; i++){
          // setting hidden feedback and pushing keys in array
          hidden.push(false);
          temp[i]["key"]=i+1;
          console.log(temp[i]["key"]);
        }
      });
      
      setFAQs(temp);
    }
    
    useEffect(()=>{
      if(count===0){
        // getting data and setting account
        getData();
        setCount(1);
      }
    });
      // function for toggling hidden 
    function toggleAns(key){
      // slicing the flatlist into half fir hidden data
      let x=hidden.slice();
      x[key-1]=!x[key-1];
      setHidden(x);
  }
    // function fir handling modal 
    function handlemodal(){
      // setting modal state equals to false
      setmodalopen(false);
    }

  return (
    // setting style and flex for linear gradient
    <LinearGradient colors={[ '#1e2127','#000','#1e2127']} style={{flex: 8, justifyContent: 'center'}}>
      {/* setting modal style and flex type */}
      <Modal visible = {modalopen} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .88, backgroundColor: 'black', height: '100%' }}>
                {/* setting image as background for admin logo card */}
            <ImageBackground source={require('../assets/light.jpg')} style={{width:360, height:200,elevation:10}} imageStyle = {{borderWidth: 2, borderColor: 'darkred'}} >
              {/* setting componemts and styles for the image/ logo card*/}
                        <Image source={require('../assets/designing/logocardL.png')} style={{width:100,height:40,position: 'absolute',bottom:160,left:10,alignSelf:'flex-end'}}/>
                        <Text style={[{color:'#000',fontWeight:'bold'}, {fontSize:17, position:'absolute', bottom:5, left:10,}]}>{auth().currentUser.email}</Text>
                        <Text style={[{color:'darkred',fontWeight:'bold', textAlign: 'center', fontFamily: 'times new roman'}, {fontSize:32, position:'absolute', bottom:80, left:120,}]}>Admin</Text>
                        <Image source={require('../assets/visa.png')} style={{width:40,height:40,position:'absolute',bottom:5,right:10,alignSelf:'flex-end'}}/>
            </ImageBackground>
              {/* touchable opacity for navigating onto the dashboard */}
            <TouchableOpacity onPress={() => {navigation.navigate('Dashboard'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for dashboard */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="home" size={25} color="#c0c0c0" />  Dashboard</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the closing the modal */}
            <TouchableOpacity onPress={() => handlemodal()} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for remaining on the same screen */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="users" size={25} color="#c0c0c0"/>  Display All Users</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the Admin Notifications */}
            <TouchableOpacity onPress={() => {navigation.navigate('Admin Notifications'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for admin notifications */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="bell" size={25} color="#c0c0c0"/>  Add Notificaions</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the feedback reply */}
            <TouchableOpacity onPress={() => {navigation.navigate('Feedback'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for feedback reply */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="address-card" size={25} color="#c0c0c0"/>  Feedback Reply</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the settings */}
            <TouchableOpacity onPress={() => {navigation.navigate('Settings'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for settings */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="gears" size={25} color="#c0c0c0"/>  Change Password</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the Admin statements */}
            <TouchableOpacity onPress={() => {navigation.navigate('Admin Statements'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for admin statements */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="envelope-o" size={25} color="#c0c0c0" />  Check Statement</Text>
            </TouchableOpacity>
            {/* touchable opacity for loggig out of the application */}
            <TouchableOpacity onPress={() => {navigation.navigate('Login'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for logout */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 10, marginBottom: 10}}> <Icon name="sign-out" size={25} color="#c0c0c0" />  Logout</Text>
            </TouchableOpacity>
              {/* closing voew and modal tags */}
            </View>
            </View>
            </Modal>
        <FlatList
        /* setting FAQs array as data inflat list */
            data={FAQs}
            /* rendering items for the array*/
            renderItem={({ item }) => (
            <View style={{paddingVertical:15,borderBottomWidth:1.5,borderTopWidth:0,borderColor:'#801818',paddingHorizontal:10}}>
                <View style = {{flex:1,flexDirection:'row'}} >
                    <Text style={[{fontSize:20,color:'white',flex:10}, {fontWeight:'normal'}]}>{item.email}</Text>  
                    { /* icon for toggeling hidden and in view data */ }
                    <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns(item.key)}>
                        <Text style={[{fontSize:25,fontWeight:'bold'}, {color:'#841851'}]}>{!hidden[item.key-1]?"\u{1F448}":"\u{1F447}"}</Text>
                    </TouchableOpacity>
                </View>
                {/* displaying hidden information */}
                {hidden[item.key-1]?<Text style={[{fontSize:20},{color:'#841851'}]}>Name: {item.data.Name}</Text>:<></>}
                {hidden[item.key-1]?<Text style={[{fontSize:20},{color:'#841851'}]}>CNIC: {item.data.CNIC}</Text>:<></>}
                {hidden[item.key-1]?<Text style={[{fontSize:20},{color:'#841851'}]}>Balance: Rs. {item.data.balance}</Text>:<></>}

            </View>        
            )}
        />

{/* setting linear gradients for taskbar icons and setting flex equal to row */}
<LinearGradient colors={['#14062E','#100010','#841851','#100010', '#14062E' ]}  start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }} style={{flexDirection: 'row',borderColor:'#00008b',borderTopWidth:4,}}>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                  {/* touchable opacity for navigating to home screen */}
                  <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                    {/* setting icon styles */}
                      <Icon name="home" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                      {/*<Text style= {{textAlign: 'center', color: '#c0c0c0', textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>Home</Text>*/}
                  </TouchableOpacity>
                
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {/* touchable opacity for navigating to the admin statements */}
                  <TouchableOpacity onPress={() => navigation.navigate("Admin Statements")}>
                    {/* setting icon styles */}
                    <Icon name="envelope-o" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                    {/*<Text style= {{textAlign: 'center', color: '#c0c0c0',  textAlign: 'center',fontSize: 15, fontWeight: 'bold'}}>History</Text>*/}
                  </TouchableOpacity>
                
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {/* touchable opacity for opening the menu  */}
                  <TouchableOpacity onPress={() => setmodalopen(true)}>
                    {/* setting icon styles */}
                    <Icon name="bars" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                    {/*<Text style= {{textAlign: 'center', color: '#c0c0c0',  textAlign: 'center',fontSize: 15, fontWeight: 'bold'}}>Menu</Text>*/}
                  </TouchableOpacity>
                  
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
                          {/* touchable opacity for logging out of the aplication */}
                          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            {/* setting icon styles */}
                              <Icon name="sign-out" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                          </TouchableOpacity>
                            {/*<Text style={{color: '#c0c0c0', textAlign: 'center',fontWeight: 'bold', fontSize: 15}}>logout</Text>*/}
                        
                  </View>

              </LinearGradient>


   </LinearGradient>
    );
}