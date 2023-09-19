// Importing components from react native
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
  ImageBackground,
  Image
} from 'react-native';
// Importing libraries from react native
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
// imported screens from admin screens an screens folder
export default function Feedback({navigation}){

  // declaring and setting constants
  const [modalopen, setmodalopen] = useState(false);  
  const [modal2open, setmodal2open] = useState(false);
  const [newnotes, setnewnotes] = useState("");
  const [loading, setLoading]=useState(false);

  const [curr, setCurr]=useState("");

    const [FAQs,setFAQs]=useState([]);
    // setting hidden lconstant for hidden content in flatlist
    const [hidden, setHidden]=useState([false, false, false, false, false, false, false, false, false]);
  // function for toggling answer key for hidden and in view data
    function toggleAns(key){
      // slicing the flatlist item
        let x=hidden.slice();
        x[key-1]=!x[key-1];
        setHidden(x);
    }
    // function for getting data from the database
  async function getData(){
    // creating an array for data 
    const temp=[];
    // waiting for firestore to fetch data
    const subscriber=await firestore()
    //getting data from feedback collection from admins tab in the database
    .collection('Admin').doc('Feedback').get().then(doc=>{
        const data=doc.data();
        // getting length of feedback
        const length=data.Feedback.length;
        for(let i=0; i<length; i++){
          // pushing user input in the database
            temp.push(data.Feedback[i]);
            temp[i]["key"]=i+1;
        }
    });
    // setting loader
    setLoading(false);
    setFAQs(temp);
}

useEffect(()=>{
  // setting loader and getting data from the database
    setLoading(true);
    
    getData();
}, []);
  // function for sending feedback in the database
    async function sendfeedback(){
      // waiting for firestore to fetch data from notifications collection in the database
      await firestore().collection("Admin").doc("Notifications").get().then(doc=>{
        const data=doc.data().Feedback;
        // pushing compalint of customer into the data base along with its answer
        data.push({Question:curr.Complaint, Answer:newnotes, user:curr.User});
        //getting data from notificaions collection in the database
        firestore().collection("Admin").doc("Notifications").update({
          Feedback:data
        }).then(alert("Sent feedback")); // alert that feedback has been sent
      })
      
    }
      // function for handling modal
    function handlemodal(){
      // setting modal state equals to false
        setmodalopen(false);
    }
      // function for handling modal
    function handle2modal(){
      // setting modal state equals to false
      setmodal2open(false);
    }

    return(
      //setting style for linear geradient for feedback screen
        <LinearGradient colors={[ '#1e2127','#000','#1e2127']} style={{flex: 8, justifyContent: 'center'}}>
{/* setting style for modal for navigating to different screens */}
<Modal visible = {modal2open} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .88, backgroundColor: 'black', height: '100%' }}>
                {/* setting image as the background for the logo card */}
            <ImageBackground source={require('../assets/light.jpg')} style={{width:360, height:200,elevation:10}} imageStyle = {{borderWidth: 2, borderColor: 'darkred'}} >
                        {/* setting image style for admin's logo card */}
                        <Image source={require('../assets/designing/logocardL.png')} style={{width:100,height:40,position: 'absolute',bottom:160,left:10,alignSelf:'flex-end'}}/>
                        <Text style={[{color:'#000',fontWeight:'bold'}, {fontSize:17, position:'absolute', bottom:5, left:10,}]}>{auth().currentUser.email}</Text>
                        <Text style={[{color:'darkred',fontWeight:'bold', textAlign: 'center', fontFamily: 'times new roman'}, {fontSize:32, position:'absolute', bottom:80, left:120,}]}>Admin</Text>
                        <Image source={require('../assets/visa.png')} style={{width:40,height:40,position:'absolute',bottom:5,right:10,alignSelf:'flex-end'}}/>
            </ImageBackground>
            {/* touchable opacity for navigating onto the dashboard */}
            <TouchableOpacity onPress={() => {navigation.navigate('Dashboard'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="home" size={25} color="#c0c0c0" />  Dashboard</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the display all users screen */}
            <TouchableOpacity onPress={() => {navigation.navigate('Display'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="users" size={25} color="#c0c0c0"/>  Display All Users</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the admin notifications */}
            <TouchableOpacity onPress={() => {navigation.navigate('Admin Notifications'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="bell" size={25} color="#c0c0c0"/>  Add Notificaions</Text>
            </TouchableOpacity>
            {/* touchable opacity for closing the modal */}
            <TouchableOpacity onPress={() => handle2modal()} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="address-card" size={25} color="#c0c0c0"/>  Feedback Reply</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the settings screen */}
            <TouchableOpacity onPress={() => {navigation.navigate('Settings'), handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="gears" size={25} color="#c0c0c0"/>  Change Password</Text>
            </TouchableOpacity>
            {/* touchable opacity for navigating onto the admin statement */}
            <TouchableOpacity onPress={() => {navigation.navigate('Admin Statements'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="envelope-o" size={25} color="#c0c0c0" />  Check Statement</Text>
            </TouchableOpacity>
            {/* touchable opacity for logging out of the application */}
            <TouchableOpacity onPress={() => {navigation.navigate('Login'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 10, marginBottom: 10}}> <Icon name="sign-out" size={25} color="#c0c0c0" />  Logout</Text>
            </TouchableOpacity>
              {/* closing view and modal tags */}
            </View>
            </View>
            </Modal>
          {/* setting style for 2nd modal */}
        <Modal visible = {modalopen} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .9, backgroundColor: 'black', height: '70%', borderTopLeftRadius: 40,borderTopRightRadius: 40,borderTopColor: '#c0c0c0',borderLeftColor: '#c0c0c0',borderRightColor: '#c0c0c0', borderTopWidth: 4, borderLeftWidth: 4, borderRightWidth: 4, }}>
                 {/* text input for feedback reply to the customer */}
                 <TextInput
                 /*  styles for feedback reply*/
                    placeholder="Feedback Reply ..."
                    style={styles.notification_input}
                    textAlignVertical="top"
                    multiline={true}
                    placeholderTextColor={"#c0c0c0"}
                    onChangeText={setnewnotes}
                ></TextInput>
                {/* touchable opacity for sending feedback and handeling modal */}
                 <TouchableOpacity style={{marginTop: 50, marginLeft: 120, marginRight: 120, backgroundColor: 'transparent', borderRadius: 20}}
                    onPress= {() => {handlemodal() ; sendfeedback(); }} 
                    >
                     <Text style= {[{textAlign: 'center', color: '#c0c0c0', backgroundColor: "#841851", borderColor: "#c0c0c0",borderWidth: 4, fontSize: 20, fontWeight: 'bold', borderRadius: 15, paddingTop:5}]}>Send</Text> 
                </TouchableOpacity>
                  {/* touchable opacity for closing the send feedback modal */}
                <TouchableOpacity
                style = {{width:'100%',marginBottom: 10, left: 160, right: 160 ,position:'absolute',  bottom:10, alignContent:'center'}}
                onPress={() => handlemodal()}>{/* handling modal (closing modal) */}
                  <Icon name="arrow-left" size={30} color="#c0c0c0" />
                  <Text style = {{color: 'white'}}>Close</Text>
                </TouchableOpacity>
                {/* closing view AND modal tags */}
            </View>
            </View>
            </Modal>
        <FlatList
        // setting data for flatlist equals to the FAQs
            data={FAQs}
            // rendering items into the flatlist
            renderItem={({ item }) => (
              //setting styles for flat list items
            <View style={{backgroundColor: '#841851', borderRadius: 15,paddingTop: 25,paddingBottom: 25,paddingVertical:15,borderBottomWidth:1.5,borderTopWidth:0,borderColor:'#14062E',paddingHorizontal:10, margin: 10, marginBottom: 0}}>
                <View style = {{flex:1,flexDirection:'row'}} >
                  {/* getting user name or email address */}
                    <Text style={[{fontSize:20,color:'white',flex:10}, {fontWeight:'normal'}]}>{item.User}</Text>  
                    <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns(item.key)}>{/* toggling icons for hidden content */}
                        <Text style={[{fontSize:25,fontWeight:'bold'}, {color:'#000'}]}>{!hidden[item.key-1]?"\u{1F448}":"\u{1F447}"}</Text>                 
                    </TouchableOpacity>
                </View>
                {/* displaying hidden content of each flat list item */}
                {hidden[item.key-1]?<Text style={[{fontSize:18, fontWeight: 'bold'},{color:'#000'}]}>FeedBack: {item.Complaint}</Text>:<></>}
                {hidden[item.key-1]?<TouchableOpacity onPress={() => {setmodalopen(true); setCurr(item)}}>
                  {/* text input for sending feedback reply */}
                    <Text style= {[styles.buttons , {textAlign: 'center', color: '#c0c0c0'}]}>Reply</Text>
                </TouchableOpacity>:<></>}

            </View>        
            )}
        />

{/* setting style and dimensions for linear gradients */}
<LinearGradient colors={['#14062E','#100010','#841851','#100010', '#14062E' ]}  start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }} style={{flexDirection: 'row',borderColor:'#00008b',borderTopWidth:4,}}>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                  {/* touchable opacity for navigating onto the dashboard */}
                  <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                      <Icon name="home" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                      {/*<Text style= {{textAlign: 'center', color: '#c0c0c0', textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>Home</Text>*/}
                  </TouchableOpacity>
                
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {/* touchable opacity for navigating onto the admin statements */}
                  <TouchableOpacity onPress={() => navigation.navigate("Admin Statements")}>
                    <Icon name="envelope-o" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                    {/*<Text style= {{textAlign: 'center', color: '#c0c0c0',  textAlign: 'center',fontSize: 15, fontWeight: 'bold'}}>History</Text>*/}
                  </TouchableOpacity>
                
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {/* touchable opacity for closing the modal */}
                  <TouchableOpacity onPress={() => setmodal2open(true)}>
                    <Icon name="bars" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                    {/*<Text style= {{textAlign: 'center', color: '#c0c0c0',  textAlign: 'center',fontSize: 15, fontWeight: 'bold'}}>Menu</Text>*/}
                  </TouchableOpacity>
                  
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
                          {/* touchable opacity for logging out of the appliocation */}
                          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                              <Icon name="sign-out" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                          </TouchableOpacity>
                            {/*<Text style={{color: '#c0c0c0', textAlign: 'center',fontWeight: 'bold', fontSize: 15}}>logout</Text>*/}
                        
                  </View>

              </LinearGradient>


   </LinearGradient>
    );
}