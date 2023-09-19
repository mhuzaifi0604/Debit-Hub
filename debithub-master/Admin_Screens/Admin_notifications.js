// Importing components from react native
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  ImageBackground
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
export default function Admin_Notifications({navigation}){
    // declaring and setting constants for arrays and notifications
    const [which, setWhich]=useState("All");

    const [type, settype] = useState("");
    const [newnotes, setnewnotes]=useState("");

    const [modalopen, setmodalopen] = useState(false);

    const [modal2open, setmodal2open] = useState(false);


    const [Username, setusername] = useState("");

    const [password, setpassword] = useState("");

    const [all, setAll]=useState([]);
     
    const [notifications, setNotifications]=useState([]);

    const [feedback, setFeedback]=useState([]);

    const [promo, setPromo]=useState([]);

    const [open, setOpen]=useState(false);

    const [loading, setLoading]=useState(false);

    // function for getting data from the firebase
    async function getData(){
        // declaring arrays for notifications category
        const temp=[];
        const temp2=[];
        const temp3=[];
        const tAll=[];
        // waiting for firebase to fetch data
        const subscriber=await firestore()
        // checking data for admin in notifications collection in the databaxse
        .collection('Admin').doc('Notifications').get().then(doc=>{
            const data=doc.data();
            // getting notifications length
            const length=data.notifications.length;
            let j=0;
            for(let i=0; i<length; i++){
                // pushing userr input in the notification section of the database
                temp.push({key:i, data:data.notifications[i], type:'Bank'});
                tAll.push({key:j, data:data.notifications[i], type:'Bank'});
                j++;
            }
            const length2=data.Promotions.length;
            for(let i=0; i<length2; i++){
                // pushing userr input in the notification section of the database
                temp2.push({key:i, data:data.Promotions[i], type:'Promotions'});
                tAll.push({key:j, data:data.Promotions[i], type:'Promotions'});
                j++;
            }
            const length3=data.Feedback.length;
            for(let i=0; i<length3; i++){
                // pushing userr input in the notification section of the database
                    temp3.push({key:i, question:data.Feedback[i].Question, answer:data.Feedback[i].Answer, type:'Feedback', user:data.Feedback[i].user});
                    tAll.push({key:j, question:data.Feedback[i].Question, answer:data.Feedback[i].Answer, type:'Feedback', user:data.Feedback[i].user});
                    j++;
            }
        });
        // setting loader, notifications, promos, feedbacks and all notifications
        setLoading(false);
        setNotifications(temp);
        setPromo(temp2);
        setFeedback(temp3);
        setAll(tAll);
    }

    useEffect(()=>{
        // setting loader and getting data from the firebase
        setLoading(true);
        
        getData();
    }, []);
    // function for handeling toggle for promos, banks and notifications for feedbacks
    function handleToggle(item, index){
        index===0?setWhich('Promotions'):index===1?setWhich('Feedback'):index===2?setWhich('Bank'):setWhich('All');
        setOpen(false);
    }
    // function for sending feedback reply to the customer
    async function sendfeedback(){
        // setting loader equals to true
        setLoading(true);
        // waiting for the firebase to fetch data 
        const subscriber=await firestore()
        // getting data from the notifications collection for the admin
        .collection('Admin').doc('Notifications').get().then(doc=>{
            const data=doc.data();
            // check if the type entered was promo
            if(type==='Promotions'){
                const fd=data.Promotions;
                // pushing user's input into the promotions section in the database
                fd.push(newnotes);
                // getting data from notifications collection in the database for the admin
                const userDocument=firestore().collection('Admin').doc('Notifications')
                .update({
                    Promotions:fd
                }).then(setLoading(false)); // setting loader equals to false
            }
            // check if the type entered was banks
            else if(type==="Bank"){
                const fd=data.notifications;
                // pushing user's input in the database
                fd.push(newnotes);

                const userDocument=firestore().collection('Admin').doc('Notifications')
                .update({
                    notifications:fd
                }).then(setLoading(false));
            }
        });
        setLoading(false); //setting loader == false
    }

    // function for handeling modal
    function handlemodal(){
        // setting modal state == false
        setmodalopen(false);

    }

    // function for handeling second modal
    function handle2modal(){
        // setting modal state == false
        setmodal2open(false);
      }
    
    const items=[
        // declaring labels for all arrays
        {label:'All'},
        {label:'Bank'},
        {label:'Feedback'},
        {label:'Promotions'},
    ]

    return(
        // gesture recognizer to function on swipe down
        <GestureRecognizer                   
        onSwipeDown={(e)=>{
            // what does the app do on swiping down
            // getting data and setting loader =  false
            setLoading(true);
            getData();
        }}
        style={{flex:1}}
    >
        {/* setting linear gradient for the modal and the admin notification screen */}
        <LinearGradient colors={['#1e2127','#000','#1e2127']} style={[{flex:8, justifyContent:'center', alignItems:'center'}, { backgroundColor:'#d8cfc4',flex:1}]}>
            {/* setting modal and its views style */}
        <Modal visible = {modal2open} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .88, backgroundColor: 'black', height: '100%' }}>
                {/* setting image as the background for logos card */}
            <ImageBackground source={require('../assets/light.jpg')} style={{width:360, height:200,elevation:10}} imageStyle = {{borderWidth: 2, borderColor: 'darkred'}} >
                {/* setting style and images for logo card for admin */}
                        <Image source={require('../assets/designing/logocardL.png')} style={{width:100,height:40,position: 'absolute',bottom:160,left:10,alignSelf:'flex-end'}}/>
                        <Text style={[{color:'#000',fontWeight:'bold'}, {fontSize:17, position:'absolute', bottom:5, left:10,}]}>{auth().currentUser.email}</Text>
                        <Text style={[{color:'darkred',fontWeight:'bold', textAlign: 'center', fontFamily: 'times new roman'}, {fontSize:32, position:'absolute', bottom:80, left:120,}]}>Admin</Text>
                        <Image source={require('../assets/visa.png')} style={{width:40,height:40,position:'absolute',bottom:5,right:10,alignSelf:'flex-end'}}/>
            </ImageBackground>
                {/*touchable opacity for navigating onto the dashboard*/}
            <TouchableOpacity onPress={() => {navigation.navigate('Dashboard'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
             {/* text for dashboard navigation */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="home" size={25} color="#c0c0c0" />  Dashboard</Text>
            </TouchableOpacity>
                {/*touchable opacity for navigating onto display all users*/}
            <TouchableOpacity onPress={() => {navigation.navigate('Display'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for display all users navigation */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="users" size={25} color="#c0c0c0"/>  Display All Users</Text>
            </TouchableOpacity>
                {/*touchable opacity for navigating onto the closing the model*/}
            <TouchableOpacity onPress={() => handle2modal()} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for closing the modal becz we are already at the screen we require */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="bell" size={25} color="#c0c0c0"/>  Add Notificaions</Text>
            </TouchableOpacity>
            {/*touchable opacity for navigating onto the feedback reply screen*/}
            <TouchableOpacity onPress={() => {navigation.navigate('Feedback'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for feedback reply navigation */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="address-card" size={25} color="#c0c0c0"/>  Feedback Reply</Text>
            </TouchableOpacity>
            {/*touchable opacity for navigating onto the settings screen*/}
            <TouchableOpacity onPress={() => {navigation.navigate('Settings'), handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for settings navigation */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="gears" size={25} color="#c0c0c0"/>  Change Password</Text>
            </TouchableOpacity>
                {/*touchable opacity for navigating onto the Admin Statements screen*/}
            <TouchableOpacity onPress={() => {navigation.navigate('Admin Statements'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for Admin statement navigation */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 15, marginBottom: 10}}> <Icon name="envelope-o" size={25} color="#c0c0c0" />  Check Statement</Text>
            </TouchableOpacity>
                {/*touchable opacity for logging out of the application*/}
            <TouchableOpacity onPress={() => {navigation.navigate('Login'); handle2modal()}} style = {{ marginTop: 5 , backgroundColor: '#841851', borderBottomColor: 'maroon', borderWidth: 2, opacity: 0.7}}>
              {/* text for logging out of the appliocation */}
              <Text style ={{color: '#c0c0c0', fontSize: 20, fontWeight: 'bold', fontFamily: 'times new roman', marginLeft: 10, marginTop: 10, marginBottom: 10}}> <Icon name="sign-out" size={25} color="#c0c0c0" />  Logout</Text>
            </TouchableOpacity>
                {/* closing view and modal tags */}
            </View>
            </View>
            </Modal>
                {/* setting 2nd modal's style */}
            <Modal visible = {modalopen} animationType = 'slide' transparent = {true}>
            <View style= {{flex: 1,justifyContent: 'flex-end'}}>
            <View style={{opacity: .9, backgroundColor: 'black', height: '80%', borderTopLeftRadius: 40,borderTopRightRadius: 40,borderTopColor: '#c0c0c0',borderLeftColor: '#c0c0c0',borderRightColor: '#c0c0c0', borderTopWidth: 4, borderLeftWidth: 4, borderRightWidth: 4, }}>
                {/* text input for entering notification's type */}
                <TextInput
                // setting style
                    placeholder="Enter Notification Type..."
                    style={[styles.notification_input, {height: '14%'}]}
                    textAlignVertical="top"
                    placeholderTextColor={"#c0c0c0"}
                    onChangeText={settype}
                ></TextInput>
                {/* text input for entering notification */}
                 <TextInput
                 // setting style
                    placeholder="Add New Notification..."
                    style={styles.notification_input}
                    textAlignVertical="top"
                    multiline={true}
                    placeholderTextColor={"#c0c0c0"}
                    onChangeText={setnewnotes}
                ></TextInput>
                {/* touchable opacity for calling function for getting notifications froom the feedback and handeling modal and generating alert for the notification */}
                 <TouchableOpacity style={{marginTop: 50, marginLeft: 120, marginRight: 120, backgroundColor: 'transparent', borderRadius: 20}}
                    onPress= {() => {handlemodal() ; sendfeedback() ;  Alert.alert('New Notificaion Added')}} 
                    >
                     <Text style= {[{textAlign: 'center', color: '#c0c0c0', backgroundColor: "#841851", borderColor: "#c0c0c0",borderWidth: 4, fontSize: 20, fontWeight: 'bold', borderRadius: 15, paddingTop:5}]}>ADD</Text> 
                     
                </TouchableOpacity>
                {/* icon for the touchable opacity indicating closing the modal */}
                <TouchableOpacity onPress={() => handlemodal()}><Icon name="arrow-left" size={30} color="#c0c0c0" style = {{marginLeft: 160, marginRight: 160, marginTop: 100, marginBottom: 0}}/></TouchableOpacity>
                <Text style = {{marginLeft: 160, marginRight: 160, color: 'white'}}>Close</Text>

            </View>
            </View>
            </Modal>
            
            <View style={{flex:1, width:'100%'}}>
                    {/* flat list for handling the notifications of different types */}
                <FlatList
                    contentContainerStyle={{paddingHorizontal:10, padding: 10}}
                    // checking which type of notification was sent
                    data={which=='All'?all:which=='Bank'?notifications:which=='Feedback'?feedback:promo}
                    // rendering item into the flatlist
                    renderItem={({item})=>
                        {
                            // checking question proprty from the database
                            if(!item.hasOwnProperty('question')){
                                return(
                                    
                                    <View style={[{ width:'100%',marginTop:10,borderRadius:15,paddingVertical:15,backgroundColor:'#841851',}, {width:'100%'}]}>
                                         {/* displaying notification data */}
                                        <Text style={[{fontSize:20,color:'silver', padding: 10}, {fontWeight:'normal'}]}>{item.data}</Text>
                                    </View>
                                );
                            }else{
                                return(
                                    // if the notification type was feedback then answer is displayed in reply of the question with his email
                                    <View style={[{ width:'100%',marginTop:10,borderRadius:15,paddingVertical:15,backgroundColor:'#841851', padding:10}, {width:'100%'}]}>
                                        <Text style={[{fontSize:20,color:'silver'}, {fontWeight:'bold'}]}>{item.user}: {item.question}</Text>
                                        <Text style={[{fontSize:20,color:'silver'}, {fontWeight:'normal'}]}>{item.answer}</Text>
                                    </View>
                                );
                            }
                        }
                    }
                />
            </View>
            <Loader animating={loading} />
            {/* touchable opacity for adding a new notification from the admin panel */}
            <TouchableOpacity onPress={() => setmodalopen(true)} style = {{marginLeft: 170, position: 'absolute', right: 15, bottom: 124}}>
                    <Icon name="plus" size={50} color="#c0c0c0" style ={[styles.adder, {borderColor: '#c0c0c0', borderWidth: 2}]} />
                    </TouchableOpacity>
            {/* floating menu for deciding the type of notifications admin want to see */}
            <FloatingMenu
            // setting style for notifications
                isOpen={open}
                items={items}
                onMenuToggle={isMenuOpen=>setOpen(isMenuOpen)}
                onItemPress={handleToggle}
                right={15}
                bottom={62}
                backgroundUpColor={'#841851'}
                primaryColor={'#fff'}
                backgroundDownColor={'#841851'}
                borderColor = {'#c0c0c0'}
                buttonWidth={50}
                innerWidth={45}

            />
            {/* setting linera gradient for taskbar icons */}
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
                           {/* touchable opacity for logging out*/}
                          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                              <Icon name="sign-out" size={30} color="#c0c0c0" style={{padding: 2, margin:2}}/>
                          </TouchableOpacity>
                            {/*<Text style={{color: '#c0c0c0', textAlign: 'center',fontWeight: 'bold', fontSize: 15}}>logout</Text>*/}
                        
                  </View>

              </LinearGradient>
        </LinearGradient>
    </GestureRecognizer>   
    );
}