import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
} from 'react-native';

import { Linking } from 'react-native'
import {styles} from '../Styles/StyleSheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import GestureRecognizer from 'react-native-swipe-gestures';
import { FloatingMenu } from 'react-native-floating-action-menu';
import Loader from '../screens/loading';

export default function Admin_Statements({navigation}){
    const [email, setemail] = useState("");

    const [modalopen, setmodalopen] = useState(false);

    const [type, settype] = useState("");

    const [newnotes, setnewnotes] = useState("");
    const [modal2open, setmodal2open] = useState(false);

    const [hidden, setHidden]=useState([false, false, false, false, false, false, false, false, false]);

    function handle2modal(){
      setmodal2open(false);
    }

    function handlemodal(){
      setmodalopen(false);
    }
    
    function toggleAns(key){
      let x=hidden.slice();
      x[key-1]=!x[key-1];
      setHidden(x);
  }

    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [exists, setExists]= useState(true);

    async function getstatement(){
      setExists(true);
      const rc=[];
      const st=[];
      const subscriber=await firestore().collection("AccountData")
      .get()
      .then(querySnapshot=>{
        querySnapshot.forEach(documentSnapshot=>{
          const u=documentSnapshot.id;
          if(u===email){
            setExists(true);
            const d=documentSnapshot.data();
            if(d.Recieved!==undefined){
              const length=d.Recieved.length;
              for(let i=0; i<length; i++){
                rc.push({key:i, data:d.Recieved[i], type:"Received"});
                rc[i]["key"] = i+1;
              }

            }
            if(d.Sent!==undefined){
              const length=d.Sent.length;
              for(let i=0; i<length; i++){
                st.push({key:i, data:d.Sent[i], type:"Sent"});
                st[i]["key"] = i+1;
              }
            }
          }  
        });
      });
      setReceived(rc);
      setSent(st);
      if(rc.length === 0 && st.length === 0){
        setExists(false);
      }
    }

    function handleShit(){
      if(exists){
        return(
          <View style={{flex:1}}>
          <FlatList
          data={received}
          renderItem={({ item }) => (
          <View style={{backgroundColor: '#841851', borderRadius: 15,paddingTop: 25,paddingBottom: 25,paddingVertical:15,borderBottomWidth:1.5,borderTopWidth:0,borderColor:'#14062E',paddingHorizontal:10, margin: 10, marginBottom: 0}}>
              <View style = {{flex:1,flexDirection:'row'}} >
                  <Text style={[{fontSize:20,color:'white', flex: 10}, {fontWeight:'bold'}]}>Recieved</Text>  
                    
                  <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns(item.key)}>
                      <Text style={[{fontSize:25,fontWeight:'bold'}, {color:'#000'}]}>{!hidden[item.key-1]?"\u{1F448}":"\u{1F447}"}</Text>                 
                  </TouchableOpacity>
              </View>
              {hidden[item.key-1]?<Text style={[{fontSize:20}, {fontWeight:'bold', color: '#000'}]}>Name: {item.data.Name}</Text>:<></>}
              {hidden[item.key-1]?<Text style={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Account Number: {item.data["Account Number"]}</Text>:<></>}
              {hidden[item.key-1]?<Text style ={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Bank: {item.data.Bank}</Text>:<></>}
              {hidden[item.key-1]?<Text style ={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Date: {item.data.Date}</Text>:<></>}
              {hidden[item.key-1]?<Text style ={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Balance: {item.data.Money}</Text>:<></>}
              

          </View>        
          )}
      />

      <FlatList
          data={sent}
          renderItem={({ item }) => (
          <View style={{backgroundColor: '#841851', borderRadius: 15,paddingTop: 25,paddingBottom: 25,paddingVertical:15,borderBottomWidth:1.5,borderTopWidth:0,borderColor:'#14062E',paddingHorizontal:10, margin: 10, marginBottom: 0, marginTop: 0}}>
              <View style = {{flex:1,flexDirection:'row'}} >
                  <Text style={[{fontSize:20,color:'white', flex: 10}, {fontWeight:'bold'}]}>Sent</Text>  
                    
                  <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns(item.key)}>
                      <Text style={[{fontSize:25,fontWeight:'bold'}, {color:'#000'}]}>{!hidden[item.key-1]?"\u{1F448}":"\u{1F447}"}</Text>                 
                  </TouchableOpacity>
              </View>
              {hidden[item.key-1]?<Text style={[{fontSize:20}, {fontWeight:'bold', color: '#000'}]}>Name: {item.data.Name}</Text>:<></>}
              {hidden[item.key-1]?<Text style={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Account Number: {item.data["Account Number"]}</Text>:<></>}
              {hidden[item.key-1]?<Text style ={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Bank: {item.data.Bank}</Text>:<></>}
              {hidden[item.key-1]?<Text style ={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Date: {item.data.Date}</Text>:<></>}
              {hidden[item.key-1]?<Text style ={[{fontSize:20, fontWeight: 'bold'},{color:'#000'}]}>Balance: {item.data.Money}</Text>:<></>}
              

          </View>        
          )}
      />
      </View>
        );
      }else{
        return(
          <View style={{flex:1, justifyContent: 'center'}}>
            <Text style={{margin:10, color:'white', textAlign: 'center', backgroundColor: '#841851', padding: 20, fontSize: 20, fontWeight: 'bold', borderRadius: 10, }}>Sorry! No account statement found for this account.</Text>
          </View>
        );
      }
    }


    return(
    <LinearGradient colors={[ '#1e2127','#000','#1e2127']} style={{flex: 8, justifyContent: 'center'}}>


<Modal visible = {modal2open} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .88, backgroundColor: 'black', height: '100%',}}>  
            {handleShit()}
                <TouchableOpacity onPress={() => handle2modal()}><Icon name="arrow-left" size={30} color="#c0c0c0" style = {{marginLeft: 160, marginRight: 160, marginTop: 100, marginBottom: 0}}/></TouchableOpacity>
                <Text style = {{marginLeft: 160, marginRight: 160, color: 'white', marginBottom: 15}}>Close</Text>

            </View>
            </View>
            </Modal>

      <Modal visible = {modalopen} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .88, backgroundColor: 'black', height: '100%' }}>
                
            <ImageBackground source={require('../assets/light.jpg')} style={{width:360, height:200,elevation:10}} imageStyle = {{borderWidth: 2, borderColor: 'darkred'}} >
                        <Image source={require('../assets/designing/logocardL.png')} style={{width:100,height:40,position: 'absolute',bottom:160,left:10,alignSelf:'flex-end'}}/>
                        <Text style={[{color:'#000',fontWeight:'bold'}, {fontSize:17, position:'absolute', bottom:5, left:10,}]}>{auth().currentUser.email}</Text>
                        <Text style={[{color:'darkred',fontWeight:'bold', textAlign: 'center', fontFamily: 'times new roman'}, {fontSize:32, position:'absolute', bottom:80, left:120,}]}>Admin</Text>
                        <Image source={require('../assets/visa.png')} style={{width:40,height:40,position:'absolute',bottom:5,right:10,alignSelf:'flex-end'}}/>
            </ImageBackground>

            <TouchableOpacity onPress={() => {navigation.navigate('Dashboard'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="home" size={25} color="#c0c0c0" />  Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate('Display'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="users" size={25} color="#c0c0c0"/>  Display All Users</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate('Admin Notifications'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="bell" size={25} color="#c0c0c0"/>  Add Notificaions</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate('Feedback'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="address-card" size={25} color="#c0c0c0"/>  Feedback Reply</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate('Settings'), handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="gears" size={25} color="#c0c0c0"/>  Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlemodal()} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="envelope-o" size={25} color="#c0c0c0" />  Check Statement</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate('Login'); handlemodal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 10, marginBottom: 10}}> <Icon name="sign-out" size={25} color="#c0c0c0" />  Logout</Text>
            </TouchableOpacity>

            </View>
            </View>
      </Modal>

       <View style={{flex: 1, justifyContent: 'center'}}>
       <Text style = {{margin: 10, marginTop: 20, fontSize: 20, fontWeight: 'bold', color: '#841851'}}>Enter Email:</Text>
       <TextInput
                    placeholder="Email Address..."
                    style={[styles.notification_input, {height: '14%'}]}
                    textAlignVertical="top"
                    placeholderTextColor={"#c0c0c0"}
                    onChangeText={setemail}
                ></TextInput>
                <TouchableOpacity onPress={() => {getstatement() ; setmodal2open(true)}}>
                    <Text style= {[styles.buttons , {textAlign: 'center', color: '#c0c0c0', marginTop: 20, backgroundColor:'#841851', color: '#c0c0c0', borderColor: '#c0c0c0', borderWidth: 2, paddingBottom: 3}]}>Get Statement</Text>
                </TouchableOpacity>
        </View>
        <Text style ={{paddingLeft: 10, paddingRight: 10, marginLeft: 5,marginRight:5, textAlign: 'center', color: '#c0c0c0', fontSize: 17}}>▶For Checking the statement of a specific user, you will have to enter the email address of that customer.</Text>
        <LinearGradient colors={['#14062E','#100010','#841851','#100010', '#14062E' ]}  start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }} style={{flexDirection: 'row',borderColor:'#00008b',borderTopWidth:4,}}>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                  
                  <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                      <Icon name="home" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                      {/*<Text style= {{textAlign: 'center', color: '#c0c0c0', textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>Home</Text>*/}
                  </TouchableOpacity>
                
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                
                  <TouchableOpacity onPress={() => Alert.alert("You are already on Statement's page.")}>
                    <Icon name="envelope-o" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                    {/*<Text style= {{textAlign: 'center', color: '#c0c0c0',  textAlign: 'center',fontSize: 15, fontWeight: 'bold'}}>History</Text>*/}
                  </TouchableOpacity>
                
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                
                  <TouchableOpacity onPress={() => setmodalopen(true)}>
                    <Icon name="bars" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                    {/*<Text style= {{textAlign: 'center', color: '#c0c0c0',  textAlign: 'center',fontSize: 15, fontWeight: 'bold'}}>Menu</Text>*/}
                  </TouchableOpacity>
                  
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
                          
                          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                              <Icon name="sign-out" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                          </TouchableOpacity>
                            {/*<Text style={{color: '#c0c0c0', textAlign: 'center',fontWeight: 'bold', fontSize: 15}}>logout</Text>*/}
                        
                  </View>

              </LinearGradient>
        </LinearGradient>
    );
}