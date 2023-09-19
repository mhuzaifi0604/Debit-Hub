import React, {useState, useEffect} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet, 
    ActivityIndicator,
    ImageBackground,
    Modal, 
    TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './loading';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';


export default function User({navigation}){
    const [dark, setDark]=useState(false);
    const [balance, setBalance]=useState('');
    //const [userData, setuserData]=useState({});
    const [loading, setLoading]=useState(true);
    const [setting, setSetting]=useState(false);

    const [rst, setRst]=useState(false);
    const [pass, setPass]=useState('');
    const [error, setError]=useState('');
    
    useEffect(()=>{
        async function getDark(){
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                setDark(JSON.parse(read));
            }
            setLoading(false);
        }
        setLoading(true);
        getDark();
        
    });
    
    const darkColors=[
        '#1e2127',
        '#000',
        '#1e2127'
    ];
    const lightColors=[
        '#978282',
        '#978282',
        '#d8cfc4',
        '#d8cfc4',
    ];

    useEffect(()=>{
        async function getData(){
            const user = await firestore().collection('AccountData').doc(auth().currentUser.email).get();
            //setuserData(user.data());
            setBalance(user.data().balance);
        }
        setLoading(true);
        getData();
        setLoading(false);
    }, [loading]);

    function resetPass(){
        auth().currentUser.updatePassword(auth().currentUser.email, pass).then(()=>{
            setError("Password changed successfully")
        }).catch(err=>setError(err));
    }

    function signOut(){
        if(loading){
            return;
        }
        auth().signOut()
        .then(()=>navigation.goBack());
    }

    function styles(){
        if(dark){
            return stylesDark;
        }
        return stylesLight;
    }

    async function handleDark(){
        setDark(!dark);
        await AsyncStorage.setItem('darkMode', JSON.stringify(!dark));
    }

    function settingsModal(){
        if(!rst){
            return(
                <View style={{flex:1}}>
                <TouchableOpacity 
                    style={{flex:1,alignItems:'center',justifyContent:'center'}}
                    onPress={handleDark}
                >
                    <Icon name={dark?"sun-o":"moon-o"} size={50} color={dark?"#c0c0c0":"#801818"} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{flex:1,alignItems:'center',justifyContent:'center'}}
                    onPress={()=>setRst(true)}
                >
                    <Icon name="unlock-alt" size={50} color={dark?"#c0c0c0":"#801818"} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{flex:1,alignItems:'center',justifyContent:'center'}}
                    onPress={()=>setSetting(false)}
                >
                      <Icon name="window-close-o" size={50} color={dark?"#c0c0c0":"#801818"} />
                </TouchableOpacity>
                </View>
            );
        }
        else{
            return(
                
                <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:10}}>
                    <View style={{flex:1}}>
                    <Icon name="unlock-alt" size={45} color={dark?"#c0c0c0":"#801818"} />
                    </View>
                        <Text style={[dark?{color:'silver'}:{color:"black"}, {fontSize:15, marginTop:10, fontWeight:'bold'}]}>New Password</Text>
                        <TextInput
                            onChangeText={setPass}
                            secureTextEntry={true}
                            style={[dark?{backgroundColor:'#2e3137', color:'silver'}:{backgroundColor:'#978282', color:'black'}, {margin:10, padding:5,width:300, borderWidth:2, borderColor:"#801818", borderRadius:10, marginBottom:5}]}
                        />
                        <Text style={{marginBottom:5, color:"#801818"}}>{error}</Text>
                        <TouchableOpacity
                            onPress={resetPass}
                            style={{backgroundColor:"#801818", padding:10, paddingHorizontal:16, borderRadius:15, elevation:8, marginBottom:10}}
                        >
                            <Text style={{color:'white', fontWeight:'bold'}}>Change</Text>
                        </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{setRst(false); setPass(''); setError('')}}
                    >
                        <Icon name="arrow-left" size={30} color={dark?"#801818":"#801818"}  />
                    </TouchableOpacity>
                </View>
            );
        }
    }
        
    return(
        <View style={styles().container}>
            <LinearGradient style={styles().center} colors={dark?darkColors:lightColors}>
                <View style={styles().card}>
                    <ImageBackground source={dark?require('../assets/dark.png'):require('../assets/light.jpg')} style={{width:'100%', height:'100%',elevation:10}} imageStyle={{ borderWidth:2,borderColor:'maroon',borderRadius: 10}} >
                        <View style={{flex:1, padding:10, justifyContent:'center',alignItems:'center'}}>
                            <Loader animating={loading} />
                            <Image source={dark?require('../assets/designing/logocard.png'):require('../assets/designing/logocardL.png')} style={{width:85,height:25 ,position:'absolute',top:10,left:10,}}/>
                            <Text style={[styles().cardtext, {fontSize:55}]}>{balance}<Text style={[styles().cardtext, {fontSize:30}]}> Rs</Text></Text>
                            <Text style={[styles().cardtext, {fontSize:12, position:'absolute', bottom:10, left:10,}]}>{auth().currentUser.email}</Text>
                            <Image source={require('../assets/visa.png')} style={{width:40,height:40,position:'absolute',bottom:10,right:10,alignSelf:'flex-end'}}/>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles().row}>
                    <TouchableOpacity style={styles().btn} onPress={()=>{if(!loading)navigation.navigate('Funds')}}>
                        <Image source={require('../assets/mobile-payment.png')} style={{width:50,height:60, opacity:0.8}}/>
                        <Text style={[styles().text, {textAlign:'center', paddingTop:10}]}>Funds Transfer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles().btn} onPress={()=>{if(!loading)navigation.navigate('Bill')}}>
                        <Image source={require('../assets/bill.png')} style={{width:50,height:60, opacity:0.8}}/>
                        <Text style={[styles().text, {textAlign:'center', paddingTop:10}]}>Pay Bills</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles().row}>
                    <TouchableOpacity 
                        style={styles().btn}
                        onPress={()=>{if(!loading)navigation.navigate('Statement')}}
                    >
                       <Image source={require('../assets/bank-statement.png')} style={{width:50,height:60, opacity:0.8}}/>
                       <Text style={[styles().text, {textAlign:'center', paddingTop:10}]}>Account Statement</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles().btn} onPress={()=>{setSetting(true)}}>
                        <Image source={require('../assets/settings.png')} style={{width:50,height:60, opacity:0.8}} />
                        <Text style={[styles().text, {textAlign:'center', paddingTop:10}]}>Settings</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={setting}
                    onRequestClose={()=>setSetting(false)}
                >
                <KeyboardAvoidingView 
                    style={{flexGrow:1}}
                    behavior='height'
                    keyboardVerticalOffset={10}
                >
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <View style={[styles().setting, !rst?{width:'30%', borderRadius:15, marginLeft:'auto', borderBottomRightRadius:0,
        borderTopRightRadius:0,}:{}]}>
                            {settingsModal()}
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
            </LinearGradient>
            <LinearGradient
                colors={dark?['#14062E', '#100010', '#841851', '#100010','#14062E' ]:['#841b2d', '#be0032', '#841b2d']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles().bottom}
            >
                <TouchableOpacity style={{flex:1,  justifyContent:'space-between', alignItems:'center'}}onPress={()=>{if(!loading)navigation.navigate('ContactUs')}}>
                    {/*<Image source={require('../assets/contact.png')} style={{width:50,height:50, opacity:0.8}}/>*/}
                    <Icon name="address-card" size={30} color={dark?"#c0c0c0":"#d8cfc4"} />
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1,  justifyContent:'space-between', alignItems:'center'}} onPress={()=>{if(!loading)navigation.navigate('Notifications')}}>
                    {/*<Image source={require('../assets/notification.png')} style={{width:50,height:50, opacity:0.8}}/>*/}
                    <Icon name="bell" size={30} color={dark?"#c0c0c0":"#d8cfc4"}  />
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1,  justifyContent:'space-between', alignItems:'center'}} onPress={()=>{if(!loading)navigation.navigate('FAQ')}}>
                    {/*<Image source={require('../assets/FAQ.png')} style={{width:50,height:50, opacity:0.8}}/>*/}
                    <Icon name="question-circle" size={30} color={dark?"#c0c0c0":"#d8cfc4"}  />
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1,  justifyContent:'space-between', alignItems:'center'}} onPress={signOut}>
                    {/*<Image source={require('../assets/signout.png')} style={{width:50,height:50, opacity:0.8}}/>*/}
                    <Icon name="sign-out" size={30} color={dark?"#c0c0c0":"#d8cfc4"}  />
                </TouchableOpacity>

            </LinearGradient>
        </View>
    );
}

const stylesLight=StyleSheet.create({
    container:{
        flex:1,
    },
    center:{
        flex:10,
        backgroundColor:'#21252b',
        alignItems:'center',
    },
    bottom:{
        flex:1,
        flexDirection:'row',
        borderColor:'#801818',
        borderTopWidth:4,
        backgroundColor:'#801818',
        justifyContent:'space-between',
        alignItems:'center',
    },
    row:{
        flex:1,
        flexDirection:'row',
    },
    btn:{
        flex:1,
        margin:'7%',
        borderRadius:10,
        padding:5,
        justifyContent:'center',
        alignItems:'center',
    },
    card:{
        marginTop:'12%',
        marginBottom:'5%',
        width:'80%',
        backgroundColor:'#cfd6e0',
        flex:1.2,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        border:3,
        borderColor:'#ff8c00'
        
    },
    text:{
        fontFamily:'Baskerville',
        fontSize:18,
        color:'#801818',
        fontWeight:'bold',
    },
    cardtext:{
        color:'#801818',
        fontWeight:'bold',

    },
    setting:{
        //borderColor:'#801818',
        //borderWidth:2,
        borderRadius:15,
        backgroundColor:'#d8cfc4ee',
        height:'40%', 
        width:'90%', 
        //opacity:0.95,
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:20,
    }
});

const stylesDark=StyleSheet.create({
    container:{
        flex:1,
    },
    center:{
        flex:10,
        backgroundColor:'#21252b',
        alignItems:'center',
    },
    bottom:{
        flex:1,
        flexDirection:'row',
        borderColor:'#00008b',
        borderTopWidth:4,
        backgroundColor:'#88194E',
        justifyContent:'space-between',
        alignItems:'center',
    },
    row:{
        flex:1,
        flexDirection:'row',
    },
    btn:{
        flex:1,
        margin:'7%',
        borderRadius:10,
        padding:5,
        //borderColor:'#c0c0c0',
        //borderWidth:2,
        justifyContent:'center',
        alignItems:'center',
      
    },
    card:{
        marginTop:'12%',
        marginBottom:'5%',
        width:'80%',
        backgroundColor:'#cfd6e0',
        flex:1.2,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        border:3,
        borderColor:'#ff8c00'
        
    },
    text:{
        fontFamily:'Baskerville',
        fontSize:18,
        color:'#c0c0c0',
        fontWeight:'bold',
    },
    cardtext:{
        color:'#c0c0c0',
         fontWeight:'bold'
    },
    setting:{
        //borderColor:'#801818',
        //borderWidth:2,
        borderRadius:15,
        backgroundColor:'#21252bee',
        height:'40%', 
        width:'90%', 
        //opacity:0.95,
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:20,
    }

});